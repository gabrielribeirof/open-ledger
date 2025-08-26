import { generateFakeAssetNameValue } from '@test/helpers/asset.helpers'

import { AssetName } from '@/domain/asset/asset-name'

describe('AssetName', () => {
	it('should create an asset name with valid value', () => {
		const value = generateFakeAssetNameValue().value
		const result = AssetName.create({ value: value })

		expect(result.isRight()).toBe(true)
	})

	it('should trim whitespace from the asset name value', () => {
		const rawValue = '   Valid Asset Name   '
		const trimmedValue = rawValue.trim()
		const result = AssetName.create({ value: rawValue })

		expect(result.isRight()).toBe(true)
		expect(result.getRight().value).toBe(trimmedValue)
	})

	it('should fail to create an asset name with empty value', () => {
		const value = ''
		const result = AssetName.create({ value: value })

		expect(result.isLeft()).toBe(true)
	})

	it('should fail to create an asset name with value too short', () => {
		const value = 'a'.repeat(AssetName.MIN_LENGTH - 1)
		const result = AssetName.create({ value: value })

		expect(result.isLeft()).toBe(true)
	})

	it('should fail to create an asset name with value too long', () => {
		const value = 'a'.repeat(AssetName.MAX_LENGTH + 1)
		const result = AssetName.create({ value: value })

		expect(result.isLeft()).toBe(true)
	})
})
