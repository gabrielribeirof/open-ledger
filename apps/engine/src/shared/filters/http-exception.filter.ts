import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { type Request, type Response } from 'express'

import { InternalServerError } from '../domain/_errors/internal-server.error'
import { NotFoundError } from '../domain/_errors/not-found.error'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpException.name)

	public catch(error: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const request = ctx.getRequest<Request>()
		const response = ctx.getResponse<Response>()
		const status = error.getStatus()

		this.logger.error('Error response sent', {
			status,
			method: request.method,
			hostname: request.hostname,
			path: request.path,
			from: request.ip,
			body: request.body,
			headers: request.headers,
			query: request.query,
			error,
			stack: error.stack,
			message: error.message,
			name: error.name,
		})

		switch (status) {
			case HttpStatus.NOT_FOUND:
				response.status(status).json(new NotFoundError())
				break
			case HttpStatus.INTERNAL_SERVER_ERROR:
			default:
				response.status(status).json(new InternalServerError())
				break
		}
	}
}
