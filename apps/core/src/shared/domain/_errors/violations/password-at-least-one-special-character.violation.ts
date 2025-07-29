import { Violation } from '@/shared/seedwork/violation'
import { ViolationCode } from '@/shared/seedwork/violation-code'

export class PasswordAtLeastOneSpecialCharacterViolation extends Violation {
	constructor() {
		super(
			ViolationCode.PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER,
			'A senha deve conter pelo menos um caractere especial',
		)
	}
}
