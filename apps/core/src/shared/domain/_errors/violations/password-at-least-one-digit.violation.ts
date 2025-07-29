import { Violation } from '@/shared/seedwork/violation'
import { ViolationCode } from '@/shared/seedwork/violation-code'

export class PasswordAtLeastOneDigitViolation extends Violation {
	constructor() {
		super(
			ViolationCode.PASSWORD_AT_LEAST_ONE_DIGIT,
			'A senha deve conter pelo menos um dígito',
		)
	}
}
