import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { ArrayType } from '@mikro-orm/postgresql';
import { AUTH_PROVIDER } from '../enums/auth-provider.enum';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id: string = randomUUID();

  @Property({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Property({ name: 'password', type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Enum({
    name: 'auth_provider',
    type: ArrayType,
    nullable: false,
    default: [AUTH_PROVIDER.EMAIL_PASSWORD],
  })
  authProviders: AUTH_PROVIDER[] = [AUTH_PROVIDER.EMAIL_PASSWORD];

  @Property({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Property({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean = false;

  @Property({
    name: 'created_at',
    type: 'timestamp with time zone',
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();

  @Property({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @Property({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deleted_at: Date;
}
