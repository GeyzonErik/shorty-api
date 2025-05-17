import { Module } from '@nestjs/common';
import { IUserRepository } from './application/repositories/user.repository';
import { UserPgRepository } from './data/repositories/mikro-orm/users.pg.repository';

@Module({
  controllers: [],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserPgRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserModule {}
