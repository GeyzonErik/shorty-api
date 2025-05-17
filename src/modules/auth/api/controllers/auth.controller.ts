import { SignIn } from '@/auth/application/usecases/sign-in.usecase';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SignInRequest } from './requests/sign-in.request';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';
import { SignInPresenter } from './presenters/sign-in.presenter';

@Controller('v1/auth')
export class AuthController {
  @Inject(SignIn)
  private signInUseCase: SignIn;

  @Post('sign-in')
  async signIn(@Body() body: SignInRequest) {
    const response = await this.signInUseCase.execute({
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
      ...body,
    });

    return SignInPresenter.toHTTP(response);
  }
}
