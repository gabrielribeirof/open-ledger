import { Entity } from './entity';
import { IDomainEvent } from './idomain-event';

export abstract class AggregateRoot<T> extends Entity<T> {
	private _domainEvents: IDomainEvent[] = [];

	get domainEvents() {
		return this._domainEvents;
	}

	protected addDomainEvent(event: IDomainEvent) {
		this._domainEvents.push(event);
	}
}
