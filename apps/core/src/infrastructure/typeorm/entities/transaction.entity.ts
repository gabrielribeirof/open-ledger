import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { AssetEntity } from './asset.entity'
import { OperationEntity } from './operation.entity'

@Entity('transaction')
export class TransactionEntity {
	@PrimaryColumn({ type: 'uuid' })
	id!: string

	@Column()
	amount!: string

	@Column()
	amount_scale!: number

	@Column()
	asset_id!: string

	@ManyToOne(() => AssetEntity)
	asset!: AssetEntity

	@OneToMany(() => OperationEntity, (operation) => operation.transaction)
	operations!: OperationEntity[]
}
