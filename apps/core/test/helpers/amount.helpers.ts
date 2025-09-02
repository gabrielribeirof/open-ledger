import { faker } from '@faker-js/faker'

import { Amount } from '@/shared/domain/amount'

export interface GenerateFakeAmountProperties {
	value?: bigint
	scale?: number
}

export function generateFakeAmount(props: GenerateFakeAmountProperties = {}) {
	const value = props.value ?? faker.number.bigInt({ min: Amount.MINIMUM_NUMBER + 1, max: Amount.MAXIMUM_VALUE })

	return Amount.create({
		value,
		scale: props.scale ?? faker.number.int({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_SCALE }),
	})
}
