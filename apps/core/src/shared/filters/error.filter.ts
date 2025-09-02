import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

import { Error } from '../seedwork/error'
import { ErrorCode } from '../seedwork/error-code'

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
	private readonly logger = new Logger(ErrorFilter.name)

	public catch(error: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const request = ctx.getRequest<Request>()
		const response = ctx.getResponse<Response>()

		function getErrorCodesToHttpStatus(code: ErrorCode): HttpStatus {
			switch (code) {
				case ErrorCode.INVALID_PARAMETERS:
				case ErrorCode.INSUFFICIENT_FUNDS:
				case ErrorCode.INVALID_AMOUNT:
					return HttpStatus.BAD_REQUEST
				case ErrorCode.ALREADY_EXISTS:
					return HttpStatus.CONFLICT
				case ErrorCode.NOT_FOUND:
				case ErrorCode.ACCOUNT_NOT_FOUND:
				case ErrorCode.ASSET_NOT_FOUND:
					return HttpStatus.NOT_FOUND
				case ErrorCode.TRANSACTION_AMBIGUOUS_ACCOUNT:
				case ErrorCode.TRANSACTION_MUST_HAVE_AT_LEAST_ONE_DEBIT_AND_CREDIT_OPERATION:
				case ErrorCode.TRANSACTION_OPERATIONS_TOTAL_AMOUNT_BALANCE:
				case ErrorCode.TRANSACTION_OPERATIONS_TOTAL_AMOUNT_MISMATCH:
					return HttpStatus.UNPROCESSABLE_ENTITY
				case ErrorCode.INTERNAL_SERVER_ERROR:
					return HttpStatus.INTERNAL_SERVER_ERROR
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
		})

		response.status(getErrorCodesToHttpStatus(error.code)).json(error)
	}
}
