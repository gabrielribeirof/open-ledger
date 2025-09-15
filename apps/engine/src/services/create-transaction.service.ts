import { Inject, Injectable } from '@nestjs/common'

import { ASSET_REPOSITORY_TOKEN, IAssetRepository } from '@/domain/asset/iasset.repository'
import { CreateTransactionDomainService } from '@/domain/services/create-transaction.domain-service'
import { AmountDistribution as DomainAmountDistribution } from '@/domain/services/inputs/children/amount-distribution'
import { Distribution as DomainDistribution } from '@/domain/services/inputs/children/distribution'
import { RemainingDistribution as DomainRemainingDistribution } from '@/domain/services/inputs/children/remaining-distribution'
import { ShareDistribution as DomainShareDistribution } from '@/domain/services/inputs/children/share-distribution'
import { Transaction } from '@/domain/transaction/transaction'
import { AccountNotFoundError } from '@/shared/domain/_errors/account-not-found.error'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'
import { InvalidAmountError } from '@/shared/domain/_errors/invalid-amount.error'
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error'
import { Amount } from '@/shared/domain/amount'
import { IUnitOfWork, UNIT_OF_WORK_TOKEN } from '@/shared/seedwork/iunit-of-work'

interface AmountDistribution {
	amount: {
		value: bigint
		scale: number
	}
}

interface ShareDistribution {
	share: number
}

interface RemainingDistribution {
	remaining: true
}

type Distribution = (AmountDistribution | ShareDistribution | RemainingDistribution) & {
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
		@Inject(UNIT_OF_WORK_TOKEN)
		private readonly unitOfWork: IUnitOfWork,
		@Inject(ASSET_REPOSITORY_TOKEN)
		private readonly assetRepository: IAssetRepository,
		private readonly createTransactionDomainService: CreateTransactionDomainService,
	) {}

	async execute(input: CreateTransactionServiceInput): Promise<Transaction> {
		const amount = Amount.create({ value: input.value, scale: input.scale })

		if (amount.isLeft()) throw new InvalidParametersError({ amount: [amount.value] })

		const asset = await this.assetRepository.findByCode(input.asset_code)

		if (!asset) throw new AssetNotFoundError()

		await this.unitOfWork.begin()

		try {
			const sources = await this.convertDistributionsToDomainDistributions(input.sources)
			const targets = await this.convertDistributionsToDomainDistributions(input.targets)

			const transaction = await this.createTransactionDomainService.execute({
				amount: amount.value,
				asset,
				sources,
				targets,
			})

			await this.unitOfWork.transactionRepository.save(transaction)
			await Promise.all([
				...sources.map((source) => this.unitOfWork.accountRepository.save(source.account)),
				...targets.map((target) => this.unitOfWork.accountRepository.save(target.account)),
			])

			await this.unitOfWork.commit()

			return transaction
		} catch (error) {
			await this.unitOfWork.rollback(error)
			throw error
		}
	}

	private async convertDistributionsToDomainDistributions(
		distributions: Distribution[],
	): Promise<DomainDistribution[]> {
		const domainDistributions: DomainDistribution[] = []

		for (const { account_alias, ...distribution } of distributions) {
			const account = await this.unitOfWork.accountRepository.findByAlias(account_alias)

			if (!account) throw new AccountNotFoundError()

			if ('amount' in distribution) {
				const amount = Amount.create({
					value: distribution.amount.value,
					scale: distribution.amount.scale,
				})

				if (amount.isLeft()) throw new InvalidAmountError()

				domainDistributions.push(new DomainAmountDistribution(account, amount.value))
			}

			if ('share' in distribution) domainDistributions.push(new DomainShareDistribution(account, distribution.share))

			if ('remaining' in distribution) domainDistributions.push(new DomainRemainingDistribution(account))
		}

		return domainDistributions
	}
}
