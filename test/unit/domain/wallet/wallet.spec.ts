import { Wallet } from '@/domain/wallet/wallet';
import { WalletType } from '@/domain/wallet/wallet-type';
import { Monetary } from '@/shared/domain/monetary';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

describe('Wallet', () => {
	it('should create wallet with valid data', () => {
		const walletType = WalletType.COMMON;
		const userId = new UniqueIdentifier();
		const balance = Monetary.create(100).getRight();
		const version = 1;

		const sut = Wallet.create({
			type: walletType,
			userId,
			balance,
			version,
		});

		expect(sut.type).toBe(walletType);
		expect(sut.userId).toBe(userId);
		expect(sut.balance).toBe(balance);
		expect(sut.version).toBe(version);
	});

	it('should be able to deposit money', () => {
		const walletType = WalletType.MERCHANT;
		const userId = new UniqueIdentifier();
		const balance = Monetary.create(100).getRight();
		const version = 1;

		const sut = Wallet.create({
			type: walletType,
			userId,
			balance,
			version,
		});

		const depositAmount = Monetary.create(100).getRight();
		sut.deposit(depositAmount);

		balance.add(depositAmount);

		expect(sut.balance.equals(balance)).toBeTruthy();
	});

	it('should be able to withdraw money', () => {
		const walletType = WalletType.MERCHANT;
		const userId = new UniqueIdentifier();
		const balance = Monetary.create(100).getRight();
		const version = 1;

		const sut = Wallet.create({
			type: walletType,
			userId,
			balance,
			version,
		});

		const withdrawAmount = Monetary.create(50).getRight();
		sut.withdraw(withdrawAmount);

		balance.subtract(withdrawAmount);

		expect(sut.balance.equals(balance)).toBeTruthy();
	});
});
