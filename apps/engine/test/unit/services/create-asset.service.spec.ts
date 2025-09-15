import { generateFakeAsset, generateFakeAssetCodeValue, generateFakeAssetNameValue } from '@test/helpers/asset.helpers'

import { Asset } from '@/domain/asset/asset'
import { InMemoryAssetRepository } from '@/infrastructure/repositories/in-memory/in-memory-asset.repository'
import { CreateAssetService } from '@/services/create-asset.service'
import { AlreadyExistsError } from '@/shared/domain/_errors/already-exists.error'
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error'

function createArtifacts() {
	const assetRepository = new InMemoryAssetRepository()

	return {
		sut: new CreateAssetService(assetRepository),
		assetRepository,
	}
}

describe('CreateAssetService', () => {
	it('should create an asset with valid data', async () => {
		const { sut } = createArtifacts()

		const name = generateFakeAssetNameValue()
		const code = generateFakeAssetCodeValue()

		const result = await sut.execute({
			name: name.value,
			code: code.value,
		})

		expect(result).toBeInstanceOf(Asset)
		expect(result.name).toEqual(name)
		expect(result.code).toEqual(code)
	})

	it('should fail with invalid name', () => {
		const { sut } = createArtifacts()

		const result = sut.execute({
			name: '',
			code: generateFakeAssetCodeValue().value,
		})

		expect(result).rejects.toBeInstanceOf(InvalidParametersError)
		expect(result).rejects.toHaveProperty('violations.name')
		expect(result).rejects.toHaveProperty('violations.code', null)
	})

	it('should fail with invalid code', () => {
		const { sut } = createArtifacts()

		const result = sut.execute({
			name: generateFakeAssetNameValue().value,
			code: '',
		})

		expect(result).rejects.toBeInstanceOf(InvalidParametersError)
		expect(result).rejects.toHaveProperty('violations.name', null)
		expect(result).rejects.toHaveProperty('violations.code')
	})

	it('should fail with invalid data', () => {
		const { sut } = createArtifacts()

		const result = sut.execute({
			name: '',
			code: '',
		})

		expect(result).rejects.toBeInstanceOf(InvalidParametersError)
		expect(result).rejects.toHaveProperty('violations.name')
		expect(result).rejects.toHaveProperty('violations.code')
	})

	it('should fail with a already existent alias code', () => {
		const { sut, assetRepository } = createArtifacts()

		const name = generateFakeAssetNameValue()
		const code = generateFakeAssetCodeValue()
		const asset = generateFakeAsset({ code: code.value })

		assetRepository.save(asset)

		const result = sut.execute({
			name: name.value,
			code: code.value,
		})

		expect(result).rejects.toBeInstanceOf(AlreadyExistsError)
	})
})
