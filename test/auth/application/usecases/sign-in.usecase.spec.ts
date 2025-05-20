import { JwtTokenService } from '@/auth/application/services/jwt-token.service';
import { EmailPasswordInput } from '@/auth/application/strategies/auth-strategy';
import { SignIn } from '@/auth/application/usecases/sign-in.usecase';
import { AuthStrategyFactory } from '@/auth/infra/factories/auth-strategy.factory';
import { User } from '@/users/domain/entities/user.entity';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

describe('SignIn', () => {
  let signIn: SignIn;

  const mockJwtTokenService = {
    generateAccessToken: jest.fn(),
  };

  const mockAuthStrategyFactory = {
    getStrategy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignIn,
        { provide: JwtTokenService, useValue: mockJwtTokenService },
        { provide: AuthStrategyFactory, useValue: mockAuthStrategyFactory },
      ],
    }).compile();

    signIn = module.get<SignIn>(SignIn);
  });

  it('should be defined', () => {
    expect(signIn).toBeDefined();
  });

  it('should generate an access token and return user data on success', async () => {
    const input: EmailPasswordInput = {
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
      email: 'test@example.com',
      password: 'password',
    };

    const user = new User();
    user.id = randomUUID();
    user.email = 'test@example.com';
    user.name = 'Test User';

    const mockStrategy = {
      validate: jest.fn().mockResolvedValue(user),
    };

    mockAuthStrategyFactory.getStrategy.mockReturnValue(mockStrategy);

    const token = 'some-generated-token';
    mockJwtTokenService.generateAccessToken.mockReturnValue(token);

    const result = await signIn.execute(input);

    expect(result.accessToken).toBe(token);
    expect(result.user).toBe(user);
    expect(mockAuthStrategyFactory.getStrategy).toHaveBeenCalledWith(
      input.provider,
    );
    expect(mockStrategy.validate).toHaveBeenCalledWith(input);
    expect(mockJwtTokenService.generateAccessToken).toHaveBeenCalledWith(user);
  });
});
