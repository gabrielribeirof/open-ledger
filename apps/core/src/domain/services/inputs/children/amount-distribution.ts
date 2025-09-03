import type { Account } from '@/domain/account/account'
import type { Amount } from '@/shared/domain/amount'

import { Distribution } from './distribution'

export class AmountDistribution extends Distribution {
	constructor(
		account: Account,
		public amount: Amount,
	) {
		super(account)
	}
}
