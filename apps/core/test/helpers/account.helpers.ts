import { v4 } from 'uuid'

import { Account } from '@/domain/account/account'
import { AccountType } from '@/domain/account/account-type'
import { Monetary } from '@/shared/domain/monetary'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

interface Props {
	type: AccountType | 'random'
	balance: number
	userId: string
	version: number
}

export function createAccountProps(): Props {
	return {
		type: AccountType.COMMON,
		balance: 100,
		userId: v4(),
		version: 1,
	}
}

export function createFakeAccount(props: Partial<Props> = {}) {
	const balance = Monetary.create(props.balance ?? 100)
	const userId = new UniqueIdentifier(props.userId)
	const version = props.version ?? 1

	function getType(): AccountType {
		if (props.type === 'random') {
			const types = Object.values(AccountType) as AccountType[]
			const index = Math.floor(Math.random() * types.length)
			return types[index]
		}

		return props.type ?? AccountType.COMMON
	}

	return Account.create({
		type: getType(),
		balance: balance.getRight(),
		userId,
		version,
	})
}
