import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { EntityManager } from 'typeorm'

import { AppModule } from '@/app.module'

describe('TransactionController', () => {
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

	// test('POST /transactions', async () => {
	// 	await request(app.getHttpServer()).post('/assets').send({
	// 		name: generateFakeAssetNameValue().value,
	// 		code: generateFakeAssetCodeValue().value,
	// 	})

	// 	// const { statusCode, body } = await request(app.getHttpServer()).post('/accounts').send({
	// 	// 	asset_code: code,
	// 	// 	alias,
	// 	// })
	// })
})
