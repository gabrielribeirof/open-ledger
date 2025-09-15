import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { assetMock } from '@test/helpers/asset.helpers'
import * as request from 'supertest'
import { EntityManager } from 'typeorm'

import { AppModule } from '@/app.module'
import type { AssetDTO } from '@/infrastructure/http/dtos/entities/asset.dto'
import { AssetEntity } from '@/infrastructure/typeorm/entities/asset.entity'
import { ErrorCode } from '@/shared/seedwork/error-code'
import { ViolationCode } from '@/shared/seedwork/violation-code'

describe('AssetController', () => {
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
		await entityManager.deleteAll(AssetEntity)
	})

	test('POST /assets', async () => {
		const { statusCode, body } = await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		expect(statusCode).toBe(201)
		expect(body).toEqual({ id: expect.any(String), name: assetMock.name, code: assetMock.code })
	})

	test('POST /assets with invalid parameters', async () => {
		const { statusCode, body } = await request(app.getHttpServer()).post('/assets').send({
			name: '',
			code: '',
		})

		expect(statusCode).toBe(400)
		expect(body).toMatchObject({
			code: ErrorCode.INVALID_PARAMETERS,
			violations: expect.objectContaining({
				name: [
					{
						code: ViolationCode.BAD_LENGTH,
						message: expect.any(String),
					},
				],
				code: [
					{
						code: ViolationCode.BAD_LENGTH,
						message: expect.any(String),
					},
				],
			}),
		})
	})

	test('POST /assets already existing', async () => {
		await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		const { statusCode, body } = await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		expect(statusCode).toBe(409)
		expect(body).toEqual({ code: ErrorCode.ALREADY_EXISTS })
	})

	test('GET /assets/:code', async () => {
		const { body: creationBody } = await request(app.getHttpServer()).post('/assets').send({
			name: assetMock.name,
			code: assetMock.code,
		})

		const response = creationBody as AssetDTO

		const { body, statusCode } = await request(app.getHttpServer()).get(`/assets/${response.code}`)

		expect(statusCode).toBe(200)
		expect(body).toEqual({ id: expect.any(String), name: assetMock.name, code: assetMock.code })
	})

	test('GET /assets/:code not found', async () => {
		const { body, statusCode } = await request(app.getHttpServer()).get('/assets/not-found')

		expect(statusCode).toBe(404)
		expect(body).toEqual({ code: ErrorCode.ASSET_NOT_FOUND })
	})
})
