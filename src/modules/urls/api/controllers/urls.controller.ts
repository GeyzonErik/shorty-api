import { Public } from '@/auth/api/decorators/is-public.decorator';
import { User } from '@/auth/api/decorators/user.decorator';
import { UserAuthGuard } from '@/auth/api/guards/user-auth.guard';
import { CreateUrl } from '@/urls/application/usecases/create-url.usecase';
import { User as UserEntity } from '@/users/domain/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUrlRequest } from './requests/create-url.request';
import { CreateUrlPresenter } from './presenters/create-url.presenter';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ListUserUrls } from '@/urls/application/usecases/list-user-urls.usecase';
import { ListUserUrlsPresenter } from './presenters/list-user-urls.presenter';
import { UpdateUrlRequest } from './requests/update-url.request';
import { UpdateUrl } from '@/urls/application/usecases/update-url.usecase';
import { UpdateUrlPresenter } from './presenters/update-url.presenter';
import { DeactivateUrlPresenter } from './presenters/deactivate-url.presenter';
import { ToggleUrlStatus } from '@/urls/application/usecases/deactivate-url.usecase';
import { DeleteUrlPresenter } from './presenters/delete-url.presenter';
import { DeleteUrl } from '@/urls/application/usecases/delete-url.usecase';
import { ToggleUrlStatusRequest } from './requests/toggle-url-status.request';

@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller('v1/urls')
export class UrlController {
  @Inject(CreateUrl)
  private createUrlUseCase: CreateUrl;
  @Inject(ListUserUrls)
  private listUserUrlsUseCase: ListUserUrls;
  @Inject(UpdateUrl)
  private updateUrlUseCase: UpdateUrl;
  @Inject(ToggleUrlStatus)
  private toggleUrlStatusUseCase: ToggleUrlStatus;
  @Inject(DeleteUrl)
  private deleteUrlUseCase: DeleteUrl;

  @ApiCreatedResponse({
    description: 'Shortened URL successfully created',
    schema: {
      example: {
        message: 'URL successfully created',
        url: 'http://baseUrlHere/abc123',
      },
    },
  })
  @Public()
  @Post()
  async createUrl(@Body() body: CreateUrlRequest, @User() user?: UserEntity) {
    const response = await this.createUrlUseCase.execute({
      originalUrl: body.originalUrl,
      user,
    });

    return CreateUrlPresenter.toHTTP(response);
  }

  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter by active status (default: true)',
  })
  @ApiOkResponse({
    description: 'List of user URLs',
    schema: {
      type: 'array',
      items: {
        example: {
          originalUrl: 'https://google.com',
          url: 'http://localhost:3000/abc123',
          visits: 42,
        },
      },
    },
  })
  @Get()
  async listUrls(@User() user: UserEntity, @Query() active: boolean = true) {
    const response = await this.listUserUrlsUseCase.execute({ user, active });

    return response.map(ListUserUrlsPresenter.toHTTP);
  }

  @ApiOkResponse({
    description: 'URL successfully updated',
    schema: {
      example: {
        id: 'url-id-123',
        message: 'Url successfully updated',
      },
    },
  })
  @Patch(':id')
  async updateUrl(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Body() body: UpdateUrlRequest,
  ) {
    const response = await this.updateUrlUseCase.execute({
      urlId: id,
      user,
      orginalUrl: body.orginalUrl,
    });

    return UpdateUrlPresenter.toHTTP(response);
  }

  @ApiOkResponse({
    description: 'URL successfully deactivated/activated',
    schema: {
      example: {
        id: 'url-id-123',
        message: 'Url successfully deactivated/activated',
      },
    },
  })
  @Patch('toggle/:id')
  async toggleUrlStatus(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Body() body: ToggleUrlStatusRequest,
  ) {
    const response = await this.toggleUrlStatusUseCase.execute({
      urlId: id,
      user,
      active: body.active,
    });

    return DeactivateUrlPresenter.toHTTP(response);
  }

  @ApiOkResponse({
    description: 'URL successfully deleted',
    schema: {
      example: {
        message: 'Url successfully deleted',
      },
    },
  })
  @Delete(':id')
  async deleteUrl(@Param('id') id: string, @User() user: UserEntity) {
    await this.deleteUrlUseCase.execute({
      urlId: id,
      user,
    });

    return DeleteUrlPresenter.toHTTP();
  }
}
