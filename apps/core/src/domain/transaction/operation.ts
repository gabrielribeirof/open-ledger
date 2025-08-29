import { InvalidAmountError } from '@/shared/domain/_errors/invalid-amount.error'
import { Amount } from '@/shared/domain/amount'
import { Either, left, right } from '@/shared/lib/either'
import { Entity } from '@/shared/seedwork/entity'
import { Error } from '@/shared/seedwork/error'
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

	public isDebit(): boolean {
		return this.type === OperationType.DEBIT
	}

	public isCredit(): boolean {
		return this.type === OperationType.CREDIT
	}

	private constructor(properties: OperationProperties, id?: UniqueIdentifier) {
		super(properties, id)
	}

	public static create(properties: OperationProperties, id?: UniqueIdentifier): Either<Error, Operation> {
		if (properties.amount.isZero()) return left(new InvalidAmountError())

		return right(new Operation(properties, id))
	}
}
