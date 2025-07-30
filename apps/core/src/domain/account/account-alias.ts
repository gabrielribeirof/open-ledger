import { ValueObject } from '@/shared/seedwork/value-object'

interface AccountAliasProperties {
	value: string
}

export class AccountAlias extends ValueObject<AccountAliasProperties> {
	get value(): string {
		return this.properties.value
	}

	public static create(value: string): AccountAlias {
		return new AccountAlias({ value })
	}
}
