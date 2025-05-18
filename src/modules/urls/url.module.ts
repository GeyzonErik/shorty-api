import { Module } from '@nestjs/common';
import { IUrlRepository } from './application/repositories/urls.repository';
import { UrlPgRepository } from './data/repositories/mikro-orm/urls.pg.repository';
import { UrlController } from './api/controllers/urls.controller';
import { CreateUrl } from './application/usecases/create-url.usecase';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/users/users.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [UrlController],
  providers: [
    {
      provide: IUrlRepository,
      useClass: UrlPgRepository,
    },
    CreateUrl,
  ],
  exports: [IUrlRepository],
})
export class UrlModule {}
