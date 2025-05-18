import { Module } from '@nestjs/common';
import { IUserRepository } from './application/repositories/user.repository';
import { UserPgRepository } from './data/repositories/mikro-orm/users.pg.repository';
import { UserController } from './api/users.controller';
import { UpdateUser } from './application/usecases/update-user.usecase';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserPgRepository,
    },
    UpdateUser,
  ],
  exports: [IUserRepository],
})
export class UserModule {}
