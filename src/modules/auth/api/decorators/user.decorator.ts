import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthenticatedRequest } from '../types/user-authenticated-request.type';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<UserAuthenticatedRequest>();
    return req.user;
  },
);
