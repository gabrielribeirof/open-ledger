import { Account } from '@/domain/account/account'
import { AccountAlias } from '@/domain/account/account-alias'
import { AssetCode } from '@/domain/asset/asset-code'
import { AccountEntity } from '@/infrastructure/typeorm/entities/account.entity'
import { Amount } from '@/shared/domain/amount'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import type { AccountDTO } from '../dtos/entities/account.dto'

export class AccountMapper {
	static toDTO(account: Account): AccountDTO {
		return {
			id: account.id.value,
			asset_code: account.asset_code.value,
			alias: account.alias.value,
			version: account.version,
		}
	}

	static toDomain(entity: AccountEntity): Account {
		const id = UniqueIdentifier.create(entity.id).getRight()
		const amount = Amount.create({
			value: BigInt(entity.amount),
			scale: entity.amount_scale,
		}).getRight()
		const asset_code = AssetCode.create({ value: entity.asset_code }).getRight()
		const alias = AccountAlias.create(entity.alias).getRight()

		return Account.from(
			{
				asset_code,
				alias,
				amount,
				version: entity.version,
			},
			id,
		)
	}

	static toPersistence(account: Account): AccountEntity {
		const entity = new AccountEntity()
		entity.id = account.id.value
		entity.amount = account.amount.value.toString()
		entity.amount_scale = account.amount.scale
		entity.asset_code = account.asset_code.value
		entity.alias = account.alias.value
		entity.version = account.version
		return entity
	}
}
