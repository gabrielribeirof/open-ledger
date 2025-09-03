import type { Asset } from '@/domain/asset/asset'
import type { Amount } from '@/shared/domain/amount'

import type { Distribution } from './children/distribution'

export class CreateTransactionDomainServiceInput {
	constructor(
		public amount: Amount,
		public asset: Asset,
		public sources: Distribution[],
		public targets: Distribution[],
	) {}
}
