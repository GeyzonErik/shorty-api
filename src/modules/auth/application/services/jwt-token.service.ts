import { User } from '@/users/domain/entities/user.entity';
import { ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class JwtTokenService {
  private readonly emailConfirmationSecret =
    process.env.EMAIL_CONFIRMATION_SECRET;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  generateAccessToken(user: User) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  }

  generateEmailConfirmationToken(user: User) {
    return this.jwtService.sign(
      { email: user.email },
      {
        secret: this.emailConfirmationSecret,
        expiresIn: '1h',
      },
    );
  }

  async verifyEmailConfirmationToken(
    token: string,
  ): Promise<{ email: string }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.emailConfirmationSecret,
      });
    } catch (_err) {
      throw new ConflictException(
        'Invalid or expired email confirmation token',
      );
    }
  }
}
