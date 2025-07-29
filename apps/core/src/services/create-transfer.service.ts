import { Inject, Injectable } from '@nestjs/common'

import {
	ACCOUNT_REPOSITORY,
	IAccountRepository,
} from '@/domain/account/iaccount.repository'
import { CreateTransferDomainService } from '@/domain/services/create-transfer.domain-service'
import { Transfer } from '@/domain/transfer/transfer'
import { Monetary } from '@/shared/domain/monetary'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import { AccountNotFoundError } from '../shared/domain/_errors/account-not-found.error'
import { InvalidParametersError } from '../shared/domain/_errors/invalid-parameters.error'

export interface CreateTransferServiceInput {
	origin_id: string
	target_id: string
	amount: number
}

@Injectable()
export class CreateTransferService {
	constructor(
		private readonly createTransferDomainService: CreateTransferDomainService,
		@Inject(ACCOUNT_REPOSITORY)
		private readonly accountRepository: IAccountRepository,
	) {}

	async execute(input: CreateTransferServiceInput): Promise<Transfer> {
		const originId = UniqueIdentifier.create(input.origin_id)
		const targetId = UniqueIdentifier.create(input.target_id)
		const amount = Monetary.create(input.amount)

		if (amount.isLeft() || originId.isLeft() || targetId.isLeft()) {
			throw new InvalidParametersError<CreateTransferServiceInput>({
				origin_id: originId,
				target_id: targetId,
				amount,
			})
		}

		const origin = await this.accountRepository.findById(originId.value)

		if (!origin) {
			throw new AccountNotFoundError()
		}

		const target = await this.accountRepository.findById(targetId.value)

		if (!target) {
			throw new AccountNotFoundError()
		}

		const transfer = await this.createTransferDomainService.execute(
			origin,
			target,
			amount.value,
		)

		return transfer
	}
}
