import { Transfer } from '@/domain/transfer/transfer'
import { TransferCreatedEvent } from '@/domain/transfer/transfer-created.event'
import { Monetary } from '@/shared/domain/monetary'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

describe('TransferCreatedEvent', () => {
	let transfer: Transfer

	beforeEach(() => {
		transfer = Transfer.create({
			originId: new UniqueIdentifier(),
			targetId: new UniqueIdentifier(),
			amount: Monetary.create(100).getRight(),
		}).getRight()
	})

	it('should return the transfer id when getAggregateId is called', () => {
		const transferCreatedEvent = new TransferCreatedEvent(transfer)

		expect(transferCreatedEvent.getAggregateId()).toBe(transfer.id)
	})
})
