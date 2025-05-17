import {
  IAuthStrategy,
  ValidateInput,
} from '@/auth/application/strategies/auth-strategy';
import { InvalidCredentialsException } from '@/auth/domain/errors/invalid-credentials.exception';
import { IUserRepository } from '@/users/application/repositories/user.repository';
import { User } from '@/users/domain/entities/user.entity';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';
import { Inject } from '@nestjs/common';
import * as argon from 'argon2';

export class EmailPasswordStrategy implements IAuthStrategy {
  @Inject(IUserRepository)
  private userRepo: IUserRepository;

  supports(provider: AUTH_PROVIDER): boolean {
    return provider === AUTH_PROVIDER.EMAIL_PASSWORD;
  }

  async validate(data: ValidateInput): Promise<User> {
    if (data.provider !== AUTH_PROVIDER.EMAIL_PASSWORD) {
      throw new Error('Invalid provider for this strategy');
    }

    const user = await this.userRepo.findByEmail(data.email);

    if (!user || !user.password) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await argon.verify(user.password, data.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
