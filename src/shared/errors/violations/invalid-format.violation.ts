import { Violation } from '@/shared/seedwork/violation';
import { ViolationCode } from '@/shared/seedwork/violation-code';

export class InvalidFormatViolation extends Violation {
	constructor() {
		super(ViolationCode.INVALID_FORMAT, 'Formato inválido');
	}
}
