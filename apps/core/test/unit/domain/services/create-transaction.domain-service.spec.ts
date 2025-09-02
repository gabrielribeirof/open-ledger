import { faker } from '@faker-js/faker/.'
import { generateFakeAccount } from '@test/helpers/account.helpers'
import { generateFakeAmount } from '@test/helpers/amount.helpers'
import { generateFakeAsset } from '@test/helpers/asset.helpers'
import { generateFakeUnitOfWork } from '@test/helpers/unit-of-work.helpers'

import { CreateTransactionDomainService } from '@/domain/services/create-transaction.domain-service'
import { Transaction } from '@/domain/transaction/transaction'
import { Error } from '@/shared/seedwork/error'
import { ErrorCode } from '@/shared/seedwork/error-code'
import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work'

function executeSut(
	properties: Partial<Parameters<CreateTransactionDomainService['execute']>[0]> = {},
	unitOfWork: IUnitOfWork = generateFakeUnitOfWork(),
) {
	const amount = properties.amount ?? generateFakeAmount().getRight()
	const asset = properties.asset ?? generateFakeAsset()

	return new CreateTransactionDomainService(unitOfWork).execute({
		amount,
		asset,
		sources: properties.sources ?? [
			{
				account: generateFakeAccount({ amount: amount }),
				amount: amount,
			},
		],
		targets: properties.targets ?? [
			{
				account: generateFakeAccount({ amount: amount }),
				amount: amount,
			},
		],
	})
}

describe('CreateTransactionDomainService', () => {
	it('should create a transaction when valid inputs', async () => {
		const amount = generateFakeAmount().getRight()

		const sut = await executeSut({ amount })

		expect(sut).toBeInstanceOf(Transaction)
		expect(sut.operations).toHaveLength(2)
		expect(sut.amount.equals(amount)).toBeTruthy()
	})

	it('should create a transaction with shared', async () => {
		const amount = generateFakeAmount({ value: faker.number.bigInt({ min: 2 }) }).getRight()
		const asset = generateFakeAsset()

		const percentageOfAmount = faker.number.int({ min: 1, max: 99 })

		const sut = await executeSut({
			amount,
			asset,
			sources: [
				{
					account: generateFakeAccount({ amount }),
					remaining: true,
				},
				{
					account: generateFakeAccount({ amount }),
					share: percentageOfAmount,
				},
			],
			targets: [
				{
					account: generateFakeAccount({ amount }),
					remaining: true,
				},
				{
					account: generateFakeAccount({ amount }),
					share: percentageOfAmount,
				},
			],
		})

		expect(sut).toBeInstanceOf(Transaction)
		expect(sut.operations).toHaveLength(4)
		expect(sut.amount.equals(amount)).toBeTruthy()
	})

	it('should create a transaction with remaining', async () => {
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
				{
					account: generateFakeAccount({ amount }),
					amount: amount.subtract(subtractionAmount),
				},
				{
					account: generateFakeAccount({ amount }),
					remaining: true,
				},
			],
			targets: [
				{
					account: generateFakeAccount({ amount }),
					amount: amount.subtract(subtractionAmount),
				},
				{
					account: generateFakeAccount({ amount }),
					remaining: true,
				},
			],
		})

		expect(sut).toBeInstanceOf(Transaction)
		expect(sut.operations).toHaveLength(4)
		expect(sut.amount.equals(amount)).toBeTruthy()
	})

	it('should not create a transaction with invalid source', async () => {
		await expect(
			executeSut({
				sources: [
					{
						account: generateFakeAccount(),
						amount: generateFakeAmount({ value: 0n }).getRight(),
					},
				],
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should not create a transaction with invalid target', async () => {
		await expect(
			executeSut({
				targets: [
					{
						account: generateFakeAccount(),
						amount: generateFakeAmount({ value: 0n }).getRight(),
					},
				],
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should not create a transaction with invalid transaction data', async () => {
		await expect(executeSut({ targets: [] })).rejects.toBeInstanceOf(Error)
	})

	it('should not create a transaction when unit of work error', async () => {
		const errorToThrow = new Error(ErrorCode.INTERNAL_SERVER_ERROR)
		const unitOfWork = generateFakeUnitOfWork({
			commit: jest.fn().mockRejectedValueOnce(errorToThrow),
		})

		await expect(executeSut({}, unitOfWork)).rejects.toEqual(errorToThrow)
		expect(unitOfWork.rollback).toHaveBeenCalledTimes(1)
	})
})
