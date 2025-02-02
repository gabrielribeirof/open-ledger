import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { Error } from '../seedwork/error';
import { ErrorCode } from '../seedwork/error-code';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
	public catch(exception: Error, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();

		function getErrorCodesToHttpStatus(code: ErrorCode) {
			switch (code) {
				case ErrorCode.INVALID_PARAMETERS:
				case ErrorCode.INSUFFICIENT_FUNDS:
				case ErrorCode.UNAUTHORIZED_TRANSFER:
					return HttpStatus.BAD_REQUEST;
				case ErrorCode.WALLET_NOT_FOUND:
					return HttpStatus.NOT_FOUND;
				case ErrorCode.PROVIDER_NOT_FOUND:
				case ErrorCode.INTERNAL_SERVER_ERROR:
					return HttpStatus.INTERNAL_SERVER_ERROR;
				default:
					return HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}

		response.status(getErrorCodesToHttpStatus(exception.code)).json(exception);
	}
}
