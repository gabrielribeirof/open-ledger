import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { InMemoryTransferRepository } from '@/infrastructure/repositories/in-memory/in-memory-transfer.repository';
import { InMemoryWalletRepository } from '@/infrastructure/repositories/in-memory/in-memory-wallet.repository';
import { InMemoryUnitOfWork } from '@/infrastructure/repositories/in-memory/in-memory.unit-of-work';
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/implementations/in-memory-transfer-authorizer.provider';
import {
	CreateP2PTransferServiceInput,
	CreateP2PTransferService,
} from '@/services/create-p2p-transfer.service';
import { InvalidParametersError } from '@/shared/errors/invalid-parameters.error';

function createSut(authorizerResponse = true) {
	const domainService = new CreateP2PTransferDomainService(
		new InMemoryTransferAuthorizerProvider(authorizerResponse),
	);
	const transferRepository = new InMemoryTransferRepository();
	const walletRepository = new InMemoryWalletRepository();
	const unitOfWork = new InMemoryUnitOfWork();

	return new CreateP2PTransferService(
		domainService,
		transferRepository,
		walletRepository,
		unitOfWork,
	);
}

describe('CreateP2PTransferService', () => {
	it('should not be executed with invalid parameters', async () => {
		const input = {
			originId: 'originId',
			targetId: 'targetId',
			amount: 1.111,
		};

		const sut = await createSut().execute(input);

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidParametersError);
		expect(
			(sut.value as InvalidParametersError<CreateP2PTransferServiceInput>)
				.violations,
		).toMatchObject({
			originId: expect.anything(),
			targetId: expect.anything(),
			amount: expect.anything(),
		});
	});
});
