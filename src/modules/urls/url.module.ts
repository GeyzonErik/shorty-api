import { Module } from '@nestjs/common';
import { IUrlRepository } from './application/repositories/urls.repository';
import { UrlPgRepository } from './data/repositories/mikro-orm/urls.pg.repository';
import { UrlController } from './api/controllers/urls.controller';
import { CreateUrl } from './application/usecases/create-url.usecase';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/users/users.module';
import { RedirectUrlController } from './api/controllers/redirect-url.controller';
import { GetOrignalUrl } from './application/usecases/get-original-url.usecase';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [UrlController, RedirectUrlController],
  providers: [
    {
      provide: IUrlRepository,
      useClass: UrlPgRepository,
    },
    CreateUrl,
    GetOrignalUrl,
  ],
  exports: [IUrlRepository],
})
export class UrlModule {}
