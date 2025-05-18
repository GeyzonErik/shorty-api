import { Module } from '@nestjs/common';
import { IMailerProvider } from './application/providers/mailer.provider';
import { NodemailerProvider } from './infra/providers/nodemailer.provider';

@Module({
  providers: [
    {
      provide: IMailerProvider,
      useClass: NodemailerProvider,
    },
  ],
  exports: [IMailerProvider],
})
export class NotificationModule {}
