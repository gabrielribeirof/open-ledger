import { CreateP2PTransferDomainService } from '@/domain/services/create-p2p-transfer.domain-service';
import { WalletType } from '@/domain/wallet/wallet-type';
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider';
import { Monetary } from '@/shared/domain/monetary';
import { InsufficientFundsError } from '@/shared/domain/errors/insufficient-funds.error';
import { InsufficientWalletTypePermissionsError } from '@/shared/domain/errors/insufficient-wallet-type-permissions.error';
import { UnauthorizedTransferError } from '@/shared/domain/errors/unauthorized-transfer.error';
import { createFakeWallet } from '@test/helpers/wallet.helpers';

function createSut(authorizerResponse = true) {
	return new CreateP2PTransferDomainService(
		new InMemoryTransferAuthorizerProvider(authorizerResponse),
	);
}

describe('CreateP2PTransferDomainService', () => {
	it('should not create a transfer if the originating wallet type is merchant', async () => {
		const origin = createFakeWallet({ type: WalletType.MERCHANT });
		const target = createFakeWallet({ type: WalletType.COMMON });

		const amount = Monetary.create(100).getRight();

		const result = await createSut().execute(origin, target, amount);

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(InsufficientWalletTypePermissionsError);
	});

	it('should not create a transfer if the originating wallet balance is insufficient', async () => {
		const origin = createFakeWallet({ type: WalletType.COMMON, balance: 50 });
		const target = createFakeWallet({ type: WalletType.COMMON });

		const amount = Monetary.create(100).getRight();

		const result = await createSut().execute(origin, target, amount);

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(InsufficientFundsError);
	});

	it('should not create a transfer if the transfer is not authorized', async () => {
		const origin = createFakeWallet({ type: WalletType.COMMON, balance: 100 });
		const target = createFakeWallet({ type: WalletType.COMMON });

		const amount = Monetary.create(100).getRight();

		const result = await createSut(false).execute(origin, target, amount);

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(UnauthorizedTransferError);
	});

	it('should create a transfer if all conditions are met', async () => {
		const origin = createFakeWallet({ type: WalletType.COMMON, balance: 100 });
		const target = createFakeWallet({ type: WalletType.COMMON, balance: 0 });

		const amount = Monetary.create(100).getRight();

		const result = await createSut().execute(origin, target, amount);

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toMatchObject({
			originId: origin.id,
			targetId: target.id,
			amount,
		});
		expect(origin.balance.value).toBe(0);
		expect(target.balance.value).toBe(100);
	});
});
