import { User } from '@/users/domain/entities/user.entity';
import { Request } from 'express';

export interface UserAuthenticatedRequest extends Request {
  user: User;
}
