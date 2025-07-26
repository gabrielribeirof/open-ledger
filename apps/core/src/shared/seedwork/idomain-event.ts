import { UniqueIdentifier } from './unique-identifier';

export interface IDomainEvent {
	dateTimeOccurred: Date;
	getAggregateId(): UniqueIdentifier;
}
