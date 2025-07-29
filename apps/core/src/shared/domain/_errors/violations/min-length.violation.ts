import { Violation } from '@/shared/seedwork/violation'
import { ViolationCode } from '@/shared/seedwork/violation-code'

export class MinLengthViolation extends Violation {
	constructor(min: number) {
		super(ViolationCode.MIN_LENGTH, `Deve ter no mínimo ${min} caracteres.`)
	}
}
