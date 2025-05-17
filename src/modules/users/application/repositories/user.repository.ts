import { User } from '@/users/domain/entities/user.entity';

export abstract class IUserRepository {
  abstract create(data: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
