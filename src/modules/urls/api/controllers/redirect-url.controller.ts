import { Public } from '@/auth/api/decorators/is-public.decorator';
import { GetOrignalUrl } from '@/urls/application/usecases/get-original-url.usecase';
import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@Public()
@Controller()
export class RedirectUrlController {
  @Inject(GetOrignalUrl)
  private getOriginalUrlUseCase: GetOrignalUrl;

  @ApiOperation({
    summary: 'Redirect to original URL',
    description: `This endpoint handles the redirection to the original URL associated with the given slug.
      \nTo use it, copy the shortened link shown in the LIST section and paste it into a new browser tab.
      \nThe route format is BASE_URL/:slug.`,
  })
  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const originalUrl = await this.getOriginalUrlUseCase.execute({ slug });
    return res.redirect(originalUrl);
  }
}
