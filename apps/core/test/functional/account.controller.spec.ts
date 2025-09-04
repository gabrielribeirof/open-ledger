import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { accountMock } from '@test/helpers/account.helpers'
import { assetMock } from '@test/helpers/asset.helpers'
import * as request from 'supertest'
import { EntityManager } from 'typeorm'

import { AppModule } from '@/app.module'
import type { AccountDTO } from '@/infrastructure/http/dtos/entities/account.dto'
import { AccountEntity } from '@/infrastructure/typeorm/entities/account.entity'
import { AssetEntity } from '@/infrastructure/typeorm/entities/asset.entity'
import { ErrorCode } from '@/shared/seedwork/error-code'
import { ViolationCode } from '@/shared/seedwork/violation-code'

describe('AccountController', () => {
	let app: INestApplication
	let entityManager: EntityManager

	beforeAll(async () => {
		const testingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = testingModule.createNestApplication()
		entityManager = testingModule.get<EntityManager>(EntityManager)

		await app.init()
	})

	afterAll(async () => {
		await app.close()
	})

	afterEach(async () => {
		await entityManager.deleteAll(AccountEntity)
		await entityManager.deleteAll(AssetEntity)
	})

	test('POST /accounts', async () => {
		await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		const { statusCode, body } = await request(app.getHttpServer()).post('/accounts').send({
			asset_code: assetMock.code,
			alias: accountMock.alias,
		})

		expect(statusCode).toBe(201)
		expect(body).toEqual({
			id: expect.any(String),
			asset_code: assetMock.code,
			alias: accountMock.alias,
			version: expect.any(Number),
		})
	})

	test('POST /accounts with invalid parameters', async () => {
		await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		const { statusCode, body } = await request(app.getHttpServer()).post('/accounts').send({
			asset_code: assetMock.code,
			alias: '',
		})

		expect(statusCode).toBe(400)
		expect(body).toMatchObject({
			code: ErrorCode.INVALID_PARAMETERS,
			violations: expect.objectContaining({
				alias: [
					{
						code: ViolationCode.BAD_LENGTH,
						message: expect.any(String),
					},
				],
			}),
		})
	})

	test('POST /accounts with not found asset', async () => {
		const { statusCode, body } = await request(app.getHttpServer()).post('/accounts').send({
			asset_code: 'not-found',
			alias: accountMock.alias,
		})

		expect(statusCode).toBe(404)
		expect(body).toMatchObject({ code: ErrorCode.ASSET_NOT_FOUND })
	})

	test('POST /accounts already existing', async () => {
		await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		await request(app.getHttpServer()).post('/accounts').send({
			asset_code: assetMock.code,
			alias: accountMock.alias,
		})

		const { statusCode, body } = await request(app.getHttpServer()).post('/accounts').send({
			asset_code: assetMock.code,
			alias: accountMock.alias,
		})

		expect(statusCode).toBe(409)
		expect(body).toEqual({ code: ErrorCode.ALREADY_EXISTS })
	})

	test('GET /accounts/:alias', async () => {
		await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		const { body: creationBody } = await request(app.getHttpServer()).post('/accounts').send({
			asset_code: assetMock.code,
			alias: accountMock.alias,
		})

		const response = creationBody as AccountDTO

		const { body, statusCode } = await request(app.getHttpServer()).get(`/accounts/${response.alias}`)

		expect(statusCode).toBe(200)
		expect(body).toEqual({
			id: expect.any(String),
			asset_code: response.asset_code,
			alias: response.alias,
			version: expect.any(Number),
		})
	})

	test('GET /accounts/:alias not found', async () => {
		const { body, statusCode } = await request(app.getHttpServer()).get('/accounts/not-found')

		expect(statusCode).toBe(404)
		expect(body).toEqual({ code: ErrorCode.ACCOUNT_NOT_FOUND })
	})
})
