export abstract class IMailerProvider {
  abstract sendMail(to: string, subject: string, html: string): Promise<void>;
}
