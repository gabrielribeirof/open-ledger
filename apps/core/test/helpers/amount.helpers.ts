import { faker } from '@faker-js/faker'

import { Amount } from '@/shared/domain/amount'

export interface GenerateFakeAmountProperties {
	value?: bigint
	scale?: number
}

export function generateFakeAmount(props: GenerateFakeAmountProperties = {}) {
	const value = props.value ?? faker.number.bigInt({ min: 1 })

	return Amount.create({
		value,
		scale: props.scale ?? faker.number.int({ min: 0, max: value.toString().length - 1 }),
	}).getRight()
}
