import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import * as argon from 'argon2';
import { SignUp } from '@/auth/application/usecases/sigin-up.usecase';
import { IUserRepository } from '@/users/application/repositories/user.repository';
import { JwtTokenService } from '@/auth/application/services/jwt-token.service';
import { IMailerProvider } from '@/notifications/application/providers/mailer.provider';
import { UserBuilder } from '@/users/domain/builders/user.builder';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';

describe('SignUp', () => {
  let signUp: SignUp;

  const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtTokenService = {
    generateEmailConfirmationToken: jest.fn(),
  };

  const mockMailerProvider = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUp,
        { provide: IUserRepository, useValue: mockUserRepo },
        { provide: JwtTokenService, useValue: mockJwtTokenService },
        { provide: IMailerProvider, useValue: mockMailerProvider },
      ],
    }).compile();

    signUp = module.get<SignUp>(SignUp);
  });

  it('should be defined', () => {
    expect(signUp).toBeDefined();
  });

  it('should throw ConflictException if email already exists', async () => {
    const input = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
    };

    mockUserRepo.findByEmail.mockResolvedValue(true);

    await expect(signUp.execute(input)).rejects.toThrow(ConflictException);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(input.email);
  });

  it('should create a new user and send confirmation email', async () => {
    const input = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
    };

    mockUserRepo.findByEmail.mockResolvedValue(null);

    jest.spyOn(argon, 'hash').mockResolvedValue('hashed-password');

    const newUser = UserBuilder.create({
      ...input,
      password: 'hashed-password',
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
    });

    mockUserRepo.create.mockResolvedValue(newUser);

    const emailConfirmationToken = 'some-email-confirmation-token';
    mockJwtTokenService.generateEmailConfirmationToken.mockReturnValue(
      emailConfirmationToken,
    );

    mockMailerProvider.sendMail.mockResolvedValue(true);

    await signUp.execute(input);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(input.email);
    expect(
      mockJwtTokenService.generateEmailConfirmationToken,
    ).toHaveBeenCalledWith(newUser);
    expect(mockMailerProvider.sendMail).toHaveBeenCalledWith(
      input.email,
      'Confirm your email address',
      expect.stringContaining(emailConfirmationToken),
    );
  });
});
