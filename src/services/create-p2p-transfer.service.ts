import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Either, left, right } from '@/shared/lib/either';
import { InvalidParametersError } from '../shared/errors/invalid-parameters.error';
import { WalletNotFoundError } from '../shared/errors/wallet-not-found.error';
import { Monetary } from '@/shared/domain/monetary';
import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { Inject, Injectable } from '@nestjs/common';
import { IUnitOfWork, UNIT_OF_WORK } from '@/shared/seedwork/iunit-of-work';
import {
	ITransferRepository,
	TRANSFER_REPOSITORY,
} from '@/domain/transfer/itransfer.repository';
import {
	IWalletRepository,
	WALLET_REPOSITORY,
} from '@/domain/wallet/iwallet.repository';
import { Transfer } from '@/domain/transfer/transfer';
import { Error } from '@/shared/seedwork/error';

export interface CreateP2PTransferServiceInput {
	originId: string;
	targetId: string;
	amount: number;
}

@Injectable()
export class CreateP2PTransferService {
	constructor(
		private readonly createP2PTransferDomainService: CreateP2PTransferDomainService,
		@Inject(TRANSFER_REPOSITORY)
		private readonly transferRepository: ITransferRepository,
		@Inject(WALLET_REPOSITORY)
		private readonly walletRepository: IWalletRepository,
		@Inject(UNIT_OF_WORK)
		private readonly unitOfWork: IUnitOfWork,
	) {}

	async execute(
		input: CreateP2PTransferServiceInput,
	): Promise<Either<Error, Transfer>> {
		const originId = UniqueIdentifier.create(input.originId);
		const targetId = UniqueIdentifier.create(input.targetId);
		const amount = Monetary.create(input.amount);

		if (originId.isLeft() || targetId.isLeft()) {
			return left(
				new InvalidParametersError<CreateP2PTransferServiceInput>({
					originId,
					targetId,
				}),
			);
		}

		const origin = await this.walletRepository.findById(originId.value);

		if (!origin) {
			return left(new WalletNotFoundError());
		}

		const target = await this.walletRepository.findById(targetId.value);

		if (!target) {
			return left(new WalletNotFoundError());
		}

		const transferOrError = await this.createP2PTransferDomainService.execute(
			origin,
			target,
			amount,
		);

		if (transferOrError.isLeft()) {
			return left(transferOrError.value);
		}

		try {
			await this.transferRepository.save(transferOrError.value);
			await this.walletRepository.save(origin);
			await this.walletRepository.save(target);
			await this.unitOfWork.commit();
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}

		return right(transferOrError.value);
	}
}
