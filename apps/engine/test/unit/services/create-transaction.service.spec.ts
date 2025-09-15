import { generateFakeAccount } from '@test/helpers/account.helpers'
import { generateFakeAmount } from '@test/helpers/amount.helpers'
import { generateFakeAsset } from '@test/helpers/asset.helpers'
import { generateFakeUnitOfWork } from '@test/helpers/unit-of-work.helpers'

import { CreateTransactionDomainService } from '@/domain/services/create-transaction.domain-service'
import { Transaction } from '@/domain/transaction/transaction'
import { InMemoryAssetRepository } from '@/infrastructure/repositories/in-memory/in-memory-asset.repository'
import { CreateTransactionService } from '@/services/create-transaction.service'
import { AccountNotFoundError } from '@/shared/domain/_errors/account-not-found.error'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'
import { InsufficientFundsError } from '@/shared/domain/_errors/insufficient-funds.error'
import { InvalidAmountError } from '@/shared/domain/_errors/invalid-amount.error'
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error'

function createArtifacts() {
	const unitOfWork = generateFakeUnitOfWork()
	const assetRepository = new InMemoryAssetRepository()
	const domainService = new CreateTransactionDomainService()

	return {
		sut: new CreateTransactionService(unitOfWork, assetRepository, domainService),
		assetRepository,
		accountRepository: unitOfWork.accountRepository,
		transactionRepository: unitOfWork.transactionRepository,
		unitOfWork,
	}
}

describe('CreateTransactionService', () => {
	it('should create a transaction with valid data', () => {
		const { sut, assetRepository, accountRepository } = createArtifacts()

		const asset = generateFakeAsset()

		const AMOUNT_VALUE = 100n

		const amount = generateFakeAmount({ value: AMOUNT_VALUE, scale: 0 }).getRight()
		const halfAmount = generateFakeAmount({ value: AMOUNT_VALUE / 2n, scale: 0 }).getRight()

		const sourceAccount1 = generateFakeAccount({ amount: amount, assetCode: asset.code })
		const sourceAccount2 = generateFakeAccount({ amount: halfAmount, assetCode: asset.code })
		const targetAccount1 = generateFakeAccount({ amount: amount, assetCode: asset.code })
		const targetAccount2 = generateFakeAccount({ amount: halfAmount, assetCode: asset.code })

		assetRepository.save(asset)
		accountRepository.save(sourceAccount1)
		accountRepository.save(sourceAccount2)
		accountRepository.save(targetAccount1)
		accountRepository.save(targetAccount2)

		const result = sut.execute({
			value: amount.value,
			scale: amount.scale,
			asset_code: asset.code.value,
			sources: [
				{
					account_alias: sourceAccount1.alias.value,
					remaining: true,
				},
				{
					account_alias: sourceAccount2.alias.value,
					amount: halfAmount,
				},
			],
			targets: [
				{
					account_alias: targetAccount1.alias.value,
					remaining: true,
				},
				{
					account_alias: targetAccount2.alias.value,
					share: 50,
				},
			],
		})

		expect(result).resolves.toBeInstanceOf(Transaction)
	})

	it('should fail with invalid amount', () => {
		const { sut } = createArtifacts()

		const result = sut.execute({
			value: -1n,
			scale: -1,
			asset_code: '',
			sources: [],
			targets: [],
		})

		expect(result).rejects.toBeInstanceOf(InvalidParametersError)
		expect(result).rejects.toHaveProperty('violations.amount')
	})

	it('should fail with nonexistent asset', () => {
		const { sut } = createArtifacts()

		const asset = generateFakeAsset()
		const amount = generateFakeAmount().getRight()

		const result = sut.execute({
			value: amount.value,
			scale: amount.scale,
			asset_code: asset.code.value,
			sources: [],
			targets: [],
		})

		expect(result).rejects.toBeInstanceOf(AssetNotFoundError)
	})

	it('should fail with nonexistent distribution account', () => {
		const { sut, assetRepository } = createArtifacts()

		const asset = generateFakeAsset()
		const amount = generateFakeAmount().getRight()
		const sourceAccount = generateFakeAccount({ amount: amount, assetCode: asset.code })
		const targetAccount = generateFakeAccount({ amount: amount, assetCode: asset.code })

		assetRepository.save(asset)

		const result = sut.execute({
			value: amount.value,
			scale: amount.scale,
			asset_code: asset.code.value,
			sources: [
				{
					account_alias: sourceAccount.alias.value,
					amount: amount,
				},
			],
			targets: [
				{
					account_alias: targetAccount.alias.value,
					amount: amount,
				},
			],
		})

		expect(result).rejects.toBeInstanceOf(AccountNotFoundError)
	})

	it('should fail with invalid distribution amount', () => {
		const { sut, assetRepository, accountRepository } = createArtifacts()

		const asset = generateFakeAsset()
		const amount = generateFakeAmount().getRight()
		const sourceAccount = generateFakeAccount({ amount: amount, assetCode: asset.code })
		const targetAccount = generateFakeAccount({ amount: amount, assetCode: asset.code })

		assetRepository.save(asset)
		accountRepository.save(sourceAccount)
		accountRepository.save(targetAccount)

		const result = sut.execute({
			value: amount.value,
			scale: amount.scale,
			asset_code: asset.code.value,
			sources: [
				{
					account_alias: sourceAccount.alias.value,
					amount: {
						value: -1n,
						scale: -1,
					},
				},
			],
			targets: [
				{
					account_alias: targetAccount.alias.value,
					amount: amount,
				},
			],
		})

		expect(result).rejects.toBeInstanceOf(InvalidAmountError)
	})

	it('should rollback unit of work on failure', async () => {
		const { sut, assetRepository, accountRepository, unitOfWork } = createArtifacts()

		const asset = generateFakeAsset()
		const amount = generateFakeAmount().getRight()
		const sourceAccount = generateFakeAccount({
			amount: generateFakeAmount({ value: 0n }).getRight(),
			assetCode: asset.code,
		})
		const targetAccount = generateFakeAccount({
			amount: generateFakeAmount({ value: 0n }).getRight(),
			assetCode: asset.code,
		})

		assetRepository.save(asset)
		accountRepository.save(sourceAccount)
		accountRepository.save(targetAccount)

		const result = sut.execute({
			value: amount.value,
			scale: amount.scale,
			asset_code: asset.code.value,
			sources: [
				{
					account_alias: sourceAccount.alias.value,
					amount: amount,
				},
			],
			targets: [
				{
					account_alias: targetAccount.alias.value,
					amount: amount,
				},
			],
		})

		await expect(result).rejects.toBeInstanceOf(InsufficientFundsError)
		expect(unitOfWork.rollback).toHaveBeenCalledTimes(1)
	})
})
