import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ITransferRepository } from '@/domain/transfer/itransfer.repository';
import { Transfer } from '@/domain/transfer/transfer';
import { TransferMapper } from '@/infrastructure/http/mappers/transfer-mapper';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Injectable } from '@nestjs/common';
import { WalletEntity } from '@/infrastructure/mikro-orm/entities/wallet.entity';

@Injectable()
export class MikroOrmTransferRepository implements ITransferRepository {
	private readonly repository: EntityRepository<TransferEntity>;

	constructor(em: EntityManager) {
		this.repository = em.getRepository(TransferEntity);
	}

	async findById(id: UniqueIdentifier): Promise<Transfer | null> {
		const transfer = await this.repository.findOne({ id: id.value });

		return transfer ? TransferMapper.toDomain(transfer) : null;
	}

	async save(transfer: Transfer): Promise<void> {
		const originWalletRef = this.repository
			.getEntityManager()
			.getReference(WalletEntity, transfer.originId.value);
		const targetWalletRef = this.repository
			.getEntityManager()
			.getReference(WalletEntity, transfer.targetId.value);

		await this.repository.upsert(
			TransferMapper.toPersistence(transfer, originWalletRef, targetWalletRef),
		);
	}
}
