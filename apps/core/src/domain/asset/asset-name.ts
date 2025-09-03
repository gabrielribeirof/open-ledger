import { BadLengthViolation } from '@/shared/domain/_errors/violations/bad-length.violation'
import type { Either } from '@/shared/lib/either'
import { left, right } from '@/shared/lib/either'
import { ValueObject } from '@/shared/seedwork/value-object'
import type { Violation } from '@/shared/seedwork/violation'

interface AssetNameProperties {
	value: string
}

export class AssetName extends ValueObject<AssetNameProperties> {
	static readonly MIN_LENGTH = 3
	static readonly MAX_LENGTH = 256

	get value(): string {
		return this.properties.value
	}

	private constructor(properties: AssetNameProperties) {
		super(properties)
	}

	public static create(properties: AssetNameProperties): Either<Violation, AssetName> {
		const value = properties.value.trim()

		if (value.length < AssetName.MIN_LENGTH || value.length > AssetName.MAX_LENGTH) {
			return left(new BadLengthViolation(AssetName.MIN_LENGTH, AssetName.MAX_LENGTH))
		}

		return right(new AssetName({ value }))
	}
}
