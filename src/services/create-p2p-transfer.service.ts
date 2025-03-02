import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Either, left, right } from '@/shared/lib/either';
import { InvalidParametersError } from '../shared/domain/errors/invalid-parameters.error';
import { WalletNotFoundError } from '../shared/domain/errors/wallet-not-found.error';
import { Monetary } from '@/shared/domain/monetary';
import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { Inject, Injectable } from '@nestjs/common';
import { IUnitOfWork, UNIT_OF_WORK } from '@/shared/seedwork/iunit-of-work';
import {
	IWalletRepository,
	WALLET_REPOSITORY,
} from '@/domain/wallet/iwallet.repository';
import { Transfer } from '@/domain/transfer/transfer';
import { Error } from '@/shared/seedwork/error';
import { InternalServerError } from '@/shared/domain/errors/internal-server.error';

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
		@Inject(UNIT_OF_WORK)
		private readonly unitOfWork: IUnitOfWork,
	) {}

	async execute(
		input: CreateP2PTransferServiceInput,
	): Promise<Either<Error, Transfer>> {
		const originId = UniqueIdentifier.create(input.origin_id);
		const targetId = UniqueIdentifier.create(input.target_id);
		const amount = Monetary.create(input.amount);

		if (amount.isLeft() || originId.isLeft() || targetId.isLeft()) {
			return left(
				new InvalidParametersError<CreateP2PTransferServiceInput>({
					origin_id: originId,
					target_id: targetId,
					amount,
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
			amount.value,
		);

		if (transferOrError.isLeft()) {
			return left(transferOrError.value);
		}

		await this.unitOfWork.begin();

		try {
			await this.unitOfWork.transferRepository.save(transferOrError.value);
			await this.unitOfWork.walletRepository.save(origin);
			await this.unitOfWork.walletRepository.save(target);
			await this.unitOfWork.commit();
		} catch {
			await this.unitOfWork.rollback();

			return left(new InternalServerError());
		}

		return right(transferOrError.value);
	}
}
