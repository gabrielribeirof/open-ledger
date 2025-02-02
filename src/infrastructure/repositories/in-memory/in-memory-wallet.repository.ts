import { IWalletRepository } from '@/domain/wallet/iwallet.repository';
import { Wallet } from '@/domain/wallet/wallet';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

export class InMemoryWalletRepository implements IWalletRepository {
	public wallet = new Map<string, Wallet>();

	async findById(id: UniqueIdentifier): Promise<Wallet | null> {
		return this.wallet.get(id.value) ?? null;
	}

	async save(wallet: Wallet): Promise<void> {
		this.wallet.set(wallet.id.value, wallet);
	}
}
