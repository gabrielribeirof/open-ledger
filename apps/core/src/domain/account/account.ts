import type { AssetCode } from '@/domain/asset/asset-code'
import { InsufficientFundsError } from '@/shared/domain/_errors/insufficient-funds.error'
import { Amount } from '@/shared/domain/amount'
import { AggregateRoot } from '@/shared/seedwork/aggregate-root'
import type { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import type { AccountAlias } from './account-alias'

interface AccountProperties {
	amount: Amount
	asset_code: AssetCode
	alias: AccountAlias
	version: number
}

interface AccountCreateProperties {
	asset_code: AssetCode
	alias: AccountAlias
}

export class Account extends AggregateRoot<AccountProperties> {
	get amount() {
		return this.properties.amount
	}

	get asset_code() {
		return this.properties.asset_code
	}

	get alias() {
		return this.properties.alias
	}

	get version() {
		return this.properties.version
	}

	public deposit(amount: Amount): void {
		this.properties.amount = this.properties.amount.add(amount)
	}

	public withdraw(amount: Amount): void {
		const newAmount = this.properties.amount.subtract(amount)
		if (newAmount.value < 0) throw new InsufficientFundsError()
		this.properties.amount = newAmount
	}

	private constructor(props: AccountProperties, id?: UniqueIdentifier) {
		super(props, id)
	}

	public static create(props: AccountCreateProperties): Account {
		return new Account({
			...props,
			amount: Amount.zero(),
			version: 1,
		})
	}

	public static from(props: AccountProperties, id: UniqueIdentifier): Account {
		return new Account(props, id)
	}
}
