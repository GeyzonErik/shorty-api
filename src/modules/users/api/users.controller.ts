import { Body, Controller, Inject, Patch, UseGuards } from '@nestjs/common';
import { UpdateUser } from '../application/usecases/update-user.usecase';
import { User } from '@/auth/api/decorators/user.decorator';
import { User as UserEntity } from '../domain/entities/user.entity';
import { UpdateUserRequest } from './requests/update-user.request';
import { UpdateUserPresenter } from './presenters/update-user.presenter';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserAuthGuard } from '@/auth/api/guards/user-auth.guard';

@UseGuards(UserAuthGuard)
@Controller('v1/users/me')
export class UserController {
  @Inject(UpdateUser)
  private updateUserUseCase: UpdateUser;

  @ApiOkResponse({
    description: 'User successfully updated',
    schema: {
      example: {
        id: 'url-id-123',
        message: 'User successfully updated',
      },
    },
  })
  @Patch()
  async updateUser(@User() user: UserEntity, @Body() body: UpdateUserRequest) {
    const response = await this.updateUserUseCase.execute({
      user,
      ...body,
    });

    return UpdateUserPresenter.toHTTP(response);
  }
}
