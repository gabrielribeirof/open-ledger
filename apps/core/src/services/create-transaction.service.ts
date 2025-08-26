import { Inject, Injectable } from '@nestjs/common'

import {
	ACCOUNT_REPOSITORY_TOKEN,
	IAccountRepository as IAccountRepositoryV2,
} from '@/domain/account/iaccount.repository'
import { ASSET_REPOSITORY_TOKEN, IAssetRepository } from '@/domain/asset/iasset.repository'
import {
	CreateTransactionDomainService,
	Distribution as DomainDistribution,
} from '@/domain/services/create-transaction.domain-service'
import { Transaction } from '@/domain/transaction/transaction'
import { AccountNotFoundError } from '@/shared/domain/_errors/account-not-found.error'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'
import { InvalidAmountError } from '@/shared/domain/_errors/invalid-amount.error'
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error'
import { Amount } from '@/shared/domain/amount'

export interface AmountDistribution {
	amount: {
		value: bigint
		scale: number
	}
}

export interface ShareDistribution {
	share: number
}

export interface RemainingDistribution {
	remaining: true
}

type DistributionStrategy = AmountDistribution | ShareDistribution | RemainingDistribution

export type Distribution = DistributionStrategy & {
	account_alias: string
}

export interface CreateTransactionServiceInput {
	asset_code: string
	value: bigint
	scale: number
	sources: Distribution[]
	targets: Distribution[]
}

@Injectable()
export class CreateTransactionService {
	constructor(
		@Inject(ASSET_REPOSITORY_TOKEN)
		private readonly assetRepository: IAssetRepository,
		@Inject(ACCOUNT_REPOSITORY_TOKEN)
		private readonly accountRepository: IAccountRepositoryV2,
		private readonly createTransactionDomainService: CreateTransactionDomainService,
	) {}

	async execute(input: CreateTransactionServiceInput): Promise<Transaction> {
		const amount = Amount.create({ value: input.value, scale: input.scale })

		if (amount.isLeft()) throw new InvalidParametersError({ amount: [amount.value] })

		const asset = await this.assetRepository.findByCode(input.asset_code)

		if (!asset) throw new AssetNotFoundError()

		return this.createTransactionDomainService.execute({
			asset,
			amount: amount.value,
			sources: await this.convertDistributionsToDomainDistributions(input.sources),
			targets: await this.convertDistributionsToDomainDistributions(input.targets),
		})
	}

	private async convertDistributionsToDomainDistributions(
		distributions: Distribution[],
	): Promise<DomainDistribution[]> {
		const accountDistributions: DomainDistribution[] = []

		for (const { account_alias, ...distribution } of distributions) {
			const account = await this.accountRepository.findByAlias(account_alias)

			if (!account) throw new AccountNotFoundError()

			if ('amount' in distribution) {
				const amount = Amount.create({
					value: distribution.amount.value,
					scale: distribution.amount.scale,
				})

				if (amount.isLeft()) throw new InvalidAmountError()

				accountDistributions.push({ account, amount: amount.value })
			}

			if ('share' in distribution) accountDistributions.push({ account, share: distribution.share })

			if ('remaining' in distribution) accountDistributions.push({ account, remaining: distribution.remaining })
		}

		return accountDistributions
	}
}
