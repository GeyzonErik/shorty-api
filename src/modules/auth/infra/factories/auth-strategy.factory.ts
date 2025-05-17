import { IAuthStrategy } from '@/auth/application/strategies/auth-strategy';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthStrategyFactory {
  constructor(private readonly strategies: IAuthStrategy[]) {}

  getStrategy(provider: AUTH_PROVIDER) {
    const strategy = this.strategies.find((strategy) =>
      strategy.supports(provider),
    );

    if (!strategy) {
      throw new UnauthorizedException(`Provider ${provider} not supported`);
    }

    return strategy;
  }
}
