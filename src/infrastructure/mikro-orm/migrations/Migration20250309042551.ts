import { Migration } from '@mikro-orm/migrations';

export class Migration20250309042551 extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`alter table "wallets" alter column "version" type int using ("version"::int);`,
		);
		this.addSql(`alter table "wallets" alter column "version" set default 1;`);
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "wallets" alter column "version" drop default;`);
		this.addSql(
			`alter table "wallets" alter column "version" type int using ("version"::int);`,
		);
	}
}
