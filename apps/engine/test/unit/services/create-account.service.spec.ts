import { generateFakeAccount, generateFakeAccountAlias } from '@test/helpers/account.helpers'
import { generateFakeAsset } from '@test/helpers/asset.helpers'

import { Account } from '@/domain/account/account'
import { InMemoryAccountRepository } from '@/infrastructure/repositories/in-memory/in-memory-account.repository'
import { InMemoryAssetRepository } from '@/infrastructure/repositories/in-memory/in-memory-asset.repository'
import { CreateAccountService } from '@/services/create-account.service'
import { AlreadyExistsError } from '@/shared/domain/_errors/already-exists.error'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error'
import { Violation } from '@/shared/seedwork/violation'

function createArtifacts() {
	const assetRepository = new InMemoryAssetRepository()
	const accountRepository = new InMemoryAccountRepository()

	return {
		sut: new CreateAccountService(assetRepository, accountRepository),
		assetRepository,
		accountRepository,
	}
}

describe('CreateAccountService', () => {
	it('should create an account with valid data', () => {
		const { sut, assetRepository } = createArtifacts()

		const asset = generateFakeAsset()
		const alias = generateFakeAccountAlias()

		assetRepository.save(asset)

		const result = sut.execute({
			asset_code: asset.code.value,
			alias: alias.value,
		})

		expect(result).resolves.toBeInstanceOf(Account)
	})

	it('should fail with invalid alias', () => {
		const { sut, assetRepository } = createArtifacts()

		const asset = generateFakeAsset()
		assetRepository.save(asset)

		const result = sut.execute({
			asset_code: asset.code.value,
			alias: '',
		})

		expect(result).rejects.toBeInstanceOf(InvalidParametersError)
		expect(result).rejects.toHaveProperty('violations.alias', expect.arrayContaining([expect.any(Violation)]))
	})

	it('should fail with nonexistent asset', () => {
		const { sut } = createArtifacts()

		const asset = generateFakeAsset()
		const alias = generateFakeAccountAlias()

		const result = sut.execute({
			asset_code: asset.code.value,
			alias: alias.value,
		})

		expect(result).rejects.toBeInstanceOf(AssetNotFoundError)
	})

	it('should fail with a already existent account alias', () => {
		const { sut, assetRepository, accountRepository } = createArtifacts()

		const asset = generateFakeAsset()
		const alias = generateFakeAccountAlias()
		const account = generateFakeAccount({ alias })

		assetRepository.save(asset)
		accountRepository.save(account)

		const result = sut.execute({
			asset_code: asset.code.value,
			alias: alias.value,
		})

		expect(result).rejects.toBeInstanceOf(AlreadyExistsError)
	})
})
