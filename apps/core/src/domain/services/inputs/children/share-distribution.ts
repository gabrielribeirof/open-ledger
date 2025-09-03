import type { Account } from '@/domain/account/account'

import { Distribution } from './distribution'

export class ShareDistribution extends Distribution {
	constructor(
		account: Account,
		public share: number,
	) {
		super(account)
	}
}
