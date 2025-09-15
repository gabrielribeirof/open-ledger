import type { Account } from '@/domain/account/account'

export abstract class Distribution {
	constructor(public readonly account: Account) {}
}
