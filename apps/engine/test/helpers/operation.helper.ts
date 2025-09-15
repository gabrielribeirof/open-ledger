import { Operation } from '@/domain/transaction/operation'
import { OperationType } from '@/domain/transaction/operation-type'
import type { Amount } from '@/shared/domain/amount'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import { generateFakeAmount } from './amount.helpers'

export interface GenerateFakeOperationProperties {
	account_id?: UniqueIdentifier
	amount?: Amount
	type?: OperationType
}

export function generateFakeOperation(props: GenerateFakeOperationProperties = {}) {
	return Operation.create({
		account_id: props.account_id ?? new UniqueIdentifier(),
		amount: props.amount ?? generateFakeAmount().getRight(),
		type: props.type ?? (Math.random() > 0.5 ? OperationType.DEBIT : OperationType.CREDIT),
	})
}
