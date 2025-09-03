import { Operation } from '@/domain/transaction/operation'
import { OperationType } from '@/domain/transaction/operation-type'
import type { OperationEntity } from '@/infrastructure/typeorm/entities/operation.entity'
import { Amount } from '@/shared/domain/amount'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

export class OperationMapper {
	static toDomain(entity: OperationEntity): Operation {
		const id = UniqueIdentifier.create(entity.id).getRight()
		const amount = Amount.create({
			value: BigInt(entity.amount),
			scale: entity.amount_scale,
		}).getRight()
		const account_id = UniqueIdentifier.create(entity.account_id).getRight()

		return Operation.create(
			{
				amount,
				account_id,
				type: entity.type === 'DEBIT' ? OperationType.DEBIT : OperationType.CREDIT,
			},
			id,
		).getRight()
	}
}
