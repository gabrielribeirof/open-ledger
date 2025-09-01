import { Inject } from '@nestjs/common'

import { Account } from '@/domain/account/account'
import { AccountAlias } from '@/domain/account/account-alias'
import { ACCOUNT_REPOSITORY_TOKEN, IAccountRepository } from '@/domain/account/iaccount.repository'
import { ASSET_REPOSITORY_TOKEN, IAssetRepository } from '@/domain/asset/iasset.repository'
import { AlreadyExistsError } from '@/shared/domain/_errors/already-exists.error'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error'

interface CreateAccountServiceInput {
	asset_code: string
	alias: string
}

export class CreateAccountService {
	constructor(
		@Inject(ASSET_REPOSITORY_TOKEN)
		private readonly assetRepository: IAssetRepository,
		@Inject(ACCOUNT_REPOSITORY_TOKEN)
		private readonly accountRepository: IAccountRepository,
	) {}

	async execute(input: CreateAccountServiceInput) {
		const alias = AccountAlias.create(input.alias)

		if (alias.isLeft()) throw new InvalidParametersError({ alias: [alias.value] })

		const asset = await this.assetRepository.findByCode(input.asset_code)

		if (!asset) throw new AssetNotFoundError()

		const existsAccountWithSameAlias = await this.accountRepository.findByAlias(input.alias)

		if (existsAccountWithSameAlias) throw new AlreadyExistsError()

		const account = Account.create({
			alias: alias.value,
			asset_code: asset.code,
		})

		await this.accountRepository.save(account)

		return account
	}
}
