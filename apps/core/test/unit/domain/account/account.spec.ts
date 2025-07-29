import { Account } from '@/domain/account/account'
import { AccountType } from '@/domain/account/account-type'
import { Monetary } from '@/shared/domain/monetary'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

describe('Account', () => {
	it('should create account with valid data', () => {
		const accountType = AccountType.COMMON
		const userId = new UniqueIdentifier()
		const balance = Monetary.create(100).getRight()
		const version = 1

		const sut = Account.create({
			type: accountType,
			userId,
			balance,
			version,
		})

		expect(sut.type).toBe(accountType)
		expect(sut.userId).toBe(userId)
		expect(sut.balance).toBe(balance)
		expect(sut.version).toBe(version)
	})

	it('should be able to deposit money', () => {
		const accountType = AccountType.MERCHANT
		const userId = new UniqueIdentifier()
		const balance = Monetary.create(100).getRight()
		const version = 1

		const sut = Account.create({
			type: accountType,
			userId,
			balance,
			version,
		})

		const depositAmount = Monetary.create(100).getRight()
		sut.deposit(depositAmount)

		balance.add(depositAmount)

		expect(sut.balance.equals(balance)).toBeTruthy()
	})

	it('should be able to withdraw money', () => {
		const accountType = AccountType.MERCHANT
		const userId = new UniqueIdentifier()
		const balance = Monetary.create(100).getRight()
		const version = 1

		const sut = Account.create({
			type: accountType,
			userId,
			balance,
			version,
		})

		const withdrawAmount = Monetary.create(50).getRight()
		sut.withdraw(withdrawAmount)

		balance.subtract(withdrawAmount)

		expect(sut.balance.equals(balance)).toBeTruthy()
	})
})
