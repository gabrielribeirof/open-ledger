import { IS_DECIMAL, IS_UUID } from 'class-validator'

import { InvalidDecimalViolation } from '../domain/_errors/violations/invalid-decimal.violation'
import { InvalidFormatViolation } from '../domain/_errors/violations/invalid-format.violation'
import { InvalidUUIDViolation } from '../domain/_errors/violations/invalid-uuid.violation'
import { Violation } from '../seedwork/violation'

export function fromValidationErrorToViolationUtil(error: string): Violation {
	switch (error) {
		case IS_DECIMAL:
			return new InvalidDecimalViolation()
		case IS_UUID:
			return new InvalidUUIDViolation()
		default:
			return new InvalidFormatViolation()
	}
}
