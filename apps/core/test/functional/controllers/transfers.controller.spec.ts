import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import { WalletMapper } from '@/infrastructure/http/mappers/wallet.mapper';
import { createFakeUser } from '@test/helpers/user.helpers';
import { createFakeWallet } from '@test/helpers/wallet.helpers';
import { UserMapper } from '@/infrastructure/http/mappers/user-mapper';
import { WalletEntity } from '@/infrastructure/mikro-orm/entities/wallet.entity';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';
import { WalletType } from '@/domain/wallet/wallet-type';
import * as nock from 'nock';
import { ENVIROMENT_VARIABLES } from '@/enviroment-variables-schema';
import { ConfigService } from '@nestjs/config';
import { DevitoolsAuthorizeResponse } from '@/providers/transfer-authorizer/devitools/schemas/devitools-authorize-response.schema';

const transferAuthorizerServiceSuccessResponse: DevitoolsAuthorizeResponse = {
	status: 'success',
	data: {
		authorization: true,
	},
};

describe('TransfersController', () => {
	let app: INestApplication;
	let entityManager: EntityManager;

	let transferAuthorizerService: string;

	beforeAll(async () => {
		const testingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = testingModule.createNestApplication();
		entityManager = app.get(EntityManager).fork();

		const configService = testingModule.get(ConfigService);

		transferAuthorizerService = configService.getOrThrow(
			ENVIROMENT_VARIABLES.TRANSFER_AUTHORIZER_SERVICE_URL,
		);

		nock(transferAuthorizerService)
			.get('/authorize')
			.reply(200, transferAuthorizerServiceSuccessResponse);

		await app.init();
	});

	afterAll(async () => {
		await app.close();
		nock.cleanAll();
	});

	afterEach(async () => {
		const transferQb = entityManager.createQueryBuilder(TransferEntity);
		const walletQb = entityManager.createQueryBuilder(WalletEntity);
		const userQb = entityManager.createQueryBuilder(UserEntity);
		await transferQb.delete();
		await walletQb.delete();
		await userQb.delete();
	});

	test('POST /transfers', async () => {
		const originUser = createFakeUser();
		const targetUser = createFakeUser();

		const originWallet = createFakeWallet({ userId: originUser.id.value });
		const targetWallet = createFakeWallet({
			userId: targetUser.id.value,
			type: WalletType.MERCHANT,
		});

		await entityManager.insertMany([
			UserMapper.toPersistence(originUser),
			UserMapper.toPersistence(targetUser),
		]);
		await entityManager.insertMany([
			WalletMapper.toPersistence(
				originWallet,
				entityManager.getReference(UserEntity, originUser.id.value),
			),
			WalletMapper.toPersistence(
				targetWallet,
				entityManager.getReference(UserEntity, targetUser.id.value),
			),
		]);

		const { statusCode, body } = await request(app.getHttpServer())
			.post('/transfers')
			.send({
				amount: 100,
				origin_id: originWallet.id.value,
				target_id: targetWallet.id.value,
			});

		expect(statusCode).toBe(201);
		expect(body).toEqual({
			id: expect.any(String),
		});
	});

	test('POST /transfers with invalid parameters', async () => {
		const { statusCode, body } = await request(app.getHttpServer())
			.post('/transfers')
			.send({
				amount: 10.123,
				origin_id: 'invalid',
				target_id: 'invalid',
			});

		expect(statusCode).toBe(400);
		expect(body).toMatchObject({
			code: 'INVALID_PARAMETERS',
			violations: expect.objectContaining({
				origin_id: [
					{
						code: 'INVALID_FORMAT',
						message: expect.any(String),
					},
				],
				target_id: [
					{
						code: 'INVALID_FORMAT',
						message: expect.any(String),
					},
				],
				amount: [
					{
						code: 'INVALID_FORMAT',
						message: expect.any(String),
					},
				],
			}),
		});
	});
});
