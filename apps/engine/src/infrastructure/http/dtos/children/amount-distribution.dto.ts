import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'

import { AmountDistributionDataDTO } from './amount-distribution-data.dto'

export class AmountDistributionDTO {
	@ApiProperty({
		description: 'Account alias identifier',
		example: 'user_wallet_001',
	})
	@IsString()
	account_alias!: string

	@ApiProperty({
		description: 'Specific amount distribution',
		type: AmountDistributionDataDTO,
	})
	@ValidateNested()
	@Type(() => AmountDistributionDataDTO)
	amount!: AmountDistributionDataDTO
}
