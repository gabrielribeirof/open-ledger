import { Migration } from '@mikro-orm/migrations'

export class Migration20250310021740 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`alter table "accounts" alter column "balance" type numeric(15,2) using ("balance"::numeric(15,2));`)
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "accounts" alter column "balance" type numeric(10,0) using ("balance"::numeric(10,0));`)
	}
}
