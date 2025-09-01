import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, Max, Min } from 'class-validator'

export class ShareDistributionDTO {
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
