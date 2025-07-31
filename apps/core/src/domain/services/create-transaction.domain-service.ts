import { Inject, Injectable } from '@nestjs/common'

import { Amount } from '@/shared/domain/amount'
import { IUnitOfWork, UNIT_OF_WORK } from '@/shared/seedwork/iunit-of-work'

import { Account } from '../account/account'
import { Asset } from '../asset/asset'
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

export type AccountDistribution = DistributionStrategy & {
	account: Account
}

@Injectable()
export class CreateTransactionDomainService {
	constructor(@Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork) {}

	public execute(
		amount: Amount,
		asset: Asset,
		sourceAccountsDistribution: AccountDistribution[],
		targetAccountsDistribution: AccountDistribution[],
	): Transaction {
		const sourceAccountsAmount = this.calculateAccountAmount(sourceAccountsDistribution, amount)
		const targetAccountsAmount = this.calculateAccountAmount(targetAccountsDistribution, amount)

		const transaction = Transaction.create({
			amount,
			asset_id: asset.id,
			source_distributions: sourceAccountsAmount.map((distribution) => ({
				account_id: distribution.account.id,
				amount: distribution.amount,
			})),
			target_distributions: targetAccountsAmount.map((distribution) => ({
				account_id: distribution.account.id,
				amount: distribution.amount,
			})),
		})

		if (transaction.isLeft()) throw transaction.value

		this.unitOfWork.begin()

		try {
			transaction.value.operations.forEach((operation) => {
				if (operation.isDebit()) {
					const accountAmount = sourceAccountsAmount.find((source) => source.account.id.equals(operation.account_id))

					if (!accountAmount) throw new Error(`Amount not calculated for source account ${operation.account_id}`)

					accountAmount.account.withdraw(accountAmount.amount)
					this.unitOfWork.accountRepository.save(accountAmount.account)
				}

				if (operation.isCredit()) {
					const accountAmount = targetAccountsAmount.find((target) => target.account.id.equals(operation.account_id))

					if (!accountAmount) throw new Error(`Amount not calculated for target account ${operation.account_id}`)

					accountAmount.account.deposit(accountAmount.amount)
					this.unitOfWork.accountRepository.save(accountAmount.account)
				}
			})

			this.unitOfWork.transactionRepository.save(transaction.value)
		} catch (error) {
			this.unitOfWork.rollback(error)
			throw error
		}

		this.unitOfWork.commit()

		return transaction.value
	}

	private calculateAccountAmount(
		distributions: AccountDistribution[],
		totalAmount: Amount,
	): Array<{ account: Account; amount: Amount }> {
		const accountAmounts: Array<{ account: Account; amount: Amount }> = []

		const total = Amount.zero()
		const remaining = Amount.create({ value: totalAmount.value, scale: totalAmount.scale }).getRight()

		for (const distribution of distributions) {
			if ('share' in distribution) {
				const shareAmount = totalAmount.multiply(distribution.share / 100)
				total.add(shareAmount)
				remaining.subtract(shareAmount)
				accountAmounts.push({ account: distribution.account, amount: shareAmount })
			} else if ('amount' in distribution) {
				total.add(distribution.amount)
				remaining.subtract(distribution.amount)
				accountAmounts.push({ account: distribution.account, amount: distribution.amount })
			} else if ('remaining' in distribution) {
				total.add(remaining)
				remaining.subtract(remaining)
				accountAmounts.push({
					account: distribution.account,
					amount: Amount.create({ value: remaining.value, scale: remaining.scale }).getRight(),
				})
			}
		}

		return accountAmounts
	}
}
