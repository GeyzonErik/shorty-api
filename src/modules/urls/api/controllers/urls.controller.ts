import { Public } from '@/auth/api/decorators/is-public.decorator';
import { User } from '@/auth/api/decorators/user.decorator';
import { UserAuthGuard } from '@/auth/api/guards/user-auth.guard';
import { CreateUrl } from '@/urls/application/usecases/create-url.usecase';
import { User as UserEntity } from '@/users/domain/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUrlRequest } from './requests/create-url.request';
import { CreateUrlPresenter } from './presenters/create-url.presenter';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ListUserUrls } from '@/urls/application/usecases/list-user-urls.usecase';
import { ListUserUrlsPresenter } from './presenters/list-user-urls.presenter';

@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller('v1/urls')
export class UrlController {
  @Inject(CreateUrl)
  private createUrlUseCase: CreateUrl;
  @Inject(ListUserUrls)
  private listUserUrlsUseCase: ListUserUrls;

  @Public()
  @Post()
  async createUrl(@Body() body: CreateUrlRequest, @User() user?: UserEntity) {
    const response = await this.createUrlUseCase.execute({
      originalUrl: body.originalUrl,
      user,
    });

    return CreateUrlPresenter.toHTTP(response);
  }

  @Get()
  async listUrls(@User() user: UserEntity, @Query() active: boolean = true) {
    const response = await this.listUserUrlsUseCase.execute({ user, active });

    return response.map(ListUserUrlsPresenter.toHTTP);
  }
}
