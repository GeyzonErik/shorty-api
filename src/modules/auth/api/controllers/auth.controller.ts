import { SignIn } from '@/auth/application/usecases/sign-in.usecase';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SignInRequest } from './requests/sign-in.request';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';
import { SignInPresenter } from './presenters/sign-in.presenter';
import { SignUp } from '@/auth/application/usecases/sigin-up.usecase';
import { SignUpRequest } from './requests/sign-up.request';
import { SignUpPresenter } from './presenters/sign-up.presenter';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('v1/auth')
export class AuthController {
  @Inject(SignIn)
  private signInUseCase: SignIn;
  @Inject(SignUp)
  private signUpUseCase: SignUp;

  @ApiCreatedResponse({
    description: 'User successfully logged in',
    schema: {
      example: {
        message: 'User successfully logged in',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'user-id-123',
          name: 'John Doe',
        },
      },
    },
  })
  @Post('sign-in')
  async signIn(@Body() body: SignInRequest) {
    const response = await this.signInUseCase.execute({
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
      ...body,
    });

    return SignInPresenter.toHTTP(response);
  }

  @ApiCreatedResponse({
    description: 'User successfully registered',
    schema: {
      example: {
        message:
          'User registered successfully. Please check your email for confirmation link.',
      },
    },
  })
  @Post('sign-up')
  async signUp(@Body() body: SignUpRequest) {
    await this.signUpUseCase.execute(body);
    return SignUpPresenter.toHTTP();
  }
}
