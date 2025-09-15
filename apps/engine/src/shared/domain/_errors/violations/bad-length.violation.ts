import { Violation } from '@/shared/seedwork/violation'
import { ViolationCode } from '@/shared/seedwork/violation-code'

export class BadLengthViolation extends Violation {
	constructor(min: number, max: number) {
		super(ViolationCode.BAD_LENGTH, `Deve ter entre ${min} e ${max} caracteres`)
	}
}
