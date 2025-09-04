import { faker } from '@faker-js/faker'

import { Asset } from '@/domain/asset/asset'
import { AssetCode } from '@/domain/asset/asset-code'
import { AssetName } from '@/domain/asset/asset-name'

export function generateFakeAssetNameValue({ name }: { name?: string } = {}) {
	return AssetName.create({ value: name ?? faker.finance.currencyName() }).getRight()
}

export function generateFakeAssetCodeValue({ value }: { value?: string } = {}) {
	return AssetCode.create({ value: value ?? faker.finance.currencyCode() }).getRight()
}

export interface GenerateFakeAssetProperties {
	name?: string
	code?: string
}

export function generateFakeAsset(props: GenerateFakeAssetProperties = {}) {
	return Asset.create({
		name: generateFakeAssetNameValue({ name: props.name }),
		code: generateFakeAssetCodeValue({ value: props.code }),
	})
}

export const assetMock = {
	name: 'US Dollar',
	code: 'USD',
}
