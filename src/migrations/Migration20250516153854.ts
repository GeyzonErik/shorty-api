import { Migration } from '@mikro-orm/migrations';

export class Migration20250516153854 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null, "email" varchar(255) not null, "password" varchar(255) null, "auth_provider" text[] not null default '{EMAIL_PASSWORD}', "name" varchar(255) not null, "is_email_verified" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz null, "deleted_at" timestamptz null, constraint "users_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "urls" ("id" uuid not null, "slug" varchar(20) not null, "original_url" varchar(255) not null, "user_id" uuid null, "is_active" boolean not null default true, "visits" int not null default 0, "expires_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "urls_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "urls" add constraint "urls_slug_unique" unique ("slug");`,
    );

    this.addSql(
      `alter table "urls" add constraint "urls_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`,
    );
  }
}
