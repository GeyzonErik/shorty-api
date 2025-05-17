import { Module } from '@nestjs/common';
import { EmailPasswordStrategy } from './infra/strategies/email-password.strategy';
import { AuthStrategyFactory } from './infra/factories/auth-strategy.factory';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './application/services/jwt-token.service';
import { AuthController } from './api/controllers/auth.controller';
import { UserModule } from '@/users/users.module';
import { SignIn } from './application/usecases/sign-in.usecase';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignUp } from './application/usecases/sigin-up.usecase';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
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
  exports: [JwtTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
