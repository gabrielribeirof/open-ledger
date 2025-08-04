import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator'

class AmountDistributionData {
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

export class AmountDistribution {
	@ApiProperty({
		description: 'Account alias identifier',
		example: 'user_wallet_001',
	})
	@IsString()
	account_alias!: string

	@ApiProperty({
		description: 'Specific amount distribution',
		type: AmountDistributionData,
	})
	@ValidateNested()
	@Type(() => AmountDistributionData)
	amount!: AmountDistributionData
}

export class ShareDistribution {
	@ApiProperty({
		description: 'Account alias identifier',
		example: 'user_wallet_001',
	})
	@IsString()
	account_alias!: string

	@ApiProperty({
		description: 'Percentage share of the total amount (0-100)',
		example: 50.5,
		minimum: 0,
		maximum: 100,
	})
	@IsNumber()
	@Min(0)
	@Max(100)
	share!: number
}

export class RemainingDistribution {
	@ApiProperty({
		description: 'Account alias identifier',
		example: 'user_wallet_001',
	})
	@IsString()
	account_alias!: string

	@ApiProperty({
		description: 'Indicates this account will receive the remaining amount',
		example: true,
	})
	@IsBoolean()
	remaining!: true
}

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
	sources!: (AmountDistribution | ShareDistribution | RemainingDistribution)[]

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
	targets!: (AmountDistribution | ShareDistribution | RemainingDistribution)[]
}
