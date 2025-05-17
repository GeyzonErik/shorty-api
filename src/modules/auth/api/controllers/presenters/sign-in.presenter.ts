import { SignInOutput } from '@/auth/application/usecases/sign-in.usecase';

export class SignInPresenter {
  static toHTTP(data: SignInOutput) {
    return {
      message: 'Usuário logado com sucesso',
      accessToken: data.accessToken,
      user: {
        id: data.user.id,
        name: data.user.name,
      },
    };
  }
}
