import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Account } from '@/domain/account/account'
import { IAccountRepository } from '@/domain/account/iaccount.repository'
import { AccountMapper } from '@/infrastructure/http/mappers/account.mapper'
import { AccountEntity } from '@/infrastructure/typeorm/entities/account.entity'

export class TypeORMAccountRepository implements IAccountRepository {
	constructor(
		@InjectRepository(AccountEntity)
		public accountRepository: Repository<AccountEntity>,
	) {}

	async findByAlias(alias: string): Promise<Account | null> {
		const entity = await this.accountRepository.findOne({ where: { alias } })
		return entity ? AccountMapper.toDomain(entity) : null
	}

	async save(account: Account): Promise<void> {
		const entity = AccountMapper.toPersistence(account)
		await this.accountRepository.save(entity)
	}
}
