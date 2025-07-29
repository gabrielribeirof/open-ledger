import { v4, validate } from 'uuid'

import { InvalidFormatViolation } from '../domain/_errors/violations/invalid-format.violation'
import { Either, left, right } from '../lib/either'
import { Violation } from './violation'

export class UniqueIdentifier {
	private readonly _value: string

	public get value(): string {
		return this._value
	}

	public equals(id: UniqueIdentifier): boolean {
		return this.value === id.value
	}

	public constructor(code?: string) {
		this._value = code || v4()
	}

	public static create(value: string): Either<Violation, UniqueIdentifier> {
		if (!validate(value)) {
			return left(new InvalidFormatViolation())
		}

		return right(new UniqueIdentifier(value))
	}
}
