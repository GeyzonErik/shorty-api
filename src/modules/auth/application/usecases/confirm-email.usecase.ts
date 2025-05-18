import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtTokenService } from '../services/jwt-token.service';
import { IUserRepository } from '@/users/application/repositories/user.repository';

export type ConfirmEmailInput = {
  token: string;
};

export type ConfirmEmailOutput = {
  accessToken: string;
};

@Injectable()
export class ConfirmEmail {
  @Inject(JwtTokenService)
  private readonly jwtSerive: JwtTokenService;
  @Inject(IUserRepository)
  private readonly userRepo: IUserRepository;

  async execute(data: ConfirmEmailInput): Promise<ConfirmEmailOutput> {
    const payload = await this.jwtSerive.verifyEmailConfirmationToken(
      data.token,
    );

    const user = await this.userRepo.findByEmail(payload.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      return {
        accessToken: this.jwtSerive.generateAccessToken(user),
      };
    }

    user.isEmailVerified = true;

    await this.userRepo.updateUser(user);

    const accessToken = this.jwtSerive.generateAccessToken(user);

    return { accessToken };
  }
}
