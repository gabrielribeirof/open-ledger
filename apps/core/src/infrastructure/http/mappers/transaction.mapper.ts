import { Transaction } from '@/domain/transaction/transaction'
import { TransactionEntity } from '@/infrastructure/typeorm/entities/transaction.entity'
import { Amount } from '@/shared/domain/amount'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import type { TransactionDTO } from '../dtos/entities/transaction.dto'
import { OperationMapper } from './operation.mapper'

export class TransactionMapper {
	static toDTO(transaction: Transaction): TransactionDTO {
		return {
			id: transaction.id.value,
			asset_id: transaction.asset_id.value,
			amount: {
				value: transaction.amount.value,
				scale: transaction.amount.scale,
			},
			operations: transaction.operations.map((operation) => ({
				id: operation.id.value,
				amount: {
					value: operation.amount.value,
					scale: operation.amount.scale,
				},
				type: operation.type,
				account_id: operation.account_id.value,
			})),
		}
	}

	static toDomain(entity: TransactionEntity): Transaction {
		const id = UniqueIdentifier.create(entity.id).getRight()
		const asset_id = UniqueIdentifier.create(entity.asset_id).getRight()
		const amount = Amount.create({
			value: BigInt(entity.amount),
			scale: entity.amount_scale,
		}).getRight()

		return Transaction.create(
			{
				asset_id,
				amount,
				operations: entity.operations.map((operation) => OperationMapper.toDomain(operation)),
			},
			id,
		).getRight()
	}

	static toPersistence(transaction: Transaction): TransactionEntity {
		const entity = new TransactionEntity()
		entity.id = transaction.id.value
		entity.amount = transaction.amount.value.toString()
		entity.amount_scale = transaction.amount.scale
		entity.asset_id = transaction.asset_id.value
		return entity
	}
}
