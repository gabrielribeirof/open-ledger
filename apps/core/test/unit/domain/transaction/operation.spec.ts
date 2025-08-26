import { generateFakeAmount } from '@test/helpers/amount.helpers'
import { generateFakeOperation } from '@test/helpers/operation.helper'

import { Operation } from '@/domain/transaction/operation'
import { OperationType } from '@/domain/transaction/operation-type'
import { InvalidAmountError } from '@/shared/domain/_errors/invalid-amount.error'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

describe('Operation', () => {
	it('should create an operation with valid properties', () => {
		const operation = generateFakeOperation().getRight()
		expect(operation).toBeInstanceOf(Operation)
	})

	it('should not create an operation with zeroed amount', () => {
		const amount = generateFakeAmount({ value: 0n })
		const operation = generateFakeOperation({ amount })
		expect(operation.isLeft()).toBeTruthy()
		expect(operation.value).toBeInstanceOf(InvalidAmountError)
	})

	describe('isDebit', () => {
		it('should return true for debit operation', () => {
			const operation = Operation.create({
				account_id: new UniqueIdentifier(),
				amount: generateFakeAmount(),
				type: OperationType.DEBIT,
			}).getRight()
			expect(operation.isDebit()).toBe(true)
		})
	})

	describe('isCredit', () => {
		it('should return true for credit operation', () => {
			const operation = Operation.create({
				account_id: new UniqueIdentifier(),
				amount: generateFakeAmount(),
				type: OperationType.CREDIT,
			}).getRight()
			expect(operation.isCredit()).toBe(true)
		})
	})
})
