import { Public } from '@/auth/api/decorators/is-public.decorator';
import { GetOrignalUrl } from '@/urls/application/usecases/get-original-url.usecase';
import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Public()
@Controller()
export class RedirectUrlController {
  @Inject(GetOrignalUrl)
  private getOriginalUrlUseCase: GetOrignalUrl;

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const originalUrl = await this.getOriginalUrlUseCase.execute({ slug });
    return res.redirect(originalUrl);
  }
}
