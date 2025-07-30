import { AssetCode } from '@/domain/asset/asset-code'
import { Amount } from '@/shared/domain/amount'
import { AggregateRoot } from '@/shared/seedwork/aggregate-root'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

interface AccountProperties {
	balance: Amount
	asset_code: AssetCode
	version: number
}

export class Account extends AggregateRoot<AccountProperties> {
	get balance() {
		return this.properties.balance
	}

	get asset_code() {
		return this.properties.asset_code
	}

	get version() {
		return this.properties.version
	}

	private constructor(props: AccountProperties, id?: UniqueIdentifier) {
		super(props, id)
	}

	public static create(props: AccountProperties, id?: UniqueIdentifier): Account {
		return new Account(props, id)
	}
}
