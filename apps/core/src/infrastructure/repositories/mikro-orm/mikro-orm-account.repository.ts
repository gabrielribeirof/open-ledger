import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { IAccountRepository } from '@/domain/account/iaccount.repository';
import { Account } from '@/domain/account/account';
import { AccountMapper } from '@/infrastructure/http/mappers/account.mapper';
import { AccountEntity } from '@/infrastructure/mikro-orm/entities/account.entity';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';

@Injectable()
export class MikroOrmAccountRepository implements IAccountRepository {
	private readonly logger = new Logger(MikroOrmAccountRepository.name);

	private readonly repository: EntityRepository<AccountEntity>;

	constructor(private em: EntityManager) {
		this.repository = em.getRepository(AccountEntity);
	}

	async findById(id: UniqueIdentifier): Promise<Account | null> {
		const account = await this.repository.findOne({
			id: id.value,
		});

		return account ? AccountMapper.toDomain(account) : null;
	}

	async save(account: Account): Promise<void> {
		const userRef = this.em.getReference(UserEntity, account.userId.value);
		const accountRef = this.em.getReference(AccountEntity, account.id.value);

		AccountMapper.toPersistence(account, userRef, accountRef);
	}
}
