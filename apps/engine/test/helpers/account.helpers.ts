import { faker } from '@faker-js/faker/.'

import { Account } from '@/domain/account/account'
import { AccountAlias } from '@/domain/account/account-alias'
import type { AssetCode } from '@/domain/asset/asset-code'
import type { Amount } from '@/shared/domain/amount'

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
	const account = Account.create({
		asset_code: properties.assetCode ?? generateFakeAssetCodeValue(),
		alias: properties.alias ?? generateFakeAccountAlias(),
	})

	const amount = properties.amount ?? generateFakeAmount().getRight()

	account.deposit(amount)

	return account
}

export const accountMock = {
	asset_code: 'USD',
	alias: 'valid-account-alias',
}
