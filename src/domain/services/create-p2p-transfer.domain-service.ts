import { Either, left } from '@/shared/lib/either';
import { Transfer } from '../transfer/transfer';
import { Wallet } from '../wallet/wallet';
import { Monetary } from '@/shared/domain/monetary';
import { InsufficientFundsError } from '../../shared/errors/insufficient-funds.error';
import { WalletType } from '../wallet/wallet-type';
import { ITransferAuthorizerProvider } from '@/providers/transfer-authorizer/itransfer-authorizer.provider';
import { UnauthorizedTransferError } from '@/shared/errors/unauthorized-transfer.error';
import { Inject, Injectable } from '@nestjs/common';
import { InsufficientWalletTypePermissionsError } from '@/shared/errors/insufficient-wallet-type-permissions.error';
import { Error } from '@/shared/seedwork/error';

@Injectable()
export class CreateP2PTransferDomainService {
	constructor(
		@Inject(ITransferAuthorizerProvider)
		private readonly transferAuthorizer: ITransferAuthorizerProvider,
	) {}

	public async execute(
		origin: Wallet,
		target: Wallet,
		amount: Monetary,
	): Promise<Either<Error, Transfer>> {
		if (origin.type !== WalletType.COMMON) {
			return left(new InsufficientWalletTypePermissionsError());
		}

		if (origin.balance.value < amount.value) {
			return left(new InsufficientFundsError());
		}

		const isAuthorized = await this.transferAuthorizer.execute(
			origin,
			target,
			amount,
		);

		if (!isAuthorized) {
			return left(new UnauthorizedTransferError());
		}

		origin.withdraw(amount);
		target.deposit(amount);

		const transfer = Transfer.create({
			originId: origin.id,
			targetId: target.id,
			amount,
		});

		return transfer;
	}
}
