import { Violation } from '@/shared/seedwork/violation'

import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

type ViolationValue = Violation[] | NestedViolations
type NestedViolations = { [key: string]: ViolationValue }

export class InvalidParametersError extends Error {
	public violations: NestedViolations

	constructor(violations: NestedViolations) {
		super(ErrorCode.INVALID_PARAMETERS)
		this.violations = violations
	}
}
