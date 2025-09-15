import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator'

import { DistributionDTO } from './children/distribution.dto'

export class CreateTransactionDTO {
	@ApiProperty({
		description: 'Asset code identifier',
		example: 'USD',
	})
	@IsString()
	asset_code!: string

	@ApiProperty({
		description: 'Total transaction value as string (will be converted to bigint)',
		example: '1000000',
	})
	@Transform(({ value }) => BigInt(value))
	value!: bigint

	@ApiProperty({
		description: 'Decimal scale for the transaction value',
		example: 2,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	scale!: number

	@ApiProperty({
		description: 'Source accounts and their distribution strategies',
		type: [Object],
		example: [
			{
				account_alias: 'source_account_1',
				amount: { value: '500000', scale: 2 },
			},
			{
				account_alias: 'source_account_2',
				share: 50,
			},
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	sources!: DistributionDTO[]

	@ApiProperty({
		description: 'Target accounts and their distribution strategies',
		type: [Object],
		example: [
			{
				account_alias: 'target_account_1',
				amount: { value: '750000', scale: 2 },
			},
			{
				account_alias: 'target_account_2',
				remaining: true,
			},
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	targets!: DistributionDTO[]
}
