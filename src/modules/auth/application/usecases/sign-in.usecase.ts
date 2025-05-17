import { AuthStrategyFactory } from '@/auth/infra/factories/auth-strategy.factory';
import { Inject, Injectable } from '@nestjs/common';
import {
  EmailPasswordInput,
  GoogleOAuthInput,
} from '../strategies/auth-strategy';
import { User } from '@/users/domain/entities/user.entity';
import { JwtTokenService } from '../services/jwt-token.service';

export type SignInInput = EmailPasswordInput | GoogleOAuthInput;

export type SignInOutput = {
  accessToken: string;
  user: User;
};

@Injectable()
export class SignIn {
  @Inject(AuthStrategyFactory)
  private readonly strategyFactory: AuthStrategyFactory;
  @Inject(JwtTokenService)
  private readonly jwtService: JwtTokenService;

  async execute(data: SignInInput): Promise<SignInOutput> {
    const strategy = this.strategyFactory.getStrategy(data.provider);

    const user = await strategy.validate(data);

    const accessToken = this.jwtService.generateAccessToken(user);

    return {
      accessToken,
      user,
    };
  }
}
