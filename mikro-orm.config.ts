import { config } from 'dotenv';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from '@/users/domain/entities/user.entity';
import { Url } from '@/urls/domain/entities/url.entity';
import { Migrator } from '@mikro-orm/migrations';

config();

export default defineConfig({
  extensions: [Migrator],
  entities: [User, Url],
  entitiesTs: ['./src/**/entities/*.ts'],
  driver: PostgreSqlDriver,
  dbName: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  driverOptions: {
    connection: {
      ssl: process.env.NODE_ENV === 'development',
    },
  },
});
