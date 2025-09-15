import { generateFakeAccount, generateFakeAccountAliasValue } from '@test/helpers/account.helpers'

import { InMemoryAccountRepository } from '@/infrastructure/repositories/in-memory/in-memory-account.repository'
import { GetAccountByAliasService } from '@/services/get-account-by-alias.service'
import { AccountNotFoundError } from '@/shared/domain/_errors/account-not-found.error'

function createArtifacts() {
	const accountRepository = new InMemoryAccountRepository()

	return {
		sut: new GetAccountByAliasService(accountRepository),
		accountRepository,
	}
}

describe('GetAccountByAliasService', () => {
	it('should return an account when found', async () => {
		const { sut, accountRepository } = createArtifacts()

		const account = generateFakeAccount()
		accountRepository.save(account)

		const result = await sut.execute(account.alias.value)

		expect(result).toBeDefined()
		expect(result.id).toBe(account.id.value)
		expect(result.alias).toBe(account.alias.value)
		expect(result.asset_code).toBe(account.asset_code.value)
		expect(result.version).toBe(account.version)
	})

	it('should fail when account does not exist', () => {
		const { sut } = createArtifacts()

		const nonExistentAlias = generateFakeAccountAliasValue()

		expect(sut.execute(nonExistentAlias)).rejects.toBeInstanceOf(AccountNotFoundError)
	})
})
