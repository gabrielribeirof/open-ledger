import {
	BigIntType,
	Entity,
	Enum,
	OneToOne,
	Opt,
	PrimaryKey,
	Property,
	DecimalType,
} from '@mikro-orm/core';
import { UserEntity } from './user.entity';

export enum WalletEntityType {
	COMMON = 'COMMON',
	MERCHANT = 'MERCHANT',
}

@Entity({ tableName: 'wallets' })
export class WalletEntity {
	@PrimaryKey({ type: 'uuid' })
	id!: string;

	@Enum(() => WalletEntityType)
	type!: WalletEntityType;

	// Max value = 999999999999999 OR 9 999 999 999 999.99
	@Property({ type: new DecimalType('number'), precision: 15, scale: 2 })
	balance!: number;

	@Property({ type: new BigIntType('number'), defaultRaw: '1', version: true })
	version!: number & Opt;

	@Property({ onUpdate: () => new Date() })
	updated_at: Date & Opt = new Date();

	@OneToOne(() => UserEntity, (user) => user.wallet, {
		owner: true,
		fieldName: 'user_id',
	})
	user!: UserEntity;
}
