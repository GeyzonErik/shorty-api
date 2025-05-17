import { User } from '@/users/domain/entities/user.entity';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
}
