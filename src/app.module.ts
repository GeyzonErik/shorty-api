import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@/users/domain/entities/user.entity';
import { Url } from '@/urls/domain/entities/url.entity';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { NormalizeFieldsSubscriber } from '@/core/data/subscribers/normalize-fields.subscriber';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/users/users.module';
import { UrlModule } from '@/urls/url.module';
import { CoreModule } from '@/core/core.module';
import { NotificationModule } from '@/notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        entities: [User, Url],
        entitiesTs: ['./src/**/entities/*.ts'],
        driver: PostgreSqlDriver,
        dbName: configService.get('DB_DATABASE'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        subscribers: [NormalizeFieldsSubscriber],
        ssl: configService.get('NODE_ENV') === 'prod',
        extra: {
          ssl: {
            rejectUnauthorized: configService.get('NODE_ENV') === 'prod',
          },
        },
      }),
      inject: [ConfigService],
    }),
    CoreModule,
    AuthModule,
    UserModule,
    UrlModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
