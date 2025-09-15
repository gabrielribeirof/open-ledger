import { Violation } from '@/shared/seedwork/violation'
import { ViolationCode } from '@/shared/seedwork/violation-code'

export class InvalidDecimalViolation extends Violation {
	constructor() {
		super(ViolationCode.INVALID_DECIMAL, 'Formato deve ser decimal')
	}
}
