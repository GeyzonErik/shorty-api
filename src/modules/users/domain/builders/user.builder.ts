import { randomUUID } from 'crypto';
import { User } from '../entities/user.entity';
import { AUTH_PROVIDER } from '../enums/auth-provider.enum';

export class UserBuilder {
  static create(data: UserData): User {
    const user = new User();
    user.id = randomUUID();
    user.name = data.name;
    user.password = data.password;
    user.email = data.email;
    user.authProviders = [data.provider];

    return user;
  }
}

interface UserData {
  name: string;
  email: string;
  password?: string;
  provider: AUTH_PROVIDER;
}
