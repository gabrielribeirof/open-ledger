import { ApiProperty } from '@nestjs/swagger'

export class AmountDTO {
	@ApiProperty({
		description: 'Amount value',
		example: 100000,
	})
	value!: bigint

	@ApiProperty({
		description: 'Decimal scale for the amount value',
		example: 2,
		minimum: 0,
	})
	scale!: number
}
