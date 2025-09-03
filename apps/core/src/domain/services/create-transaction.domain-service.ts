import { Injectable } from '@nestjs/common'

import { TransactionAccountAssetMismatchError } from '@/shared/domain/_errors/transaction-account-asset-mismatch.error'
import { Amount } from '@/shared/domain/amount'

import { Account } from '../account/account'
import { Operation } from '../transaction/operation'
import { OperationType } from '../transaction/operation-type'
import { Transaction } from '../transaction/transaction'
import { AmountDistribution } from './inputs/children/amount-distribution'
import { Distribution } from './inputs/children/distribution'
import { RemainingDistribution } from './inputs/children/remaining-distribution'
import { ShareDistribution } from './inputs/children/share-distribution'
import { CreateTransactionDomainServiceInput } from './inputs/create-transaction.domain-service.input'

@Injectable()
export class CreateTransactionDomainService {
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

		for (const operation of operations) {
			if (operation.isDebit()) {
				const accountAmount = sourceAmountPerAccount.find((source) => source.account.id.equals(operation.account_id))

				if (!accountAmount) throw new Error(`Amount not calculated for source account ${operation.account_id.value}`)

				if (!accountAmount.account.asset_code.equals(input.asset.code)) {
					throw new TransactionAccountAssetMismatchError()
				}

				accountAmount.account.withdraw(accountAmount.amount)
			}

			if (operation.isCredit()) {
				const accountAmount = targetAmountPerAccount.find((target) => target.account.id.equals(operation.account_id))

				if (!accountAmount) throw new Error(`Amount not calculated for target account ${operation.account_id.value}`)

				if (!accountAmount.account.asset_code.equals(input.asset.code)) {
					throw new TransactionAccountAssetMismatchError()
				}

				accountAmount.account.deposit(accountAmount.amount)
			}
		}

		const transaction = Transaction.create({
			asset_id: input.asset.id,
			amount: input.amount,
			operations,
		})

		if (transaction.isLeft()) throw transaction.value

		return transaction.value
	}

	private calculateAmountPerAccountInADistribution(distributions: Distribution[], totalAmount: Amount) {
		const result: { account: Account; amount: Amount }[] = []

		let remaining = Amount.create({ value: totalAmount.value, scale: totalAmount.scale }).getRight()

		for (const distribution of distributions) {
			if (distribution instanceof ShareDistribution) {
				const shareAmount = totalAmount.percentage(distribution.share)
				remaining = remaining.subtract(shareAmount)
				result.push({ account: distribution.account, amount: shareAmount })
			} else if (distribution instanceof AmountDistribution) {
				remaining = remaining.subtract(distribution.amount)
				result.push({ account: distribution.account, amount: distribution.amount })
			}
		}

		const remainingDistributions = distributions.filter((distribution) => distribution instanceof RemainingDistribution)

		if (remainingDistributions.length > 0) {
			for (const distribution of remainingDistributions) {
				result.push({ account: distribution.account, amount: remaining })
			}
		}

		return result
	}
}
