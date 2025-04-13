import { IDomainEvent } from '@/shared/seedwork/idomain-event';
import { Transfer } from './transfer';

export class TransferCreatedEvent implements IDomainEvent {
	transfer: Transfer;
	dateTimeOccurred: Date;

	constructor(transfer: Transfer) {
		this.transfer = transfer;
		this.dateTimeOccurred = new Date();
	}

	getAggregateId() {
		return this.transfer.id;
	}
}
