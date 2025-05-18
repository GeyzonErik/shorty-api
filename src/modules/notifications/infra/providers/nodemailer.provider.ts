import { IMailerProvider } from '@/notifications/application/providers/mailer.provider';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerProvider implements IMailerProvider {
  private appMail = process.env.MAIL_USER;
  private readonly from = `"Shorty" ${this.appMail}`;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: this.appMail,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error('Error sending email:', err);
      throw new Error('Failed to send email');
    }
  }
}
