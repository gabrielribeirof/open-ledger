import { Transfer } from '@/domain/transfer/transfer';
import { TransferDTO } from '../dtos/entities/transfer.dto';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Monetary } from '@/shared/domain/monetary';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';
import { WalletEntity } from '@/infrastructure/mikro-orm/entities/wallet.entity';

export class TransferMapper {
	static toDTO(transfer: Transfer): TransferDTO {
		return {
			id: transfer.id.value,
		};
	}

	static toDomain(entity: TransferEntity): Transfer {
		const id = UniqueIdentifier.create(entity.id).getRight();
		const originId = UniqueIdentifier.create(
			entity.origin_wallet.id,
		).getRight();
		const targetId = UniqueIdentifier.create(
			entity.origin_wallet.id,
		).getRight();
		const amount = Monetary.create(entity.amount).getRight();

		return Transfer.create(
			{
				originId,
				targetId,
				amount,
			},
			id,
		).getRight();
	}

	static toPersistence(
		transfer: Transfer,
		originWalletRef: WalletEntity,
		targetWalletRef: WalletEntity,
	): TransferEntity {
		const entity = new TransferEntity();
		entity.id = transfer.id.value;
		entity.origin_wallet = originWalletRef;
		entity.target_wallet = targetWalletRef;
		entity.amount = transfer.amount.value;
		return entity;
	}
}
