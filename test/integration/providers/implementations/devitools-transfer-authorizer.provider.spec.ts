import { AppModule } from '@/app.module';
import { ENVIROMENT_VARIABLES } from '@/enviroment-variables-schema';
import { DevitoolsTransferAuthorizerProvider } from '@/providers/transfer-authorizer/devitools/devitools-transfer-authorizer.provider';
import { DevitoolsAuthorizeResponse } from '@/providers/transfer-authorizer/devitools/schemas/devitools-authorize-response.schema';
import { TRANSFER_AUTHORIZER_PROVIDER } from '@/providers/transfer-authorizer/itransfer-authorizer.provider';
import { TransferAuthorizerProviderError } from '@/shared/domain/errors/transfer-authorizer-provider.error';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as nock from 'nock';
import { HttpStatusCode } from 'axios';

const successResponse: DevitoolsAuthorizeResponse = {
	status: 'success',
	data: {
		authorization: true,
	},
};

const failResponse: DevitoolsAuthorizeResponse = {
	status: 'fail',
	data: {
		authorization: false,
	},
};

describe('DevitoolsTransferAuthorizerProvider', () => {
	let testingModule: TestingModule;
	let sut: DevitoolsTransferAuthorizerProvider;
	let url: string;

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		sut = await testingModule.resolve(TRANSFER_AUTHORIZER_PROVIDER);

		const configService = testingModule.get(ConfigService);

		url = configService.getOrThrow(
			ENVIROMENT_VARIABLES.TRANSFER_AUTHORIZER_SERVICE_URL,
		);
	});

	afterEach(async () => {
		await testingModule.close();
		nock.cleanAll();
	});

	it('should return an authorization status (authorized)', async () => {
		nock(url).get('/authorize').reply(HttpStatusCode.Ok, successResponse);

		const response = await sut.execute();

		expect(response).toBe(true);
	});

	it('should return an authorization status (unauthorized)', async () => {
		nock(url).get('/authorize').reply(HttpStatusCode.Forbidden, failResponse);

		const response = await sut.execute();

		expect(response).toBe(false);
	});

	it('should return transfer authorizer provider error when some unmapped error occur', async () => {
		nock(url).get('/authorize').reply(500);

		await expect(sut.execute()).rejects.toBeInstanceOf(
			TransferAuthorizerProviderError,
		);
	});
});
