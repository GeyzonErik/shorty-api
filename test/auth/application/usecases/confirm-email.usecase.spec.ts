import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfirmEmail } from '@/auth/application/usecases/confirm-email.usecase';
import { JwtTokenService } from '@/auth/application/services/jwt-token.service';
import { IUserRepository } from '@/users/application/repositories/user.repository';

describe('ConfirmEmail', () => {
  let confirmEmail: ConfirmEmail;

  const mockJwtTokenService = {
    verifyEmailConfirmationToken: jest.fn(),
    generateAccessToken: jest.fn(),
  };

  const mockUserRepo = {
    findByEmail: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmEmail,
        { provide: JwtTokenService, useValue: mockJwtTokenService },
        { provide: IUserRepository, useValue: mockUserRepo },
      ],
    }).compile();

    confirmEmail = module.get<ConfirmEmail>(ConfirmEmail);
  });

  it('should be defined', () => {
    expect(confirmEmail).toBeDefined();
  });

  it('should throw NotFoundException if user not found', async () => {
    const input = { token: 'valid-token' };

    mockJwtTokenService.verifyEmailConfirmationToken.mockResolvedValue({
      email: 'test@example.com',
    });

    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(confirmEmail.execute(input)).rejects.toThrow(
      NotFoundException,
    );
    expect(
      mockJwtTokenService.verifyEmailConfirmationToken,
    ).toHaveBeenCalledWith(input.token);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should return access token if user email is already verified', async () => {
    const input = { token: 'valid-token' };
    const user = {
      id: 1,
      email: 'test@example.com',
      isEmailVerified: true,
    };

    mockJwtTokenService.verifyEmailConfirmationToken.mockResolvedValue({
      email: 'test@example.com',
    });

    mockUserRepo.findByEmail.mockResolvedValue(user);

    const accessToken = 'access-token';
    mockJwtTokenService.generateAccessToken.mockReturnValue(accessToken);

    const result = await confirmEmail.execute(input);

    expect(result.accessToken).toBe(accessToken);
    expect(
      mockJwtTokenService.verifyEmailConfirmationToken,
    ).toHaveBeenCalledWith(input.token);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockJwtTokenService.generateAccessToken).toHaveBeenCalledWith(user);
  });

  it('should update user and return access token if email is not verified', async () => {
    const input = { token: 'valid-token' };
    const user = {
      id: 1,
      email: 'test@example.com',
      isEmailVerified: false,
    };

    mockJwtTokenService.verifyEmailConfirmationToken.mockResolvedValue({
      email: 'test@example.com',
    });

    mockUserRepo.findByEmail.mockResolvedValue(user);

    const accessToken = 'access-token';
    mockJwtTokenService.generateAccessToken.mockReturnValue(accessToken);

    mockUserRepo.updateUser.mockResolvedValue(user);

    const result = await confirmEmail.execute(input);

    expect(result.accessToken).toBe(accessToken);
    expect(
      mockJwtTokenService.verifyEmailConfirmationToken,
    ).toHaveBeenCalledWith(input.token);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockUserRepo.updateUser).toHaveBeenCalledWith({
      ...user,
      isEmailVerified: true,
    });
    expect(mockJwtTokenService.generateAccessToken).toHaveBeenCalledWith(user);
  });
});
