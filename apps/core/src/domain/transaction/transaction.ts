import { TransactionAmbiguousAccountError } from '@/shared/domain/_errors/transaction-ambiguous-account.error'
import { TransactionMustHaveAtLeastOneDebitAndCreditOperationError } from '@/shared/domain/_errors/transaction-must-have-at-least-one-debit-and-credit-operation.error'
import { TransactionOperationsTotalAmountBalanceError } from '@/shared/domain/_errors/transaction-operations-total-amount-balance.error'
import { TransactionOperationsTotalAmountMismatchError } from '@/shared/domain/_errors/transaction-operations-total-amount-mismatch.error'
import { Amount } from '@/shared/domain/amount'
import { Either, left, right } from '@/shared/lib/either'
import { AggregateRoot } from '@/shared/seedwork/aggregate-root'
import { Error } from '@/shared/seedwork/error'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import { Operation } from './operation'
import { OperationType } from './operation-type'

interface TransactionProperties {
	amount: Amount
	asset_id: UniqueIdentifier
	operations: Operation[]
}

export interface Distribution {
	account_id: UniqueIdentifier
	amount: Amount
}

export class Transaction extends AggregateRoot<TransactionProperties> {
	get amount(): Amount {
		return this.properties.amount
	}

	get asset_id(): UniqueIdentifier {
		return this.properties.asset_id
	}

	get operations(): Operation[] {
		return this.properties.operations
	}

	private constructor(properties: TransactionProperties, id?: UniqueIdentifier) {
		super(properties, id)
	}

	static create(properties: TransactionProperties, id?: UniqueIdentifier): Either<Error, Transaction> {
		const { amount, asset_id, operations } = properties

		const hasDuplicateOperationAccount = operations.some((x, index) => {
			return operations.findIndex((y) => y.account_id.equals(x.account_id)) !== index
		})

		if (hasDuplicateOperationAccount) return left(new TransactionAmbiguousAccountError())

		const hasAtLeastOneDebitAndCreditOperation =
			operations.some((operation) => operation.type === OperationType.DEBIT) &&
			operations.some((operation) => operation.type === OperationType.CREDIT)

		if (!hasAtLeastOneDebitAndCreditOperation) {
			return left(new TransactionMustHaveAtLeastOneDebitAndCreditOperationError())
		}

		const debitOperationsAmount = operations.reduce((total, operation) => {
			return operation.type === OperationType.DEBIT ? total.add(operation.amount) : total
		}, Amount.zero())
		const creditOperationsAmount = operations.reduce((total, operation) => {
			return operation.type === OperationType.CREDIT ? total.add(operation.amount) : total
		}, Amount.zero())

		if (!debitOperationsAmount.equals(creditOperationsAmount)) {
			return left(new TransactionOperationsTotalAmountBalanceError())
		}

		if (!debitOperationsAmount.equals(amount)) {
			return left(new TransactionOperationsTotalAmountMismatchError())
		}

		return right(
			new Transaction(
				{
					amount,
					asset_id,
					operations,
				},
				id,
			),
		)
	}
}
