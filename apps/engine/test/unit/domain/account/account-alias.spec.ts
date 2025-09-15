import { generateFakeAccountAliasValue } from '@test/helpers/account.helpers'

import { AccountAlias } from '@/domain/account/account-alias'
import { BadLengthViolation } from '@/shared/domain/_errors/violations/bad-length.violation'

describe('AccountAlias', () => {
	it('should create an account alias with valid value', () => {
		const value = generateFakeAccountAliasValue()
		const result = AccountAlias.create(value)

		expect(result.isRight()).toBe(true)
	})

	it('should fail to create an account alias with value too short', () => {
		const value = 'a'.repeat(AccountAlias.MIN_LENGTH - 1)
		const result = AccountAlias.create(value)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(BadLengthViolation)
	})

	it('should fail to create an account alias with value too long', () => {
		const value = 'a'.repeat(AccountAlias.MAX_LENGTH + 1)
		const result = AccountAlias.create(value)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(BadLengthViolation)
	})

	it('should fail to create an account alias with empty string', () => {
		const value = ''
		const result = AccountAlias.create(value)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(BadLengthViolation)
	})
})
