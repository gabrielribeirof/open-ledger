import { Decimal } from 'decimal.js'

import { ValueObject } from '../../shared/seedwork/value-object'
import { Either, left, right } from '../lib/either'
import { Violation } from '../seedwork/violation'
import { InvalidFormatViolation } from './_errors/violations/invalid-format.violation'

interface MonetaryProps {
	value: number
}

export class Monetary extends ValueObject<MonetaryProps> {
	public static readonly MAX_VALUE = 9999999999999.99

	get value(): number {
		return this.props.value
	}

	get toCents(): number {
		return Decimal.mul(this.value, 100).toNumber()
	}

	private set value(value: number) {
		this.props.value = value
	}

	public add(value: Monetary) {
		this.value = Decimal.add(this.value, value.value).toNumber()
	}

	public subtract(value: Monetary) {
		this.value = Decimal.sub(this.value, value.value).toNumber()
	}

	private static hasUpToTwoDecimals(value: number) {
		const parts = value.toString().split('.')

		if (parts.length === 1) return true

		return parts[1].length <= 2
	}

	private constructor(props: MonetaryProps) {
		super(props)
	}

	public static create(value: number): Either<Violation, Monetary> {
		if (value > this.MAX_VALUE) {
			return left(new InvalidFormatViolation())
		}

		if (!this.hasUpToTwoDecimals(value)) {
			return left(new InvalidFormatViolation())
		}

		return right(new Monetary({ value }))
	}
}
