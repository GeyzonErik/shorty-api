import { User } from '@/users/domain/entities/user.entity';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';

export type EmailPasswordInput = {
  provider: AUTH_PROVIDER.EMAIL_PASSWORD;
  email: string;
  password: string;
};

export type GoogleOAuthInput = {
  provider: AUTH_PROVIDER.GOOGLE;
  token: string;
};

export type ValidateInput = EmailPasswordInput | GoogleOAuthInput;

export interface IAuthStrategy {
  supports(provider: AUTH_PROVIDER): boolean;
  validate(data: ValidateInput): Promise<User>;
}
