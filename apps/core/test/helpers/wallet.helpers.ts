import { Wallet } from '@/domain/wallet/wallet';
import { WalletType } from '@/domain/wallet/wallet-type';
import { Monetary } from '@/shared/domain/monetary';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { v4 } from 'uuid';

interface Props {
	type: WalletType | 'random';
	balance: number;
	userId: string;
	version: number;
}

export function createWalletProps(): Props {
	return {
		type: WalletType.COMMON,
		balance: 100,
		userId: v4(),
		version: 1,
	};
}

export function createFakeWallet(props: Partial<Props> = {}) {
	const balance = Monetary.create(props.balance ?? 100);
	const userId = new UniqueIdentifier(props.userId);
	const version = props.version ?? 1;

	function getType(): WalletType {
		if (props.type === 'random') {
			const types = Object.values(WalletType) as WalletType[];
			const index = Math.floor(Math.random() * types.length);
			return types[index];
		}

		return props.type ?? WalletType.COMMON;
	}

	return Wallet.create({
		type: getType(),
		balance: balance.getRight(),
		userId,
		version,
	});
}
