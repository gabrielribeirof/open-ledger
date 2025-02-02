import { Entity, Enum, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from './user.entity';

export enum WalletEntityType {
	COMMON = 'COMMON',
	MERCHANT = 'MERCHANT',
}

@Entity({ tableName: 'wallets' })
export class WalletEntity {
	@PrimaryKey({ type: 'uuid' })
	id: string;

	@Enum(() => WalletEntityType)
	type: WalletEntityType;

	@Property()
	balance: number;

	@Property()
	version: number;

	@Property()
	updated_at: Date;

	@OneToOne(() => UserEntity, (user) => user.wallet, {
		owner: true,
		fieldName: 'user_id',
	})
	user: UserEntity;
}
