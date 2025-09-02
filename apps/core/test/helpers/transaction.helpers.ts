import { Operation } from '@/domain/transaction/operation'
import { OperationType } from '@/domain/transaction/operation-type'
import { Transaction } from '@/domain/transaction/transaction'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import { generateFakeAmount, GenerateFakeAmountProperties } from './amount.helpers'
import { generateFakeOperation } from './operation.helper'

interface GenerateFakeTransactionProperties {
	amount?: GenerateFakeAmountProperties
	asset_id?: UniqueIdentifier
	operations?: Operation[]
}

export function generateFakeTransaction(props: GenerateFakeTransactionProperties = {}) {
	const amount = generateFakeAmount(props.amount).getRight()

	return Transaction.create({
		amount,
		asset_id: props.asset_id ?? new UniqueIdentifier(),
		operations: props.operations ?? [
			generateFakeOperation({
				amount,
				type: OperationType.CREDIT,
			}).getRight(),
			generateFakeOperation({
				amount,
				type: OperationType.DEBIT,
			}).getRight(),
		],
	})
}
