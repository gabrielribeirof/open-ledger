import { faker } from '@faker-js/faker/.'
import { generateFakeAccount } from '@test/helpers/account.helpers'
import { generateFakeAmount } from '@test/helpers/amount.helpers'
import { generateFakeAsset } from '@test/helpers/asset.helpers'

import { CreateTransactionDomainService } from '@/domain/services/create-transaction.domain-service'
import { AmountDistribution } from '@/domain/services/inputs/children/amount-distribution'
import { RemainingDistribution } from '@/domain/services/inputs/children/remaining-distribution'
import { ShareDistribution } from '@/domain/services/inputs/children/share-distribution'
import { CreateTransactionDomainServiceInput } from '@/domain/services/inputs/create-transaction.domain-service.input'
import { Transaction } from '@/domain/transaction/transaction'
import { TransactionAccountAssetMismatchError } from '@/shared/domain/_errors/transaction-account-asset-mismatch.error'
import { Error } from '@/shared/seedwork/error'

function executeSut(properties: Partial<Parameters<CreateTransactionDomainService['execute']>[0]> = {}) {
	const amount = properties.amount ?? generateFakeAmount().getRight()
	const asset = properties.asset ?? generateFakeAsset()

	return new CreateTransactionDomainService().execute(
		new CreateTransactionDomainServiceInput(
			amount,
			asset,
			properties.sources ?? [
				new AmountDistribution(generateFakeAccount({ amount: amount, assetCode: asset.code }), amount),
			],
			properties.targets ?? [
				new AmountDistribution(generateFakeAccount({ amount: amount, assetCode: asset.code }), amount),
			],
		),
	)
}

describe('CreateTransactionDomainService', () => {
	it('should create a transaction with amount distributions', async () => {
		const amount = generateFakeAmount().getRight()

		const sut = await executeSut({ amount })

		expect(sut).toBeInstanceOf(Transaction)
		expect(sut.operations).toHaveLength(2)
		expect(sut.amount.equals(amount)).toBeTruthy()
	})

	it('should create a transaction with shared distributions', async () => {
		const amount = generateFakeAmount({ value: faker.number.bigInt({ min: 2 }) }).getRight()
		const asset = generateFakeAsset()

		const percentageOfAmount = faker.number.int({ min: 1, max: 99 })

		const sut = await executeSut({
			amount,
			asset,
			sources: [
				new RemainingDistribution(generateFakeAccount({ amount, assetCode: asset.code })),
				new ShareDistribution(generateFakeAccount({ amount, assetCode: asset.code }), percentageOfAmount),
			],
			targets: [
				new RemainingDistribution(generateFakeAccount({ amount, assetCode: asset.code })),
				new ShareDistribution(generateFakeAccount({ amount, assetCode: asset.code }), percentageOfAmount),
			],
		})

		expect(sut).toBeInstanceOf(Transaction)
		expect(sut.operations).toHaveLength(4)
		expect(sut.amount.equals(amount)).toBeTruthy()
	})

	it('should create a transaction with remaining distributions', async () => {
		const amount = generateFakeAmount({ value: faker.number.bigInt({ min: 2 }) }).getRight()
		const asset = generateFakeAsset()

		const subtractionAmount = generateFakeAmount({
			value: faker.number.bigInt({ min: 1, max: amount.value - 1n }),
			scale: amount.scale,
		}).getRight()
		const sut = await executeSut({
			amount,
			asset,
			sources: [
				new AmountDistribution(
					generateFakeAccount({ amount, assetCode: asset.code }),
					amount.subtract(subtractionAmount),
				),
				new RemainingDistribution(generateFakeAccount({ amount, assetCode: asset.code })),
			],
			targets: [
				new AmountDistribution(
					generateFakeAccount({ amount, assetCode: asset.code }),
					amount.subtract(subtractionAmount),
				),
				new RemainingDistribution(generateFakeAccount({ amount, assetCode: asset.code })),
			],
		})

		expect(sut).toBeInstanceOf(Transaction)
		expect(sut.operations).toHaveLength(4)
		expect(sut.amount.equals(amount)).toBeTruthy()
	})

	it('should fail with invalid source', async () => {
		await expect(
			executeSut({
				sources: [new AmountDistribution(generateFakeAccount(), generateFakeAmount({ value: 0n }).getRight())],
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should fail with invalid target', async () => {
		await expect(
			executeSut({
				targets: [new AmountDistribution(generateFakeAccount(), generateFakeAmount({ value: 0n }).getRight())],
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should fail with invalid transaction data', async () => {
		await expect(executeSut({ targets: [] })).rejects.toBeInstanceOf(Error)
	})

	it('should fail with source account asset mismatch', async () => {
		await expect(
			executeSut({
				sources: [
					new AmountDistribution(
						generateFakeAccount({ assetCode: generateFakeAsset().code }),
						generateFakeAmount().getRight(),
					),
				],
			}),
		).rejects.toBeInstanceOf(TransactionAccountAssetMismatchError)
	})

	it('should fail with target account asset mismatch', async () => {
		await expect(
			executeSut({
				targets: [
					new AmountDistribution(
						generateFakeAccount({ assetCode: generateFakeAsset().code }),
						generateFakeAmount().getRight(),
					),
				],
			}),
		).rejects.toBeInstanceOf(TransactionAccountAssetMismatchError)
	})
})
