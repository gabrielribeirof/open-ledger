import { BadLengthViolation } from '@/shared/domain/_errors/violations/bad-length.violation'
import type { Either } from '@/shared/lib/either'
import { left, right } from '@/shared/lib/either'
import { ValueObject } from '@/shared/seedwork/value-object'
import type { Violation } from '@/shared/seedwork/violation'

interface AccountAliasProperties {
	value: string
}

export class AccountAlias extends ValueObject<AccountAliasProperties> {
	static readonly MIN_LENGTH = 3
	static readonly MAX_LENGTH = 64

	get value(): string {
		return this.properties.value
	}

	public static create(value: string): Either<Violation, AccountAlias> {
		if (value.length > this.MAX_LENGTH || value.length < this.MIN_LENGTH) {
			return left(new BadLengthViolation(this.MIN_LENGTH, this.MAX_LENGTH))
		}

		return right(new AccountAlias({ value }))
	}
}
