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
import { JwtUserPayload } from '../types/jwt-user-payload.type';
import { IUserRepository } from '@/users/application/repositories/user.repository';

@Injectable()
export class UserAuthGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(IUserRepository)
  private readonly userRepo: IUserRepository;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<UserAuthenticatedRequest>();
    const token = this.extractTokenFromHeader(req);

    if (token) {
      try {
        const payload =
          await this.jwtService.verifyAsync<JwtUserPayload>(token);

        const user = await this.userRepo.findById(payload.sub);

        if (!user) {
          throw new UnauthorizedException('Invalid user');
        }

        req.user = user;
      } catch (err) {
        if (!isPublic) {
          if (err instanceof TokenExpiredError) {
            throw new UnauthorizedException('Token expirado');
          } else if (err instanceof JsonWebTokenError) {
            throw new UnauthorizedException('Token inválido');
          }
          throw new UnauthorizedException('Authentication failed');
        }
      }
    }

    if (!isPublic && !req.user) return true;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
