import { generateFakeAccount } from '@test/helpers/account.helpers'
import { generateFakeAmount } from '@test/helpers/amount.helpers'

import { InsufficientFundsError } from '@/shared/domain/_errors/insufficient-funds.error'

describe('Account', () => {
	it('should deposit', () => {
		const account = generateFakeAccount()
		const initialAccountAmount = account.amount
		const amount = generateFakeAmount().getRight()

		account.deposit(amount)

		expect(account.amount.subtract(amount).equals(initialAccountAmount)).toBe(true)
	})

	it('should withdraw', () => {
		const account = generateFakeAccount()
		const initialAccountAmount = account.amount
		const amount = generateFakeAmount().getRight()
		account.deposit(amount)

		account.withdraw(amount)

		expect(account.amount.equals(initialAccountAmount)).toBe(true)
	})

	it('should not withdraw if insufficient funds', () => {
		const account = generateFakeAccount()
		const amount = account.amount.add(generateFakeAmount().getRight())

		expect(() => account.withdraw(amount)).toThrow(InsufficientFundsError)
	})
})
