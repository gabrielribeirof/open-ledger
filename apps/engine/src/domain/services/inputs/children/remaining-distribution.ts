import type { Account } from '@/domain/account/account'

import { Distribution } from './distribution'

export class RemainingDistribution extends Distribution {
	constructor(account: Account) {
		super(account)
	}
}
