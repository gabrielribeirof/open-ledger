import { Monetary } from '@/shared/domain/monetary'
import { AggregateRoot } from '@/shared/seedwork/aggregate-root'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import { AccountType } from './account-type'

interface AccountProperties {
	type: AccountType
	userId: UniqueIdentifier
	balance: Monetary
	version: number
}

export class Account extends AggregateRoot<AccountProperties> {
	get type() {
		return this.props.type
	}

	get userId() {
		return this.props.userId
	}

	get balance() {
		return this.props.balance
	}

	get version() {
		return this.props.version
	}

	public deposit(amount: Monetary): void {
		this.props.balance.add(amount)
	}

	public withdraw(amount: Monetary): void {
		this.props.balance.subtract(amount)
	}

	private constructor(props: AccountProperties, id?: UniqueIdentifier) {
		super(props, id)
	}

	public static create(
		props: AccountProperties,
		id?: UniqueIdentifier,
	): Account {
		return new Account(props, id)
	}
}
