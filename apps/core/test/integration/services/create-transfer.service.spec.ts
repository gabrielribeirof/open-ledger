import { CreateTransferDomainService } from '@/domain/services/create-transfer.domain-service';
import { InMemoryWalletRepository } from '@/infrastructure/repositories/in-memory/in-memory-wallet.repository';
import { InMemoryUnitOfWork } from '@/infrastructure/repositories/in-memory/in-memory.unit-of-work';
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider';
import {
	CreateTransferServiceInput,
	CreateTransferService,
} from '@/services/create-transfer.service';
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error';
import { InvalidFormatViolation } from '@/shared/domain/_errors/violations/invalid-format.violation';
import { WalletNotFoundError } from '@/shared/domain/_errors/wallet-not-found.error';
import { createFakeWallet } from '@test/helpers/wallet.helpers';
import { v4 } from 'uuid';

const unitOfWork = new InMemoryUnitOfWork();
const domainService = new CreateTransferDomainService(
	new InMemoryTransferAuthorizerProvider(true),
	unitOfWork,
);
const walletRepository = new InMemoryWalletRepository();

const sut = new CreateTransferService(domainService, walletRepository);

describe('CreateTransferDomainService', () => {
	beforeEach(() => {
		walletRepository.wallet.clear();
	});

	it('should not be executed with invalid parameters', async () => {
		const result = sut.execute({
			origin_id: 'originId',
			target_id: 'targetId',
			amount: 1.111,
		});

		expect(result).rejects.toEqual(
			new InvalidParametersError<CreateTransferServiceInput>({
				origin_id: [new InvalidFormatViolation()],
				target_id: [new InvalidFormatViolation()],
				amount: [new InvalidFormatViolation()],
			}),
		);
	});

	it('should not be executed if the origin wallet does not exist', async () => {
		const result = sut.execute({
			origin_id: v4(),
			target_id: v4(),
			amount: 1,
		});

		expect(result).rejects.toBeInstanceOf(WalletNotFoundError);
	});

	it('should not be executed if the target wallet does not exist', async () => {
		const originWallet = createFakeWallet();

		walletRepository.save(originWallet);

		const result = sut.execute({
			origin_id: originWallet.id.value,
			target_id: v4(),
			amount: 1,
		});

		expect(result).rejects.toBeInstanceOf(WalletNotFoundError);
	});
});
