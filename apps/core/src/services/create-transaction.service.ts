import { Inject, Injectable } from '@nestjs/common'

import { ACCOUNT_REPOSITORY_TOKEN, IAccountRepository } from '@/domain/accountv2/iaccount.repository'
import { ASSET_REPOSITORY_TOKEN, IAssetRepository } from '@/domain/asset/iasset.repository'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'
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
		private readonly accountRepository: IAccountRepository,
	) {}

	async execute(input: CreateTransactionServiceInput): Promise<void> {
		const amount = Amount.create({ value: input.value, scale: input.scale })

		if (amount.isLeft()) {
			throw new InvalidParametersError<CreateTransactionServiceInput>({
				value: amount.value.value,
				scale: amount.value.scale,
			})
		}

		const asset = await this.assetRepository.findByCode(input.asset_code)

		if (!asset) throw new AssetNotFoundError()

		const validateSources = this.validateDistributions(input.sources)
		const validateTargets = this.validateDistributions(input.targets)

		const violations = {
			...(Object.keys(validateSources).length > 0 && { sources: validateSources }),
			...(Object.keys(validateTargets).length > 0 && { targets: validateTargets }),
		}

		if (Object.keys(violations).length > 0) throw new InvalidParametersError<CreateTransactionServiceInput>(violations)

		// TODO: Continuar com a lógica de criação da transação
	}

	private validateDistributions(distributions: Distribution[]): Record<number, any> {
		return distributions.reduce(
			(violations, distribution, index) => {
				if ('amount' in distribution) {
					const amount = Amount.create({
						value: distribution.amount.value,
						scale: distribution.amount.scale,
					})

					if (amount.isLeft()) {
						return {
							...violations,
							[index]: {
								amount: {
									value: amount.value.value,
									scale: amount.value.scale,
								},
							},
						}
					}
				}
				return violations
			},
			{} as Record<number, any>,
		)
	}
}
