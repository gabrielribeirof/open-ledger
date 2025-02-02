import { ValidationError } from '@nestjs/common';
import { InvalidParametersError } from '../errors/invalid-parameters.error';
import { fromValidationErrorToViolation } from './from-validation-error-to-violation';

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
	).reduce((previousValue, [currentPropery, currentErrors]) => {
		const currentErrorsInstance = currentErrors[0];

		if (!previousValue[currentPropery]) {
			previousValue[currentPropery] = [];
		}

		previousValue[currentPropery] = Object.keys(
			currentErrorsInstance.constraints,
		)
			.map((error) => fromValidationErrorToViolation(error))
			.concat(previousValue[currentPropery]);

		return previousValue;
	}, {});

	return new InvalidParametersError(violationsGroupedByProperty);
}
