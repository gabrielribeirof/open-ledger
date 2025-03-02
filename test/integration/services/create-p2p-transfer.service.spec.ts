import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { Transfer } from '@/domain/transfer/transfer';
import { InMemoryWalletRepository } from '@/infrastructure/repositories/in-memory/in-memory-wallet.repository';
import { InMemoryUnitOfWork } from '@/infrastructure/repositories/in-memory/in-memory.unit-of-work';
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider';
import {
	CreateP2PTransferServiceInput,
	CreateP2PTransferService,
} from '@/services/create-p2p-transfer.service';
import { InsufficientFundsError } from '@/shared/domain/errors/insufficient-funds.error';
import { InternalServerError } from '@/shared/domain/errors/internal-server.error';
import { InvalidParametersError } from '@/shared/domain/errors/invalid-parameters.error';
import { InvalidFormatViolation } from '@/shared/domain/errors/violations/invalid-format.violation';
import { WalletNotFoundError } from '@/shared/domain/errors/wallet-not-found.error';
import { createFakeWallet } from '@test/helpers/wallet.helpers';
import { v4 } from 'uuid';

const domainService = new CreateP2PTransferDomainService(
	new InMemoryTransferAuthorizerProvider(true),
);
const walletRepository = new InMemoryWalletRepository();
const unitOfWork = new InMemoryUnitOfWork();

const sut = new CreateP2PTransferService(
	domainService,
	walletRepository,
	unitOfWork,
);

describe('CreateP2PTransferService', () => {
	beforeEach(() => {
		walletRepository.wallet.clear();
	});

	it('should not be executed with invalid parameters', async () => {
		const result = await sut.execute({
			origin_id: 'originId',
			target_id: 'targetId',
			amount: 1.111,
		});

		expect(result.value).toBeInstanceOf(InvalidParametersError);
		expect(result.value).toEqual(
			new InvalidParametersError<CreateP2PTransferServiceInput>({
				origin_id: [new InvalidFormatViolation()],
				target_id: [new InvalidFormatViolation()],
				amount: [new InvalidFormatViolation()],
			}),
		);
	});

	it('should not be executed if the origin wallet does not exist', async () => {
		const result = await sut.execute({
			origin_id: v4(),
			target_id: v4(),
			amount: 1,
		});

		expect(result.value).toBeInstanceOf(WalletNotFoundError);
	});

	it('should not be executed if the target wallet does not exist', async () => {
		const originWallet = createFakeWallet();

		walletRepository.save(originWallet);

		const result = await sut.execute({
			origin_id: originWallet.id.value,
			target_id: v4(),
			amount: 1,
		});

		expect(result.value).toBeInstanceOf(WalletNotFoundError);
	});

	it('should not be executed if the origin wallet does not have enough balance', async () => {
		const originWallet = createFakeWallet({
			balance: 0,
		});
		const targetWallet = createFakeWallet();

		walletRepository.save(originWallet);
		walletRepository.save(targetWallet);

		const result = await sut.execute({
			origin_id: originWallet.id.value,
			target_id: targetWallet.id.value,
			amount: 1,
		});

		expect(result.value).toBeInstanceOf(InsufficientFundsError);
	});

	it('should rollback unit of work if an error occurs', async () => {
		const originWallet = createFakeWallet();
		const targetWallet = createFakeWallet();

		walletRepository.save(originWallet);
		walletRepository.save(targetWallet);

		const begin = jest.spyOn(unitOfWork, 'begin');
		const commit = jest.spyOn(unitOfWork, 'commit');
		const rollback = jest.spyOn(unitOfWork, 'rollback');

		jest.spyOn(unitOfWork.transferRepository, 'save').mockRejectedValueOnce(0);

		const result = await sut.execute({
			origin_id: originWallet.id.value,
			target_id: targetWallet.id.value,
			amount: 1,
		});

		expect(result.value).toBeInstanceOf(InternalServerError);
		expect(begin).toHaveBeenCalledTimes(1);
		expect(commit).toHaveBeenCalledTimes(0);
		expect(rollback).toHaveBeenCalledTimes(1);

		begin.mockReset();
		commit.mockReset();
		rollback.mockReset();
	});

	it('should be able to create a transfer when all conditions are met', async () => {
		const originWallet = createFakeWallet();
		const targetWallet = createFakeWallet();

		walletRepository.save(originWallet);
		walletRepository.save(targetWallet);

		const begin = jest.spyOn(unitOfWork, 'begin');
		const commit = jest.spyOn(unitOfWork, 'commit');

		const result = await sut.execute({
			origin_id: originWallet.id.value,
			target_id: targetWallet.id.value,
			amount: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toBeInstanceOf(Transfer);
		expect(begin).toHaveBeenCalledTimes(1);
		expect(commit).toHaveBeenCalledTimes(1);
	});
});
