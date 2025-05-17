export class SignUpPresenter {
  static toHTTP(accessToken: string) {
    return {
      accessToken,
      message: 'User registered successfully',
    };
  }
}
