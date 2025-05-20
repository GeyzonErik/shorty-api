import { IUserRepository } from '@/users/application/repositories/user.repository';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtTokenService } from '../services/jwt-token.service';
import * as argon from 'argon2';
import { UserBuilder } from '@/users/domain/builders/user.builder';
import { AUTH_PROVIDER } from '@/users/domain/enums/auth-provider.enum';
import { IMailerProvider } from '@/notifications/application/providers/mailer.provider';
import { confirmationEmailTemplate } from '@/notifications/infra/mail/templates/confirmation-email.template';
import { User } from '@/users/domain/entities/user.entity';

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class SignUp {
  private baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT}`;

  @Inject(IUserRepository)
  private readonly userRepo: IUserRepository;
  @Inject(JwtTokenService)
  private readonly jwtService: JwtTokenService;
  @Inject(IMailerProvider)
  private readonly mailerProvider: IMailerProvider;

  async execute(data: SignUpInput): Promise<void> {
    const existisUser = await this.userRepo.findByEmail(
      data.email.toLowerCase(),
    );

    if (existisUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPass = await argon.hash(data.password);

    const newUserData = UserBuilder.create({
      ...data,
      password: hashedPass,
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
    });

    const newUser = await this.userRepo.create(newUserData);

    await this.handleConfirmationEmail(newUser);
  }

  private async handleConfirmationEmail(user: User) {
    const emailConfirmationToken =
      this.jwtService.generateEmailConfirmationToken(user);

    const confirmationLink = `${this.baseUrl}/confirm-email?token=${emailConfirmationToken}`;

    const emailBody = confirmationEmailTemplate(user.name, confirmationLink);

    await this.mailerProvider.sendMail(
      user.email,
      'Confirm your email address',
      emailBody,
    );
  }
}
