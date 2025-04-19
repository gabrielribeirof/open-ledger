import { Transfer } from '../transfer/transfer';
import { Wallet } from '../wallet/wallet';
import { Monetary } from '@/shared/domain/monetary';
import { InsufficientFundsError } from '../../shared/domain/_errors/insufficient-funds.error';
import { WalletType } from '../wallet/wallet-type';
import {
	ITransferAuthorizerProvider,
	TRANSFER_AUTHORIZER_PROVIDER,
} from '@/providers/transfer-authorizer/itransfer-authorizer.provider';
import { UnauthorizedTransferError } from '@/shared/domain/_errors/unauthorized-transfer.error';
import { Inject, Injectable } from '@nestjs/common';
import { InsufficientWalletTypePermissionsError } from '@/shared/domain/_errors/insufficient-wallet-type-permissions.error';
import { IUnitOfWork, UNIT_OF_WORK } from '@/shared/seedwork/iunit-of-work';
import { InternalServerError } from '@/shared/domain/_errors/internal-server.error';

@Injectable()
export class CreateTransferDomainService {
	constructor(
		@Inject(TRANSFER_AUTHORIZER_PROVIDER)
		private readonly transferAuthorizer: ITransferAuthorizerProvider,
		@Inject(UNIT_OF_WORK)
		private readonly unitOfWork: IUnitOfWork,
	) {}

	public async execute(
		origin: Wallet,
		target: Wallet,
		amount: Monetary,
	): Promise<Transfer> {
		if (origin.type !== WalletType.COMMON) {
			throw new InsufficientWalletTypePermissionsError();
		}

		if (origin.balance.value < amount.value) {
			throw new InsufficientFundsError();
		}

		const isAuthorized = await this.transferAuthorizer.execute(
			origin,
			target,
			amount,
		);

		if (!isAuthorized) {
			throw new UnauthorizedTransferError();
		}

		origin.withdraw(amount);
		target.deposit(amount);

		const transferOrError = Transfer.create({
			originId: origin.id,
			targetId: target.id,
			amount,
		});

		if (transferOrError.isLeft()) {
			throw transferOrError.value;
		}

		await this.unitOfWork.begin();

		try {
			await this.unitOfWork.transferRepository.save(transferOrError.value);
			await this.unitOfWork.walletRepository.save(origin);
			await this.unitOfWork.walletRepository.save(target);
			await this.unitOfWork.commit();
		} catch (error) {
			await this.unitOfWork.rollback(error);

			throw new InternalServerError();
		}

		return transferOrError.value;
	}
}
