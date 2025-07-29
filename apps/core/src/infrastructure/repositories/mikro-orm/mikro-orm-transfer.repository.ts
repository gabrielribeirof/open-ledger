import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import { ITransferRepository } from '@/domain/transfer/itransfer.repository'
import { Transfer } from '@/domain/transfer/transfer'
import { TransferMapper } from '@/infrastructure/http/mappers/transfer-mapper'
import { AccountEntity } from '@/infrastructure/mikro-orm/entities/account.entity'

@Injectable()
export class MikroOrmTransferRepository implements ITransferRepository {
	constructor(private em: EntityManager) {}

	async save(transfer: Transfer): Promise<void> {
		const originAccountRef = this.em.getReference(
			AccountEntity,
			transfer.originId.value,
		)
		const targetAccountRef = this.em.getReference(
			AccountEntity,
			transfer.targetId.value,
		)

		TransferMapper.toPersistence(transfer, originAccountRef, targetAccountRef)
	}
}
