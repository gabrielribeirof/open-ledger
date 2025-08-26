import { faker } from '@faker-js/faker/.'

import { Account } from '@/domain/account/account'
import { AccountAlias } from '@/domain/account/account-alias'
import { AssetCode } from '@/domain/asset/asset-code'
import { Amount } from '@/shared/domain/amount'

import { generateFakeAmount } from './amount.helpers'
import { generateFakeAssetCodeValue } from './asset.helpers'

export function generateFakeAccountAliasValue() {
	return faker.finance.accountNumber()
}

export function generateFakeAccountAlias() {
	return AccountAlias.create(generateFakeAccountAliasValue()).getRight()
}

interface GenerateFakeAccountProperties {
	amount?: Amount
	assetCode?: AssetCode
	alias?: AccountAlias
	version?: number
}

export function generateFakeAccount(properties: GenerateFakeAccountProperties = {}) {
	return Account.create({
		amount: properties.amount ?? generateFakeAmount(),
		asset_code: properties.assetCode ?? generateFakeAssetCodeValue(),
		alias: properties.alias ?? generateFakeAccountAlias(),
		version: properties.version ?? 1,
	})
}
