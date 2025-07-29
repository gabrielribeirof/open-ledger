import { Either, Right } from '@/shared/lib/either'
import { Violation } from '@/shared/seedwork/violation'

import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

type ViolationsConstructor = Either<Violation, unknown> | Either<Violation, unknown>[] | Violation | Violation[]

function isViolations(violations: ViolationsConstructor): violations is Violation[] {
	return Array.isArray(violations) && violations.every((violation) => violation instanceof Violation)
}

function violationsContructorToViolations(violations: ViolationsConstructor): Violation[] {
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

	return violations.filter((violation) => violation.isLeft()).map((violation) => violation.value)
}

function processNestedViolations(value: any): any {
	if (value === undefined || value instanceof Right) {
		return undefined
	}

	// Handle direct violations
	if (value instanceof Violation || (value && typeof value.isLeft === 'function')) {
		const processedValue = violationsContructorToViolations(value)
		return processedValue.length > 0 ? processedValue : undefined
	}

	// Handle arrays or objects with nested violations
	if (typeof value === 'object' && value !== null) {
		const processed: any = {}

		for (const [key, nestedValue] of Object.entries(value)) {
			const processedNested = processNestedViolations(nestedValue)
			if (processedNested !== undefined) {
				processed[key] = processedNested
			}
		}

		return Object.keys(processed).length > 0 ? processed : undefined
	}

	return undefined
}

export class InvalidParametersError<T extends Record<string, any>> extends Error {
	public violations?: { [K in keyof T]?: any }

	constructor(violations: {
		[K in keyof T]?: ViolationsConstructor | any
	}) {
		super(ErrorCode.INVALID_PARAMETERS)

		const processedViolations = Object.entries(violations).reduce(
			(previousValue, [key, value]) => {
				const processedValue = processNestedViolations(value)
				if (processedValue !== undefined) {
					return {
						...previousValue,
						[key]: processedValue,
					}
				}
				return previousValue
			},
			{} as { [K in keyof T]?: any },
		)

		if (Object.keys(processedViolations).length > 0) {
			this.violations = processedViolations
		}
	}
}
