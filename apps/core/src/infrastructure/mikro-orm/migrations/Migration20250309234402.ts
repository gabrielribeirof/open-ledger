import { Migration } from '@mikro-orm/migrations'

export class Migration20250309234402 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`alter table "accounts" alter column "version" type bigint using ("version"::bigint);`)
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "accounts" alter column "version" type int using ("version"::int);`)
	}
}
