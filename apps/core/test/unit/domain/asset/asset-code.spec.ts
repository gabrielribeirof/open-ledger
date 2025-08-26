import { generateFakeAssetCodeValue } from '@test/helpers/asset.helpers'

import { AssetCode } from '@/domain/asset/asset-code'

describe('AssetCode', () => {
	it('should create an asset code with valid value', () => {
		const value = generateFakeAssetCodeValue().value
		const result = AssetCode.create({ value: value })

		expect(result.isRight()).toBe(true)
	})

	it('should trim whitespace from the asset code value', () => {
		const rawValue = '  USD  '
		const expectedValue = 'USD'
		const result = AssetCode.create({ value: rawValue })

		expect(result.isRight()).toBe(true)
		expect(result.getRight().value).toBe(expectedValue)
	})

	it('should fail to create an asset code with empty string', () => {
		const value = ''
		const result = AssetCode.create({ value: value })

		expect(result.isLeft()).toBe(true)
	})

	it('should fail to create an asset code with value too long', () => {
		const value = 'A'.repeat(AssetCode.MAX_LENGTH + 1)
		const result = AssetCode.create({ value: value })

		expect(result.isLeft()).toBe(true)
	})

	it('should fail to create an asset code with value too short', () => {
		const value = 'A'.repeat(AssetCode.MIN_LENGTH - 1)
		const result = AssetCode.create({ value: value })

		expect(result.isLeft()).toBe(true)
	})
})
