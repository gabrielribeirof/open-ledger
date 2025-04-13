import { catchError, lastValueFrom, map, of } from 'rxjs';
import { ITransferAuthorizerProvider } from '../itransfer-authorizer.provider';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ENVIROMENT_VARIABLES } from '@/enviroment-variables-schema';
import { TransferAuthorizerProviderError } from '@/shared/domain/_errors/transfer-authorizer-provider.error';
import {
	DevitoolsAuthorizeResponse,
	devitoolsAuthorizeResponseSchema,
} from './schemas/devitools-authorize-response.schema';
import { ForbiddenApiError } from './api-errors/forbidden.api-error';
import { HttpClient } from '@/shared/lib/http-client';

@Injectable()
export class DevitoolsTransferAuthorizerProvider
	extends HttpClient
	implements ITransferAuthorizerProvider
{
	private static logger = new Logger(DevitoolsTransferAuthorizerProvider.name);

	constructor(
		public readonly httpService: HttpService,
		public readonly configService: ConfigService,
	) {
		super(
			DevitoolsTransferAuthorizerProvider.logger,
			httpService,
			configService.getOrThrow(
				ENVIROMENT_VARIABLES.TRANSFER_AUTHORIZER_SERVICE_URL,
			),
		);
	}

	async execute(): Promise<boolean> {
		return lastValueFrom(
			this.httpService.get<DevitoolsAuthorizeResponse>('/authorize').pipe(
				map((response) => this.parseResponse(response).data.authorization),
				catchError((error: Error) => {
					if (ForbiddenApiError.canHandle(error)) {
						throw new ForbiddenApiError(error);
					}
					throw error;
				}),
				catchError((error: Error) => {
					if (error instanceof ForbiddenApiError) {
						return of(error.response().data.authorization);
					}

					throw new TransferAuthorizerProviderError();
				}),
			),
		);
	}

	private parseResponse(response: any): DevitoolsAuthorizeResponse {
		return devitoolsAuthorizeResponseSchema.parse(response.data);
	}
}
