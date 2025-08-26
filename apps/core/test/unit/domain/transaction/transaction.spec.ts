import { generateFakeAmount } from '@test/helpers/amount.helpers'
import { generateFakeOperation } from '@test/helpers/operation.helper'
import { generateFakeTransaction } from '@test/helpers/transaction.helpers'

import { OperationType } from '@/domain/transaction/operation-type'
import { Transaction } from '@/domain/transaction/transaction'
import { TransactionAmbiguousAccountError } from '@/shared/domain/_errors/transaction-ambiguous-account.error'
import { TransactionMustHaveAtLeastOneDebitAndCreditOperationError } from '@/shared/domain/_errors/transaction-must-have-at-least-one-debit-and-credit-operation.error'
import { TransactionOperationsTotalAmountBalanceError } from '@/shared/domain/_errors/transaction-operations-total-amount-balance.error'
import { TransactionOperationsTotalAmountMismatchError } from '@/shared/domain/_errors/transaction-operations-total-amount-mismatch.error'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

describe('Transaction', () => {
	it('should create a transaction with valid properties', () => {
		const transaction = generateFakeTransaction().value
		expect(transaction).toBeInstanceOf(Transaction)
	})

	it('should not create a transaction with the same account operation', () => {
		const accountId = new UniqueIdentifier()
		const operation = generateFakeOperation({ account_id: accountId }).getRight()

		const transaction = generateFakeTransaction({
			operations: [operation, operation],
		})
		expect(transaction.value).toBeInstanceOf(TransactionAmbiguousAccountError)
	})

	it('should not create a transaction when have not at least one debit and one credit operation', () => {
		const amount = generateFakeOperation().getRight().amount

		const operation1 = generateFakeOperation({ type: OperationType.DEBIT, amount }).getRight()
		const operation2 = generateFakeOperation({ type: OperationType.DEBIT, amount }).getRight()

		const transaction = generateFakeTransaction({
			amount,
			operations: [operation1, operation2],
		})

		expect(transaction.value).toBeInstanceOf(TransactionMustHaveAtLeastOneDebitAndCreditOperationError)
	})

	it('should not create a transaction when operations are not balanced', () => {
		const operation1 = generateFakeOperation({ type: OperationType.DEBIT }).getRight()
		const operation2 = generateFakeOperation({ type: OperationType.CREDIT }).getRight()

		const transaction = generateFakeTransaction({
			operations: [operation1, operation2],
		})

		expect(transaction.value).toBeInstanceOf(TransactionOperationsTotalAmountBalanceError)
	})

	it('should not create a transaction when amount does not match operations total', () => {
		const amount = generateFakeAmount()

		const operation1 = generateFakeOperation({ type: OperationType.DEBIT, amount }).getRight()
		const operation2 = generateFakeOperation({ type: OperationType.CREDIT, amount }).getRight()

		const transaction = generateFakeTransaction({
			operations: [operation1, operation2],
		})

		expect(transaction.value).toBeInstanceOf(TransactionOperationsTotalAmountMismatchError)
	})
})
