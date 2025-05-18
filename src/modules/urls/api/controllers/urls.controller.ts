import { Public } from '@/auth/api/decorators/is-public.decorator';
import { User } from '@/auth/api/decorators/user.decorator';
import { UserAuthGuard } from '@/auth/api/guards/user-auth.guard';
import { CreateUrl } from '@/urls/application/usecases/create-url.usecase';
import { User as UserEntity } from '@/users/domain/entities/user.entity';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateUrlRequest } from './requests/create-url.request';
import { CreateUrlPresenter } from './presenters/create-url.presenter';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller('v1/urls')
export class UrlController {
  @Inject(CreateUrl)
  private createUrlUseCase: CreateUrl;

  @Public()
  @Post()
  async createUrl(@Body() body: CreateUrlRequest, @User() user?: UserEntity) {
    const response = await this.createUrlUseCase.execute({
      originalUrl: body.originalUrl,
      user,
    });

    return CreateUrlPresenter.toHTTP(response);
  }
}
