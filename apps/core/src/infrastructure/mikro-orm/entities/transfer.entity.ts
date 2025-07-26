import {
	DecimalType,
	Entity,
	ManyToOne,
	Opt,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { WalletEntity } from './wallet.entity';

@Entity({ tableName: 'transfers' })
export class TransferEntity {
	@PrimaryKey({ type: 'uuid' })
	id!: string;

	// Max value = 999999999999999 OR 9 999 999 999 999.99
	@Property({ type: new DecimalType('number'), precision: 15, scale: 2 })
	amount!: number;

	@Property()
	created_at: Date & Opt = new Date();

	@ManyToOne(() => WalletEntity, { fieldName: 'origin_id' })
	origin_wallet!: WalletEntity;

	@ManyToOne(() => WalletEntity, { fieldName: 'target_id' })
	target_wallet!: WalletEntity;
}
