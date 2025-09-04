import { generateFakeAsset } from '@test/helpers/asset.helpers'

import { InMemoryAssetRepository } from '@/infrastructure/repositories/in-memory/in-memory-asset.repository'
import { GetAssetByCodeService } from '@/services/get-asset-by-code.service'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'

function createArtifacts() {
	const assetRepository = new InMemoryAssetRepository()

	return {
		sut: new GetAssetByCodeService(assetRepository),
		assetRepository,
	}
}

describe('GetAssetByCodeService', () => {
	it('should return an account when found', async () => {
		const { sut, assetRepository } = createArtifacts()

		const asset = generateFakeAsset()
		assetRepository.save(asset)

		const result = await sut.execute(asset.code.value)

		expect(result).toBeDefined()
		expect(result.id).toBe(asset.id.value)
		expect(result.name).toBe(asset.name.value)
		expect(result.code).toBe(asset.code.value)
	})

	it('should fail when asset does not exist', () => {
		const { sut } = createArtifacts()

		const nonExistentCode = generateFakeAsset().code.value

		expect(sut.execute(nonExistentCode)).rejects.toBeInstanceOf(AssetNotFoundError)
	})
})
