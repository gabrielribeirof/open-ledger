import { Wallet } from '@/domain/wallet/wallet';
import { WalletType } from '@/domain/wallet/wallet-type';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';
import {
	WalletEntity,
	WalletEntityType,
} from '@/infrastructure/mikro-orm/entities/wallet.entity';
import { Monetary } from '@/shared/domain/monetary';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

export class WalletMapper {
	static toDomain(entity: WalletEntity): Wallet {
		const id = UniqueIdentifier.create(entity.id).getRight();
		const userId = UniqueIdentifier.create(entity.user.id).getRight();
		const balance = Monetary.create(entity.balance).getRight();

		function getType({ type }: Pick<WalletEntity, 'type'>): WalletType {
			return type === 'COMMON' ? WalletType.COMMON : WalletType.MERCHANT;
		}

		return Wallet.create(
			{
				type: getType({ type: entity.type }),
				userId,
				balance,
				version: entity.version,
			},
			id,
		);
	}

	static toPersistence(wallet: Wallet, userRef: UserEntity): WalletEntity {
		const entity = new WalletEntity();

		entity.id = wallet.id.value;
		entity.user = userRef;
		entity.balance = wallet.balance.value;
		entity.type =
			wallet.type === WalletType.COMMON
				? WalletEntityType.COMMON
				: WalletEntityType.MERCHANT;
		entity.version = wallet.version;

		return entity;
	}
}
