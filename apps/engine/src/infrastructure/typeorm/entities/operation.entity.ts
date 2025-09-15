import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { AccountEntity } from './account.entity'
import { TransactionEntity } from './transaction.entity'

@Entity('operation')
export class OperationEntity {
	@PrimaryColumn({ type: 'uuid' })
	id!: string

	@Column()
	amount!: string

	@Column()
	amount_scale!: number

	@Column()
	type!: 'DEBIT' | 'CREDIT'

	@Column()
	account_id!: string

	@Column()
	transaction_id!: string

	@ManyToOne(() => AccountEntity)
	account!: AccountEntity

	@ManyToOne(() => TransactionEntity)
	@JoinColumn({ name: 'transaction_id' })
	transaction!: TransactionEntity
}
