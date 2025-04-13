import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { WalletType } from '@/domain/wallet/wallet-type';
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider';
import { Monetary } from '@/shared/domain/monetary';
import { InsufficientFundsError } from '@/shared/domain/_errors/insufficient-funds.error';
import { InsufficientWalletTypePermissionsError } from '@/shared/domain/_errors/insufficient-wallet-type-permissions.error';
import { UnauthorizedTransferError } from '@/shared/domain/_errors/unauthorized-transfer.error';
import { createFakeWallet } from '@test/helpers/wallet.helpers';
import { InMemoryUnitOfWork } from '@/infrastructure/repositories/in-memory/in-memory.unit-of-work';

function createSut(isTransferAuthorized = true) {
	const unitOfWork = new InMemoryUnitOfWork();
	const sut = new CreateP2PTransferDomainService(
		new InMemoryTransferAuthorizerProvider(isTransferAuthorized),
		unitOfWork,
	);

	return {
		sut,
		unitOfWork,
	};
}

describe('CreateP2PTransferDomainService', () => {
	it('should not create a transfer if the originating wallet type is merchant', async () => {
		const origin = createFakeWallet({ type: WalletType.MERCHANT });
		const target = createFakeWallet({ type: WalletType.COMMON });

		const amount = Monetary.create(100).getRight();

		expect(
			createSut().sut.execute(origin, target, amount),
		).rejects.toBeInstanceOf(InsufficientWalletTypePermissionsError);
	});

	it('should not create a transfer if the originating wallet balance is insufficient', async () => {
		const origin = createFakeWallet({ type: WalletType.COMMON, balance: 50 });
		const target = createFakeWallet({ type: WalletType.COMMON });

		const amount = Monetary.create(100).getRight();

		expect(
			createSut().sut.execute(origin, target, amount),
		).rejects.toBeInstanceOf(InsufficientFundsError);
	});

	it('should not create a transfer if the transfer is not authorized', async () => {
		const origin = createFakeWallet({ type: WalletType.COMMON, balance: 100 });
		const target = createFakeWallet({ type: WalletType.COMMON });

		const amount = Monetary.create(100).getRight();

		expect(
			createSut(false).sut.execute(origin, target, amount),
		).rejects.toBeInstanceOf(UnauthorizedTransferError);
	});

	it('should create a transfer if all conditions are met', async () => {
		const origin = createFakeWallet({ type: WalletType.COMMON, balance: 100 });
		const target = createFakeWallet({ type: WalletType.COMMON, balance: 0 });

		const amount = Monetary.create(100).getRight();

		expect(
			createSut().sut.execute(origin, target, amount),
		).resolves.toMatchObject({
			originId: origin.id,
			targetId: target.id,
			amount,
		});
	});
});
