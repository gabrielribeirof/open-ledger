import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class RemainingDistributionDTO {
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
