import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { Public } from '../decorators/is-public.decorator';
import { ConfirmEmail } from '@/auth/application/usecases/confirm-email.usecase';
import { emailConfirmedPageTemplate } from '@/auth/infra/templates/email-confirmed.template';
import { Response } from 'express';

@Controller('confirm-email')
export class ConfirmEmailController {
  @Inject(ConfirmEmail)
  private confirmEmailUseCase: ConfirmEmail;

  @Public()
  @Get()
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    await this.confirmEmailUseCase.execute({ token });

    const html = emailConfirmedPageTemplate();

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
