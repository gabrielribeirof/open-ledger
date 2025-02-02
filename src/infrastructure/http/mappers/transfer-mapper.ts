import { Transfer } from '@/domain/transfer/transfer';
import { TransferDTO } from '../dtos/entities/transfer.dto';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Monetary } from '@/shared/domain/monetary';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';

export class TransferMapper {
	static toDTO(transfer: Transfer): TransferDTO {
		return {
			id: transfer.id.value,
		};
	}

	static toDomain(entity: TransferEntity): Transfer {
		const id = UniqueIdentifier.create(entity.id);
		const originId = UniqueIdentifier.create(entity.origin_wallet.id);
		const targetId = UniqueIdentifier.create(entity.origin_wallet.id);
		const amount = Monetary.create(entity.amount);

		return Transfer.create(
			{
				originId: originId.getRight(),
				targetId: targetId.getRight(),
				amount,
			},
			id.getRight(),
		).getRight();
	}

	static toPersistence(transfer: Transfer): TransferEntity {
		const entity = new TransferEntity();
		entity.id = transfer.id.value;
		entity.origin_wallet.id = transfer.originId.value;
		entity.target_wallet.id = transfer.targetId.value;
		entity.amount = transfer.amount.value;
		return entity;
	}
}
