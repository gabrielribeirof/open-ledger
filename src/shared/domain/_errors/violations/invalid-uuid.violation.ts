import { Violation } from '@/shared/seedwork/violation';
import { ViolationCode } from '@/shared/seedwork/violation-code';

export class InvalidUUIDViolation extends Violation {
	constructor() {
		super(ViolationCode.INVALID_UUID, 'Formato deve ser um UUID');
	}
}
