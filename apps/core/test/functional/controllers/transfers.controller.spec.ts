import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountMapper } from '@/infrastructure/http/mappers/account.mapper';
import { createFakeUser } from '@test/helpers/user.helpers';
import { createFakeAccount } from '@test/helpers/account.helpers';
import { UserMapper } from '@/infrastructure/http/mappers/user-mapper';
import { AccountEntity } from '@/infrastructure/mikro-orm/entities/account.entity';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';
import { TransferEntity } from '@/infrastructure/mikro-orm/entities/transfer.entity';
import { AccountType } from '@/domain/account/account-type';
import * as nock from 'nock';
import { ENVIRONMENT_VARIABLES } from '@/environment-variables-schema';
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
			ENVIRONMENT_VARIABLES.TRANSFER_AUTHORIZER_SERVICE_URL,
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
		const accountQb = entityManager.createQueryBuilder(AccountEntity);
		const userQb = entityManager.createQueryBuilder(UserEntity);
		await transferQb.delete();
		await accountQb.delete();
		await userQb.delete();
	});

	test('POST /transfers', async () => {
		const originUser = createFakeUser();
		const targetUser = createFakeUser();

		const originAccount = createFakeAccount({ userId: originUser.id.value });
		const targetAccount = createFakeAccount({
			userId: targetUser.id.value,
			type: AccountType.MERCHANT,
		});

		await entityManager.insertMany([
			UserMapper.toPersistence(originUser),
			UserMapper.toPersistence(targetUser),
		]);
		await entityManager.insertMany([
			AccountMapper.toPersistence(
				originAccount,
				entityManager.getReference(UserEntity, originUser.id.value),
			),
			AccountMapper.toPersistence(
				targetAccount,
				entityManager.getReference(UserEntity, targetUser.id.value),
			),
		]);

		const { statusCode, body } = await request(app.getHttpServer())
			.post('/transfers')
			.send({
				amount: 100,
				origin_id: originAccount.id.value,
				target_id: targetAccount.id.value,
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
