import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { InvalidParametersError } from '../shared/domain/errors/invalid-parameters.error';
import { WalletNotFoundError } from '../shared/domain/errors/wallet-not-found.error';
import { Monetary } from '@/shared/domain/monetary';
import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { Inject, Injectable } from '@nestjs/common';
import {
	IWalletRepository,
	WALLET_REPOSITORY,
} from '@/domain/wallet/iwallet.repository';
import { Transfer } from '@/domain/transfer/transfer';

export interface CreateP2PTransferServiceInput {
	origin_id: string;
	target_id: string;
	amount: number;
}

@Injectable()
export class CreateP2PTransferService {
	constructor(
		private readonly createP2PTransferDomainService: CreateP2PTransferDomainService,
		@Inject(WALLET_REPOSITORY)
		private readonly walletRepository: IWalletRepository,
	) {}

	async execute(input: CreateP2PTransferServiceInput): Promise<Transfer> {
		const originId = UniqueIdentifier.create(input.origin_id);
		const targetId = UniqueIdentifier.create(input.target_id);
		const amount = Monetary.create(input.amount);

		if (amount.isLeft() || originId.isLeft() || targetId.isLeft()) {
			throw new InvalidParametersError<CreateP2PTransferServiceInput>({
				origin_id: originId,
				target_id: targetId,
				amount,
			});
		}

		const origin = await this.walletRepository.findById(originId.value);

		if (!origin) {
			throw new WalletNotFoundError();
		}

		const target = await this.walletRepository.findById(targetId.value);

		if (!target) {
			throw new WalletNotFoundError();
		}

		const transfer = await this.createP2PTransferDomainService.execute(
			origin,
			target,
			amount.value,
		);

		return transfer;
	}
}
