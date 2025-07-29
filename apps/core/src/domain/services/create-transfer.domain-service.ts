import { Inject, Injectable } from '@nestjs/common'

import {
	ITransferAuthorizerProvider,
	TRANSFER_AUTHORIZER_PROVIDER,
} from '@/providers/transfer-authorizer/itransfer-authorizer.provider'
import { InsufficientAccountTypePermissionsError } from '@/shared/domain/_errors/insufficient-account-type-permissions.error'
import { InsufficientFundsError } from '@/shared/domain/_errors/insufficient-funds.error'
import { InternalServerError } from '@/shared/domain/_errors/internal-server.error'
import { UnauthorizedTransferError } from '@/shared/domain/_errors/unauthorized-transfer.error'
import { Monetary } from '@/shared/domain/monetary'
import { IUnitOfWork, UNIT_OF_WORK } from '@/shared/seedwork/iunit-of-work'

import { Account } from '../account/account'
import { AccountType } from '../account/account-type'
import { Transfer } from '../transfer/transfer'

@Injectable()
export class CreateTransferDomainService {
	constructor(
		@Inject(TRANSFER_AUTHORIZER_PROVIDER)
		private readonly transferAuthorizer: ITransferAuthorizerProvider,
		@Inject(UNIT_OF_WORK)
		private readonly unitOfWork: IUnitOfWork,
	) {}

	public async execute(
		origin: Account,
		target: Account,
		amount: Monetary,
	): Promise<Transfer> {
		if (origin.type !== AccountType.COMMON) {
			throw new InsufficientAccountTypePermissionsError()
		}

		if (origin.balance.value < amount.value) {
			throw new InsufficientFundsError()
		}

		const isAuthorized = await this.transferAuthorizer.execute(
			origin,
			target,
			amount,
		)

		if (!isAuthorized) {
			throw new UnauthorizedTransferError()
		}

		origin.withdraw(amount)
		target.deposit(amount)

		const transferOrError = Transfer.create({
			originId: origin.id,
			targetId: target.id,
			amount,
		})

		if (transferOrError.isLeft()) {
			throw transferOrError.value
		}

		await this.unitOfWork.begin()

		try {
			await this.unitOfWork.transferRepository.save(transferOrError.value)
			await this.unitOfWork.accountRepository.save(origin)
			await this.unitOfWork.accountRepository.save(target)
			await this.unitOfWork.commit()
		} catch (error) {
			await this.unitOfWork.rollback(error)

			throw new InternalServerError()
		}

		return transferOrError.value
	}
}
