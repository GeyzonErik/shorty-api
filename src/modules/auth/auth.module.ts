import { Module } from '@nestjs/common';
import { EmailPasswordStrategy } from './infra/strategies/email-password.strategy';
import { AuthStrategyFactory } from './infra/factories/auth-strategy.factory';
import { JwtTokenService } from './application/services/jwt-token.service';
import { AuthController } from './api/controllers/auth.controller';
import { UserModule } from '@/users/users.module';
import { SignIn } from './application/usecases/sign-in.usecase';
import { SignUp } from './application/usecases/sigin-up.usecase';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [UserModule, CoreModule],
  providers: [
    JwtTokenService,
    EmailPasswordStrategy,
    {
      provide: AuthStrategyFactory,
      useFactory: (email: EmailPasswordStrategy) =>
        new AuthStrategyFactory([email]),
      inject: [EmailPasswordStrategy],
    },
    // usecases
    SignIn,
    SignUp,
  ],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}
