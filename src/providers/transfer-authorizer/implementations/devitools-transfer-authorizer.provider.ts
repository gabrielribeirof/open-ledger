import { catchError, firstValueFrom } from 'rxjs';
import { ITransferAuthorizerProvider } from '../itransfer-authorizer.provider';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

export interface DevitoolsAuthorizeResponse {
	status: 'success' | 'fail';
	data: {
		authorization: boolean;
	};
}

@Injectable()
export class DevitoolsTransferAuthorizerProvider
	implements ITransferAuthorizerProvider
{
	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
	) {
		this.httpService.axiosRef.defaults.baseURL = this.configService.getOrThrow(
			'TRANSFER_AUTHORIZER_SERVICE_URL',
		);
	}

	async execute(): Promise<boolean> {
		const response = await firstValueFrom(
			this.httpService.get<DevitoolsAuthorizeResponse>('/authorize').pipe(
				catchError((error) => {
					throw error;
				}),
			),
		);

		return response.data.data.authorization;
	}
}
