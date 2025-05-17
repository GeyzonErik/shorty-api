import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthenticatedRequest } from '../types/user-authenticated-request.type';
import { User as UserEntity } from '@/users/domain/entities/user.entity';

export const User = createParamDecorator(
  (data: keyof UserEntity, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<UserAuthenticatedRequest>();
    return data ? req.user[data] : req.user;
  },
);
