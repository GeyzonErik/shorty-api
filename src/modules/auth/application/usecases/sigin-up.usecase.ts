import { IUserRepository } from '@/users/application/repositories/user.repository';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtTokenService } from '../services/jwt-token.service';
import * as argon from 'argon2';
import { UserBuilder } from '@/users/domain/builders/user.builder';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class SignUp {
  @Inject(IUserRepository)
  private readonly userRepo: IUserRepository;
  @Inject(JwtTokenService)
  private readonly jwtService: JwtTokenService;

  async execute(data: SignUpInput): Promise<string> {
    const existisUser = await this.userRepo.findByEmail(data.email);

    if (existisUser) {
      throw new ConflictException('');
    }

    const hashedPass = await argon.hash(data.password);

    const newUserData = UserBuilder.create({
      ...data,
      password: hashedPass,
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
    });

    const newUser = await this.userRepo.create(newUserData);

    const accessToken = this.jwtService.generateAccessToken(newUser);

    return accessToken;
  }
}
