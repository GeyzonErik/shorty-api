import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { UserAuthenticatedRequest } from '../types/user-authenticated-request.type';
import { Request } from 'express';
import { User } from '@/users/domain/entities/user.entity';

@Injectable()
export class UserAuthGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<UserAuthenticatedRequest>();
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Missing auth token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<User>(token);
      req.user = payload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
