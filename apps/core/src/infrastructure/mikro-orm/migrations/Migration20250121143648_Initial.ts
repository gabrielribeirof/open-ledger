import { Migration } from '@mikro-orm/migrations'

export class Migration20250121143648_Initial extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`create table "users" ("id" uuid not null, "name" varchar(255) not null, "document" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "users_pkey" primary key ("id"));`,
		)

		this.addSql(
			`create table "accounts" ("id" uuid not null, "type" text check ("type" in ('COMMON', 'MERCHANT')) not null, "balance" int not null, "version" int not null, "updated_at" timestamptz not null, "user_id" uuid not null, constraint "accounts_pkey" primary key ("id"));`,
		)
		this.addSql(
			`alter table "accounts" add constraint "accounts_user_id_unique" unique ("user_id");`,
		)

		this.addSql(
			`create table "transfers" ("id" uuid not null, "amount" int not null, "created_at" timestamptz not null, "origin_id" uuid not null, "target_id" uuid not null, constraint "transfers_pkey" primary key ("id"));`,
		)

		this.addSql(
			`alter table "accounts" add constraint "accounts_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
		)

		this.addSql(
			`alter table "transfers" add constraint "transfers_origin_id_foreign" foreign key ("origin_id") references "accounts" ("id") on update cascade;`,
		)
		this.addSql(
			`alter table "transfers" add constraint "transfers_target_id_foreign" foreign key ("target_id") references "accounts" ("id") on update cascade;`,
		)
	}
}
