import { Entity } from './entity'
import type { IDomainEvent } from './idomain-event'

export abstract class AggregateRoot<T> extends Entity<T> {
	private readonly _domainEvents: IDomainEvent[] = []

	get domainEvents() {
		return this._domainEvents
	}

	protected addDomainEvent(event: IDomainEvent) {
		this._domainEvents.push(event)
	}
}
