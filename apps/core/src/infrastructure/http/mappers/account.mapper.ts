import { Account } from '@/domain/account/account';
import { AccountType } from '@/domain/account/account-type';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';
import {
	AccountEntity,
	AccountEntityType,
} from '@/infrastructure/mikro-orm/entities/account.entity';
import { Monetary } from '@/shared/domain/monetary';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

export class AccountMapper {
	static toDomain(entity: AccountEntity): Account {
		const id = UniqueIdentifier.create(entity.id).getRight();
		const userId = UniqueIdentifier.create(entity.user.id).getRight();
		const balance = Monetary.create(entity.balance).getRight();

		function getType({ type }: Pick<AccountEntity, 'type'>): AccountType {
			return type === 'COMMON' ? AccountType.COMMON : AccountType.MERCHANT;
		}

		return Account.create(
			{
				type: getType({ type: entity.type }),
				userId,
				balance,
				version: entity.version,
			},
			id,
		);
	}

	static toPersistence(
		account: Account,
		userRef: UserEntity,
		accountRef?: AccountEntity,
	): AccountEntity {
		const entity = accountRef ?? new AccountEntity();

		entity.id = account.id.value;
		entity.user = userRef;
		entity.balance = account.balance.value;
		entity.type =
			account.type === AccountType.COMMON
				? AccountEntityType.COMMON
				: AccountEntityType.MERCHANT;

		return entity;
	}
}
