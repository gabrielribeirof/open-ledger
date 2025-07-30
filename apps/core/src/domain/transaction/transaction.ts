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

interface AmountDistributionStrategy {
	amount: Amount
}

interface ShareDistributionStrategy {
	share: number
}

interface RemainingDistributionStrategy {
	remaining: true
}

type DistributionStrategy = AmountDistributionStrategy | ShareDistributionStrategy | RemainingDistributionStrategy

export type AccountDistribution = DistributionStrategy & {
	account_id: UniqueIdentifier
}

interface TransactionCreateInput {
	amount: Amount
	asset_id: UniqueIdentifier
	source_distributions: AccountDistribution[]
	target_distributions: AccountDistribution[]
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

	private static calculateAccountAmount(
		distributions: AccountDistribution[],
		totalAmount: Amount,
	): Map<UniqueIdentifier, Amount> {
		const accountAmounts = new Map<UniqueIdentifier, Amount>()

		const total = Amount.zero()
		const remaining = totalAmount

		for (const distribution of distributions) {
			if ('share' in distribution) {
				const shareAmount = totalAmount.multiply(distribution.share / 100)
				total.add(shareAmount)
				remaining.subtract(shareAmount)
			} else if ('amount' in distribution) {
				total.add(distribution.amount)
				remaining.subtract(distribution.amount)
			} else if ('remaining' in distribution) {
				total.add(remaining)
				remaining.subtract(remaining)
			}
		}

		return accountAmounts
	}

	static create(input: TransactionCreateInput, id?: UniqueIdentifier): Either<Error, Transaction> {
		const sourceAmounts = this.calculateAccountAmount(input.source_distributions, input.amount)
		const targetAmounts = this.calculateAccountAmount(input.target_distributions, input.amount)

		const sourceOperations = input.source_distributions.map((source) =>
			Operation.create({
				amount: sourceAmounts.get(source.account_id)!,
				type: OperationType.DEBIT,
				account_id: source.account_id,
			}),
		)

		const targetOperations = input.target_distributions.map((target) =>
			Operation.create({
				amount: targetAmounts.get(target.account_id)!,
				type: OperationType.CREDIT,
				account_id: target.account_id,
			}),
		)

		const operations = [...sourceOperations, ...targetOperations]

		const hasSomeAmbiguousOperationAccount = operations.some((operation) =>
			operations.some((other) => other.account_id.equals(operation.account_id)),
		)

		if (hasSomeAmbiguousOperationAccount) return left(new TransactionAmbiguousAccountError())

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

		if (!debitOperationsAmount.equals(input.amount)) {
			return left(new TransactionOperationsTotalAmountMismatchError())
		}

		return right(
			new Transaction(
				{
					amount: input.amount,
					asset_id: input.asset_id,
					operations,
				},
				id,
			),
		)
	}
}
