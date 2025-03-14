import { EntityManager } from '@mikro-orm/postgresql';
import { ITransferRepository } from '@/domain/transfer/itransfer.repository';
import { Transfer } from '@/domain/transfer/transfer';
import { TransferMapper } from '@/infrastructure/http/mappers/transfer-mapper';
import { Injectable } from '@nestjs/common';
import { WalletEntity } from '@/infrastructure/mikro-orm/entities/wallet.entity';

@Injectable()
export class MikroOrmTransferRepository implements ITransferRepository {
	constructor(private em: EntityManager) {}

	async save(transfer: Transfer): Promise<void> {
		const originWalletRef = this.em.getReference(
			WalletEntity,
			transfer.originId.value,
		);
		const targetWalletRef = this.em.getReference(
			WalletEntity,
			transfer.targetId.value,
		);

		TransferMapper.toPersistence(transfer, originWalletRef, targetWalletRef);
	}
}
