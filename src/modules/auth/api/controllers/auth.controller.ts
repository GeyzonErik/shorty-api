import { SignIn } from '@/auth/application/usecases/sign-in.usecase';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SignInRequest } from './requests/sign-in.request';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';
import { SignInPresenter } from './presenters/sign-in.presenter';
import { SignUp } from '@/auth/application/usecases/sigin-up.usecase';
import { SignUpRequest } from './requests/sign-up.request';
import { SignUpPresenter } from './presenters/sign-up.presenter';

@Controller('v1/auth')
export class AuthController {
  @Inject(SignIn)
  private signInUseCase: SignIn;
  @Inject(SignUp)
  private signUpUseCase: SignUp;

  @Post('sign-in')
  async signIn(@Body() body: SignInRequest) {
    const response = await this.signInUseCase.execute({
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
      ...body,
    });

    return SignInPresenter.toHTTP(response);
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpRequest) {
    const response = await this.signUpUseCase.execute(body);
    return SignUpPresenter.toHTTP(response);
  }
}
