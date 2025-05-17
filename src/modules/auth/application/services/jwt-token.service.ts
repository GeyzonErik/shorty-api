import { User } from '@/users/domain/entities/user.entity';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class JwtTokenService {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  generateAccessToken(user: User) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  }
}
