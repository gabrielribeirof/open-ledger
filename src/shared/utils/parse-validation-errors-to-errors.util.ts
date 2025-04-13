import { ValidationError } from '@nestjs/common';
import { InvalidParametersError } from '../domain/_errors/invalid-parameters.error';
import { fromValidationErrorToViolationUtil } from './from-validation-error-to-violation.util';
import { Violation } from '../seedwork/violation';

export function parseValidationErrorsToErrorsUtil(
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
		(previousValue, [currentProperty, currentErrors]) => {
			const constraints = currentErrors
				.filter((error) => !!error.constraints)
				.map((error) => error.constraints);

			const violations = Object.keys(constraints).map((error) =>
				fromValidationErrorToViolationUtil(error),
			);

			if (violations.length !== 0) {
				if (!previousValue[currentProperty]) {
					previousValue[currentProperty] = [];
				}

				previousValue[currentProperty].push(...violations);
			}

			return previousValue;
		},
		{},
	);

	return new InvalidParametersError(violationsGroupedByProperty);
}
