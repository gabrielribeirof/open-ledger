import {
	type ExceptionFilter,
	type ArgumentsHost,
	Catch,
	Logger,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { InternalServerError } from '../errors/internal-server.error';

@Catch(Error)
export class NativeErrorFilter implements ExceptionFilter {
	private readonly logger = new Logger(NativeErrorFilter.name);

	public catch(error: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		this.logger.error('Error response sent', {
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
		});

		response.status(500).json(new InternalServerError());
	}
}
