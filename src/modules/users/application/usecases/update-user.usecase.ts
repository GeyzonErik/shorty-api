import { User } from '@/users/domain/entities/user.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository';

export type UpdateUserInput = {
  user: User;
  name: string;
};

export class UpdateUser {
  @Inject(IUserRepository)
  private readonly userRepo: IUserRepository;

  async execute(data: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.findById(data.user.id);

    if (!user) throw new BadRequestException();

    user.name = data.name;

    return await this.userRepo.updateUser(user);
  }
}
