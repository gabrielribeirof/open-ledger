import { Entity, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { WalletEntity } from './wallet.entity';

@Entity({ tableName: 'transfers' })
export class TransferEntity {
	@PrimaryKey({ type: 'uuid' })
	id!: string;

	@Property()
	amount!: number;

	@Property()
	created_at: Date & Opt = new Date();

	@ManyToOne(() => WalletEntity, { fieldName: 'origin_id' })
	origin_wallet!: WalletEntity;

	@ManyToOne(() => WalletEntity, { fieldName: 'target_id' })
	target_wallet!: WalletEntity;
}
