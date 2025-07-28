import { Entity, OneToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { AccountEntity } from './account.entity';

@Entity({ tableName: 'users' })
export class UserEntity {
	@PrimaryKey({ type: 'uuid' })
	id!: string;

	@Property()
	name!: string;

	@Property()
	document!: string;

	@Property()
	email!: string;

	@Property()
	password!: string;

	@Property()
	created_at: Date & Opt = new Date();

	@Property({ onUpdate: () => new Date() })
	updated_at: Date & Opt = new Date();

	@OneToOne(() => AccountEntity, (account) => account.user)
	account!: AccountEntity;
}
