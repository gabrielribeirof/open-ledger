import { Inject } from '@nestjs/common'

import { ACCOUNT_REPOSITORY_TOKEN, IAccountRepository } from '@/domain/account/iaccount.repository'
import { AccountDTO } from '@/infrastructure/http/dtos/entities/account.dto'
import { AccountMapper } from '@/infrastructure/http/mappers/account.mapper'
import { AccountNotFoundError } from '@/shared/domain/_errors/account-not-found.error'

export class GetAccountByAliasService {
	constructor(@Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly accountRepository: IAccountRepository) {}

	async execute(alias: string): Promise<AccountDTO> {
		const account = await this.accountRepository.findByAlias(alias)

		if (!account) throw new AccountNotFoundError()

		return AccountMapper.toDTO(account)
	}
}
