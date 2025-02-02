import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { Transfer } from '@/domain/transfer/transfer';
import { InMemoryTransferRepository } from '@/infrastructure/repositories/in-memory/in-memory-transfer.repository';
import { InMemoryWalletRepository } from '@/infrastructure/repositories/in-memory/in-memory-wallet.repository';
import { InMemoryUnitOfWork } from '@/infrastructure/repositories/in-memory/in-memory.unit-of-work';
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/implementations/in-memory-transfer-authorizer.provider';
import {
	CreateP2PTransferServiceInput,
	CreateP2PTransferService,
} from '@/services/create-p2p-transfer.service';
import { InsufficientFundsError } from '@/shared/errors/insufficient-funds.error';
import { InternalServerError } from '@/shared/errors/internal-server.error';
import { InvalidParametersError } from '@/shared/errors/invalid-parameters.error';
import { InvalidFormatViolation } from '@/shared/errors/violations/invalid-format.violation';
import { WalletNotFoundError } from '@/shared/errors/wallet-not-found.error';
import { createFakeWallet } from '@test/helpers/wallet.helpers';
import { v4 } from 'uuid';

const domainService = new CreateP2PTransferDomainService(
	new InMemoryTransferAuthorizerProvider(true),
);
const transferRepository = new InMemoryTransferRepository();
const walletRepository = new InMemoryWalletRepository();
const unitOfWork = new InMemoryUnitOfWork();

const sut = new CreateP2PTransferService(
	domainService,
	transferRepository,
	walletRepository,
	unitOfWork,
);

describe('CreateP2PTransferService', () => {
	beforeEach(() => {
		transferRepository.transfers.clear();
		walletRepository.wallet.clear();
	});

	it('should not be executed with invalid parameters', async () => {
		const result = await sut.execute({
			originId: 'originId',
			targetId: 'targetId',
			amount: 1.111,
		});

		expect(result.value).toBeInstanceOf(InvalidParametersError);
		expect(result.value).toEqual(
			new InvalidParametersError<CreateP2PTransferServiceInput>({
				originId: [new InvalidFormatViolation()],
				targetId: [new InvalidFormatViolation()],
				amount: [new InvalidFormatViolation()],
			}),
		);
	});

	it('should not be executed if the origin wallet does not exist', async () => {
		const result = await sut.execute({
			originId: v4(),
			targetId: v4(),
			amount: 1,
		});

		expect(result.value).toBeInstanceOf(WalletNotFoundError);
	});

	it('should not be executed if the target wallet does not exist', async () => {
		const originWallet = createFakeWallet();

		walletRepository.save(originWallet);

		const result = await sut.execute({
			originId: originWallet.id.value,
			targetId: v4(),
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
			originId: originWallet.id.value,
			targetId: targetWallet.id.value,
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

		jest.spyOn(transferRepository, 'save').mockRejectedValueOnce(0);

		const result = await sut.execute({
			originId: originWallet.id.value,
			targetId: targetWallet.id.value,
			amount: 1,
		});

		expect(result.value).toBeInstanceOf(InternalServerError);
		expect(begin).toHaveBeenCalledTimes(1);
		expect(commit).toHaveBeenCalledTimes(0);
		expect(rollback).toHaveBeenCalledTimes(1);

		begin.mockReset();
	});

	it('should be able to create a transfer when all conditions are met', async () => {
		const originWallet = createFakeWallet();
		const targetWallet = createFakeWallet();

		walletRepository.save(originWallet);
		walletRepository.save(targetWallet);

		const begin = jest.spyOn(unitOfWork, 'begin');
		const commit = jest.spyOn(unitOfWork, 'commit');

		const result = await sut.execute({
			originId: originWallet.id.value,
			targetId: targetWallet.id.value,
			amount: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toBeInstanceOf(Transfer);
		expect(begin).toHaveBeenCalledTimes(1);
		expect(commit).toHaveBeenCalledTimes(1);
	});
});
