import { generateFakeAsset } from '@test/helpers/asset.helpers'

import { Asset } from '@/domain/asset/asset'

describe('Asset', () => {
	it('should create asset', () => {
		const result = generateFakeAsset()
		expect(result).toBeInstanceOf(Asset)
	})
})
