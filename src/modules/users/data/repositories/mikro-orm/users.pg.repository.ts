import { IUserRepository } from '@/users/application/repositories/user.repository';
import { User } from '@/users/domain/entities/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class UserPgRepository implements IUserRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async create(data: User): Promise<User> {
    const user = this.entityManager.create(User, data);
    await this.entityManager.persistAndFlush(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.entityManager.findOne(User, { email });
    return user;
  }
}
