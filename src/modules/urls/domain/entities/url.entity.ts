import { User } from '@/users/domain/entities/user.entity';
import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'urls' })
export class Url {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({
    name: 'slug',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  slug!: string;

  @Property({ name: 'original_url', type: 'varchar', nullable: false })
  originalUrl!: string;

  @ManyToOne(() => User, { nullable: true, joinColumn: 'user_id' })
  user?: User;

  @Property({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean = true;

  @Property({ name: 'visits', type: 'int', default: 0 })
  visits: number = 0;

  @Property({
    name: 'expires_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  expiresAt?: Date;

  @Property({
    name: 'created_at',
    type: 'timestamp with time zone',
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();

  @Property({
    name: 'updated_at',
    type: 'timestamp with time zone',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
