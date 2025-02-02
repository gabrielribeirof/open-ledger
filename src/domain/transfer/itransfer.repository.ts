import { UniqueIdentifier } from '../../shared/seedwork/unique-identifier';
import { Transfer } from './transfer';

export interface ITransferRepository {
	findById(id: UniqueIdentifier): Promise<Transfer | null>;
	save(transfer: Transfer): Promise<void>;
}

export const TRANSFER_REPOSITORY = 'ITransferRepository';
