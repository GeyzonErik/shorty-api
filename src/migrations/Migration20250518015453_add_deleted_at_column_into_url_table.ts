import { Migration } from '@mikro-orm/migrations';

export class Migration20250518015453_add_deleted_at_column_into_url_table extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "urls" add column "deleted_at" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "urls" drop column "deleted_at";`);
  }

}
