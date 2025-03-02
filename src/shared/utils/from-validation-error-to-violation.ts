import { Violation } from '../seedwork/violation';
import { InvalidFormatViolation } from '../domain/errors/violations/invalid-format.violation';

import { IS_DECIMAL, IS_UUID } from 'class-validator';
import { InvalidDecimalViolation } from '../domain/errors/violations/invalid-decimal.violation';
import { InvalidUUIDViolation } from '../domain/errors/violations/invalid-uuid.violation';

export function fromValidationErrorToViolation(error: string): Violation {
	switch (error) {
		case IS_DECIMAL:
			return new InvalidDecimalViolation();
		case IS_UUID:
			return new InvalidUUIDViolation();
		default:
			return new InvalidFormatViolation();
	}
}
