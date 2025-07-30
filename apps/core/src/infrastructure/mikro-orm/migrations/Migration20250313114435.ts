import { Migration } from '@mikro-orm/migrations'

export class Migration20250313114435 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`alter table "transfers" alter column "amount" type numeric(15,2) using ("amount"::numeric(15,2));`)
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "transfers" alter column "amount" type int using ("amount"::int);`)
	}
}
