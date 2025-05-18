import { Migration } from '@mikro-orm/migrations';

export class Migration20250518025711_make_delete_and_update_columns_nullable_in_url_table extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "urls" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "urls" alter column "updated_at" drop not null;`);
    this.addSql(`alter table "urls" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);`);
    this.addSql(`alter table "urls" alter column "deleted_at" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "urls" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "urls" alter column "updated_at" set not null;`);
    this.addSql(`alter table "urls" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);`);
    this.addSql(`alter table "urls" alter column "deleted_at" set not null;`);
  }

}
