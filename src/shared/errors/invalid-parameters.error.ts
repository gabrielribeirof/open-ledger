import { Violation } from '@/shared/seedwork/violation';
import { Error } from '../seedwork/error';
import { ErrorCode } from '../seedwork/error-code';
import { Either, Right } from '@/shared/lib/either';

type ViolationsConstructor =
	| Either<Violation, unknown>
	| Either<Violation, unknown>[]
	| Violation
	| Violation[];

function isViolations(
	violations: ViolationsConstructor,
): violations is Violation[] {
	return (
		Array.isArray(violations) &&
		violations.every((violation) => violation instanceof Violation)
	);
}

function violationsContructorToViolations(
	violations: ViolationsConstructor,
): Violation[] {
	if (!Array.isArray(violations)) {
		if (violations instanceof Violation) {
			return [violations];
		} else if (violations.isLeft()) {
			return [violations.value];
		}

		return undefined;
	}

	if (isViolations(violations)) {
		return violations;
	}

	return violations
		.filter((violation) => violation.isLeft())
		.map((violation) => violation.value);
}

export class InvalidParametersError<
	T extends Record<string, any>,
> extends Error {
	public violations: { [K in keyof T]?: Violation[] };

	constructor(violations: {
		[K in keyof T]?: ViolationsConstructor;
	}) {
		super(ErrorCode.INVALID_PARAMETERS);

		this.violations = Object.entries(violations).reduce(
			(previousValue, [key, value]) => {
				if (value instanceof Right) return previousValue;

				return {
					...previousValue,
					[key]: violationsContructorToViolations(value),
				};
			},
			{},
		);
	}
}
