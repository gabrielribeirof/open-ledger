import { IS_DECIMAL, IS_UUID } from 'class-validator';
import { fromValidationErrorToViolationUtil } from '@/shared/utils/from-validation-error-to-violation.util';
import { InvalidDecimalViolation } from '@/shared/domain/_errors/violations/invalid-decimal.violation';
import { InvalidUUIDViolation } from '@/shared/domain/_errors/violations/invalid-uuid.violation';
import { InvalidFormatViolation } from '@/shared/domain/_errors/violations/invalid-format.violation';

describe('fromValidationErrorToViolationUtil', () => {
	it('should return InvalidDecimalViolation when IS_DECIMAL error is provided', () => {
		const violation = fromValidationErrorToViolationUtil(IS_DECIMAL);

		expect(violation).toBeInstanceOf(InvalidDecimalViolation);
	});

	it('should return InvalidUUIDViolation when IS_UUID error is provided', () => {
		const violation = fromValidationErrorToViolationUtil(IS_UUID);

		expect(violation).toBeInstanceOf(InvalidUUIDViolation);
	});

	it('should return InvalidFormatViolation when any other error is provided', () => {
		const violation = fromValidationErrorToViolationUtil('UNKNOWN_ERROR');

		expect(violation).toBeInstanceOf(InvalidFormatViolation);
	});
});
