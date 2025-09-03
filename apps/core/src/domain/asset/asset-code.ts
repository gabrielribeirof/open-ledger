import { BadLengthViolation } from '@/shared/domain/_errors/violations/bad-length.violation'
import type { Either } from '@/shared/lib/either'
import { left, right } from '@/shared/lib/either'
import { ValueObject } from '@/shared/seedwork/value-object'
import type { Violation } from '@/shared/seedwork/violation'

interface AssetCodeProperties {
	value: string
}

export class AssetCode extends ValueObject<AssetCodeProperties> {
	static readonly MIN_LENGTH = 3
	static readonly MAX_LENGTH = 32

	get value(): string {
		return this.properties.value
	}

	private constructor(properties: AssetCodeProperties) {
		super(properties)
	}

	public static create(properties: AssetCodeProperties): Either<Violation, AssetCode> {
		const value = properties.value.trim()

		if (value.length < AssetCode.MIN_LENGTH || value.length > AssetCode.MAX_LENGTH) {
			return left(new BadLengthViolation(AssetCode.MIN_LENGTH, AssetCode.MAX_LENGTH))
		}

		return right(new AssetCode({ value }))
	}
}
