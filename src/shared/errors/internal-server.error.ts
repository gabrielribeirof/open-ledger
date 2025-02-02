import { Error } from '../seedwork/error';
import { ErrorCode } from '../seedwork/error-code';

export class InternalServerError extends Error {
	constructor() {
		super(ErrorCode.INTERNAL_SERVER_ERROR);
	}
}
