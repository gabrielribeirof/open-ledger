import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Error } from '../seedwork/error';
import { ErrorCode } from '../seedwork/error-code';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
	private readonly logger = new Logger(ErrorFilter.name);

	public catch(error: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		function getErrorCodesToHttpStatus(code: ErrorCode) {
			switch (code) {
				case ErrorCode.INVALID_PARAMETERS:
				case ErrorCode.INSUFFICIENT_FUNDS:
				case ErrorCode.UNAUTHORIZED_TRANSFER:
					return HttpStatus.BAD_REQUEST;
				case ErrorCode.WALLET_NOT_FOUND:
					return HttpStatus.NOT_FOUND;
				case ErrorCode.TRANSFER_AUTHORIZER_PROVIDER_ERROR:
				case ErrorCode.INSUFFICIENT_WALLET_TYPE_PERMISSIONS:
					return HttpStatus.FORBIDDEN;
				case ErrorCode.TRANSFER_AMOUNT_MUST_BE_GREATER_THAN_ZERO:
					return HttpStatus.UNPROCESSABLE_ENTITY;
				case ErrorCode.PROVIDER_NOT_FOUND:
				case ErrorCode.INTERNAL_SERVER_ERROR:
				default:
					return HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}

		this.logger.error('Error response sent', {
			url: request.path,
			method: request.method,
			status: getErrorCodesToHttpStatus(error.code),
			body: request.body,
			headers: request.headers,
			query: request.params,
			error,
		});

		response.status(getErrorCodesToHttpStatus(error.code)).json(error);
	}
}
