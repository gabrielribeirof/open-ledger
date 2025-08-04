import { Transaction } from '@/domain/transaction/transaction'

import { TransactionDTO } from '../dtos/entities/transaction.dto'

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
}
