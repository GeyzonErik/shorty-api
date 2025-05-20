import { NodemailerProvider } from '@/notifications/infra/providers/nodemailer.provider';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('NodemailerProvider', () => {
  let nodemailerProvider: NodemailerProvider;
  const sendMailMock = jest.fn();

  beforeEach(() => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    process.env.MAIL_USER = 'test@example.com';
    process.env.GOOGLE_CLIENT_ID = 'fake-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'fake-client-secret';
    process.env.GOOGLE_REFRESH_TOKEN = 'fake-refresh-token';

    nodemailerProvider = new NodemailerProvider();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call transporter.sendMail with correct parameters', async () => {
    sendMailMock.mockResolvedValueOnce({});

    await nodemailerProvider.sendMail(
      'to@example.com',
      'Subject',
      '<p>Hello</p>',
    );

    expect(sendMailMock).toHaveBeenCalledWith({
      from: `"Shorty" test@example.com`,
      to: 'to@example.com',
      subject: 'Subject',
      html: '<p>Hello</p>',
    });
  });

  it('should throw an error if transporter.sendMail fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    sendMailMock.mockRejectedValueOnce(new Error('SMTP error'));

    await expect(
      nodemailerProvider.sendMail('to@example.com', 'Subject', '<p>Hello</p>'),
    ).rejects.toThrow('Failed to send email');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error sending email:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
