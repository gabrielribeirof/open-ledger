import { Account } from '@/domain/account/account'

import { AccountDTO } from '../dtos/entities/account.dto'

export class AccountMapper {
	static toDTO(account: Account): AccountDTO {
		return {
			id: account.id.value,
			asset_code: account.asset_code.value,
			alias: account.alias.value,
			version: account.version,
		}
	}
}
