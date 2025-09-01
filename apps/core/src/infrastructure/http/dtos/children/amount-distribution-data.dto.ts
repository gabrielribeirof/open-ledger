import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, Min } from 'class-validator'

export class AmountDistributionDataDTO {
	@ApiProperty({
		description: 'Amount value',
		example: '100000',
	})
	@IsNumber()
	@Transform(({ value }) => BigInt(value))
	value!: bigint

	@ApiProperty({
		description: 'Decimal scale for the amount',
		example: 2,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	scale!: number
}
