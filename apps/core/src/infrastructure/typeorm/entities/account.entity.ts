import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { AssetEntity } from './asset.entity'

@Entity('account')
export class AccountEntity {
	@PrimaryColumn({ type: 'uuid' })
	id!: string

	@Column()
	amount!: string

	@Column()
	amount_scale!: number

	@Column()
	asset_code!: string

	@Column()
	alias!: string

	@Column()
	version!: number

	@ManyToOne(() => AssetEntity)
	@JoinColumn({ name: 'asset_code' })
	asset!: AssetEntity
}
