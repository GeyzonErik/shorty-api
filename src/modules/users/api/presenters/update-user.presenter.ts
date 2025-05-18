import { User } from '@/users/domain/entities/user.entity';

export class UpdateUserPresenter {
  static toHTTP(data: User) {
    return {
      id: data.id,
      message: 'User Fsuccessfully updated',
    };
  }
}
