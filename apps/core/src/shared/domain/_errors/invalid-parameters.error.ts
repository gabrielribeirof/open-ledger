import { Either, Right } from '@/shared/lib/either'
import { Violation } from '@/shared/seedwork/violation'

import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

type ViolationsConstructor =
	| Either<Violation, unknown>
	| Either<Violation, unknown>[]
	| Violation
	| Violation[]

function isViolations(
	violations: ViolationsConstructor,
): violations is Violation[] {
	return (
		Array.isArray(violations) &&
		violations.every((violation) => violation instanceof Violation)
	)
}

function violationsContructorToViolations(
	violations: ViolationsConstructor,
): Violation[] {
	if (!Array.isArray(violations)) {
		if (violations instanceof Violation) {
			return [violations]
		} else if (violations.isLeft()) {
			return [violations.value]
		}

		return []
	}

	if (isViolations(violations)) {
		return violations
	}

	return violations
		.filter((violation) => violation.isLeft())
		.map((violation) => violation.value)
}

export class InvalidParametersError<
	T extends Record<string, any>,
> extends Error {
	public violations?: { [K in keyof T]?: Violation[] }

	constructor(violations: {
		[K in keyof T]?: ViolationsConstructor
	}) {
		super(ErrorCode.INVALID_PARAMETERS)

		const processedViolations = Object.entries(violations).reduce(
			(previousValue, [key, value]) => {
				if (value === undefined) return previousValue
				if (value instanceof Right) return previousValue

				const processedValue = violationsContructorToViolations(value)
				if (processedValue.length === 0) return previousValue

				return {
					...previousValue,
					[key]: processedValue,
				}
			},
			{} as { [K in keyof T]?: Violation[] },
		)

		if (Object.keys(processedViolations).length > 0) {
			this.violations = processedViolations
		}
	}
}
