import { Amount } from '@/shared/domain/amount'
import { Entity } from '@/shared/seedwork/entity'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import { OperationType } from './operation-type'

interface OperationProperties {
	amount: Amount
	type: OperationType
	account_id: UniqueIdentifier
}

export class Operation extends Entity<OperationProperties> {
	get amount(): Amount {
		return this.properties.amount
	}

	get type(): OperationType {
		return this.properties.type
	}

	get account_id(): UniqueIdentifier {
		return this.properties.account_id
	}

	private constructor(properties: OperationProperties, id?: UniqueIdentifier) {
		super(properties, id)
	}

	public static create(properties: OperationProperties, id?: UniqueIdentifier): Operation {
		return new Operation(properties, id)
	}
}
