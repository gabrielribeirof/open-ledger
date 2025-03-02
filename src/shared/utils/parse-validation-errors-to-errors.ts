import { ValidationError } from '@nestjs/common';
import { InvalidParametersError } from '../domain/errors/invalid-parameters.error';
import { fromValidationErrorToViolation } from './from-validation-error-to-violation';
import { Violation } from '../seedwork/violation';

export function parseValidationErrorsToErrors(
	validationErrors: ValidationError[],
) {
	const validationErrorsGroupedByProperty = validationErrors.reduce<
		Record<string, ValidationError[]>
	>((previousValue, error) => {
		if (!previousValue[error.property]) {
			previousValue[error.property] = [];
		}

		previousValue[error.property].push(error);

		return previousValue;
	}, {});

	const violationsGroupedByProperty = Object.entries(
		validationErrorsGroupedByProperty,
	).reduce<Record<string, Violation[]>>(
		(previousValue, [currentPropery, currentErrors]) => {
			if (!previousValue[currentPropery]) {
				previousValue[currentPropery] = [];
			}

			const constraints = currentErrors
				.filter((error) => !!error.constraints)
				.map((error) => error.constraints!);

			const violations = Object.keys(constraints).map((error) =>
				fromValidationErrorToViolation(error),
			);

			previousValue[currentPropery].push(...violations);

			return previousValue;
		},
		{},
	);

	return new InvalidParametersError(violationsGroupedByProperty);
}
