import { Transfer } from '@/domain/transfer/transfer';
import { TransferDTO } from '../dtos/entities/transfer.dto';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';
import { WalletEntity } from '@/infrastructure/mikro-orm/entities/wallet.entity';

export class TransferMapper {
	static toDTO(transfer: Transfer): TransferDTO {
		return {
			id: transfer.id.value,
		};
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
