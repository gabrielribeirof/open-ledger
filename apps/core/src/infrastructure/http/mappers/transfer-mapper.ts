import { Transfer } from '@/domain/transfer/transfer';
import { TransferDTO } from '../dtos/entities/transfer.dto';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';
import { AccountEntity } from '@/infrastructure/mikro-orm/entities/account.entity';

export class TransferMapper {
	static toDTO(transfer: Transfer): TransferDTO {
		return {
			id: transfer.id.value,
		};
	}

	static toPersistence(
		transfer: Transfer,
		originAccountRef: AccountEntity,
		targetAccountRef: AccountEntity,
		tranferRef?: TransferEntity,
	): TransferEntity {
		const entity = tranferRef ?? new TransferEntity();
		entity.id = transfer.id.value;
		entity.origin_account = originAccountRef;
		entity.target_account = targetAccountRef;
		entity.amount = transfer.amount.value;
		return entity;
	}
}
