import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ITransferRepository } from '@/domain/transfer/itransfer.repository';
import { Transfer } from '@/domain/transfer/transfer';
import { TransferMapper } from '@/infrastructure/http/mappers/transfer-mapper';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmTransferRepository implements ITransferRepository {
	constructor(
		@InjectRepository(TransferEntity)
		private readonly repository: EntityRepository<TransferEntity>,
	) {}

	async findById(id: UniqueIdentifier): Promise<Transfer | null> {
		const transfer = await this.repository.findOne({ id: id.value });

		return transfer ? TransferMapper.toDomain(transfer) : null;
	}

	async save(transfer: Transfer): Promise<void> {
		await this.repository.upsert(TransferMapper.toPersistence(transfer));
	}
}
