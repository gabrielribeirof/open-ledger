import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable, Logger } from '@nestjs/common'

import { IAccountRepository } from '@/domain/account/iaccount.repository'
import { ITransferRepository } from '@/domain/transfer/itransfer.repository'
import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work'

import { MikroOrmAccountRepository } from './mikro-orm-account.repository'
import { MikroOrmTransferRepository } from './mikro-orm-transfer.repository'

@Injectable()
export class MikroOrmUnitOfWork implements IUnitOfWork {
	private readonly logger = new Logger(MikroOrmUnitOfWork.name)

	private em: EntityManager

	public transferRepository: ITransferRepository
	public accountRepository: IAccountRepository

	constructor(em: EntityManager) {
		this.em = em.fork()
		this.transferRepository = new MikroOrmTransferRepository(this.em)
		this.accountRepository = new MikroOrmAccountRepository(this.em)
	}

	async begin() {
		await this.em.begin()
	}

	async commit() {
		await this.em.commit()
	}

	async rollback(error: unknown) {
		this.logger.error({
			status: 'rollback',
			error,
		})

		await this.em.rollback()
	}
}
