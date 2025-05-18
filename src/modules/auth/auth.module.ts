import { Module } from '@nestjs/common';
import { EmailPasswordStrategy } from './infra/strategies/email-password.strategy';
import { AuthStrategyFactory } from './infra/factories/auth-strategy.factory';
import { JwtTokenService } from './application/services/jwt-token.service';
import { AuthController } from './api/controllers/auth.controller';
import { UserModule } from '@/users/users.module';
import { SignIn } from './application/usecases/sign-in.usecase';
import { SignUp } from './application/usecases/sigin-up.usecase';
import { CoreModule } from '@/core/core.module';
import { NotificationModule } from '@/notifications/notification.module';
import { ConfirmEmailController } from './api/controllers/confirm-email.controller';
import { ConfirmEmail } from './application/usecases/confirm-email.usecase';

@Module({
  imports: [UserModule, CoreModule, NotificationModule],
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
    ConfirmEmail,
  ],
  exports: [],
  controllers: [AuthController, ConfirmEmailController],
})
export class AuthModule {}
