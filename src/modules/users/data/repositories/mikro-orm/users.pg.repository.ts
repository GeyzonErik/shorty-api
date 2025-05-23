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

  async findById(id: string): Promise<User | null> {
    const user = this.entityManager.findOne(User, { id });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.entityManager.findOne(User, { email });
    return user;
  }

  async updateUser(data: User): Promise<User> {
    await this.entityManager.nativeUpdate(User, { id: data.id }, data);

    return await this.entityManager.findOneOrFail(User, { id: data.id });
  }
}
