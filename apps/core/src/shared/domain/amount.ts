import { ValueObject } from '@/shared/seedwork/value-object'

import { Either, left, right } from '../lib/either'
import { Violation } from '../seedwork/violation'
import { InvalidFormatViolation } from './_errors/violations/invalid-format.violation'

interface AmountProperties {
	value: bigint
	scale: number
}

export class Amount extends ValueObject<AmountProperties> {
	static readonly MINIMUM_NUMBER = 0

	get value(): bigint {
		return this.properties.value
	}

	get scale(): number {
		return this.properties.scale
	}

	public add(other: Amount): Amount {
		const { v1, v2, scale } = Amount.normalize(this, other)
		return new Amount({ value: v1 + v2, scale })
	}

	public subtract(other: Amount): Amount {
		const { v1, v2, scale } = Amount.normalize(this, other)
		return new Amount({ value: v1 - v2, scale })
	}

	public multiply(factor: Amount): Amount {
		const { v1, scale } = Amount.normalize(this, Amount.zero())
		return new Amount({ value: v1 * BigInt(factor.value), scale })
	}

	public equals(other: Amount): boolean {
		if (this.value === other.value) return this.scale === other.scale

		const { v1, v2 } = Amount.normalize(this, other)
		return v1 === v2
	}

	public isZero(): boolean {
		return this.value === 0n
	}

	public percentage(percent: number): Amount {
		if (percent < 0 || percent > 100) throw new Error('Percentage must be between 0 and 100')

		const percentageValue = (this.value * BigInt(percent)) / 100n
		return new Amount({ value: percentageValue, scale: this.scale })
	}

	private constructor(properties: AmountProperties) {
		super(properties)
	}

	private static normalize(a: Amount, b: Amount): { v1: bigint; v2: bigint; scale: number } {
		const commonScale = Math.max(a.scale, b.scale)

		const v1 = a.value * 10n ** BigInt(commonScale - a.scale)
		const v2 = b.value * 10n ** BigInt(commonScale - b.scale)

		return { v1, v2, scale: commonScale }
	}

	public static zero(): Amount {
		return new Amount({ value: 0n, scale: 0 })
	}

	public static create(properties: AmountProperties): Either<Violation, Amount> {
		if (properties.value < Amount.MINIMUM_NUMBER || properties.scale < Amount.MINIMUM_NUMBER) {
			return left(new InvalidFormatViolation())
		}

		return right(new Amount({ value: properties.value, scale: properties.scale }))
	}
}
