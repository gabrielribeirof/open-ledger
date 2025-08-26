import { Inject, Injectable } from '@nestjs/common'

import { Amount } from '@/shared/domain/amount'
import { IUnitOfWork, UNIT_OF_WORK } from '@/shared/seedwork/iunit-of-work'

import { Account } from '../account/account'
import { Asset } from '../asset/asset'
import { Operation } from '../transaction/operation'
import { OperationType } from '../transaction/operation-type'
import { Transaction } from '../transaction/transaction'

interface AmountDistributionStrategy {
	amount: Amount
}

interface ShareDistributionStrategy {
	share: number
}

interface RemainingDistributionStrategy {
	remaining: true
}

type DistributionStrategy = AmountDistributionStrategy | ShareDistributionStrategy | RemainingDistributionStrategy

export type Distribution = DistributionStrategy & {
	account: Account
}

export interface CreateTransactionDomainServiceInput {
	amount: Amount
	asset: Asset
	sources: Distribution[]
	targets: Distribution[]
}

@Injectable()
export class CreateTransactionDomainService {
	constructor(@Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork) {}

	public async execute(input: CreateTransactionDomainServiceInput): Promise<Transaction> {
		const sourceAmountPerAccount = this.calculateAmountPerAccountInADistribution(input.sources, input.amount)
		const targetAmountPerAccount = this.calculateAmountPerAccountInADistribution(input.targets, input.amount)

		const operations = sourceAmountPerAccount
			.map((distribution) => {
				const operation = Operation.create({
					account_id: distribution.account.id,
					amount: distribution.amount,
					type: OperationType.DEBIT,
				})

				if (operation.isLeft()) throw operation.value

				return operation.value
			})
			.concat(
				targetAmountPerAccount.map((distribution) => {
					const operation = Operation.create({
						account_id: distribution.account.id,
						amount: distribution.amount,
						type: OperationType.CREDIT,
					})

					if (operation.isLeft()) throw operation.value

					return operation.value
				}),
			)

		const transaction = Transaction.create({
			asset_id: input.asset.id,
			amount: input.amount,
			operations,
		})

		if (transaction.isLeft()) throw transaction.value

		this.unitOfWork.begin()

		try {
			for (const operation of transaction.value.operations) {
				if (operation.isDebit()) {
					const accountAmount = sourceAmountPerAccount.find((source) => source.account.id.equals(operation.account_id))

					if (!accountAmount) throw new Error(`Amount not calculated for source account ${operation.account_id}`)

					accountAmount.account.withdraw(accountAmount.amount)
					await this.unitOfWork.accountRepository.save(accountAmount.account)
				}

				if (operation.isCredit()) {
					const accountAmount = targetAmountPerAccount.find((target) => target.account.id.equals(operation.account_id))

					if (!accountAmount) throw new Error(`Amount not calculated for target account ${operation.account_id}`)

					accountAmount.account.deposit(accountAmount.amount)
					await this.unitOfWork.accountRepository.save(accountAmount.account)
				}
			}

			await this.unitOfWork.transactionRepository.save(transaction.value)
			await this.unitOfWork.commit()
		} catch (error) {
			await this.unitOfWork.rollback(error)
			throw error
		}

		return transaction.value
	}

	private calculateAmountPerAccountInADistribution(distributions: Distribution[], totalAmount: Amount) {
		const result: Array<{ account: Account; amount: Amount }> = []

		let remaining = Amount.create({ value: totalAmount.value, scale: totalAmount.scale }).getRight()

		for (const distribution of distributions) {
			if ('share' in distribution) {
				const shareAmount = totalAmount.percentage(distribution.share)
				remaining = remaining.subtract(shareAmount)
				result.push({ account: distribution.account, amount: shareAmount })
			} else if ('amount' in distribution) {
				remaining = remaining.subtract(distribution.amount)
				result.push({ account: distribution.account, amount: distribution.amount })
			}
		}

		const remainingDistributions = distributions.filter((distribution) => 'remaining' in distribution)

		if (remainingDistributions.length > 0) {
			for (const distribution of remainingDistributions) {
				result.push({ account: distribution.account, amount: remaining })
			}
		}

		return result
	}
}
