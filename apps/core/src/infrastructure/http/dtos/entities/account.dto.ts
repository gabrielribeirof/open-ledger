import { ApiProperty } from '@nestjs/swagger'

export class AccountDTO {
	@ApiProperty({
		description: 'Unique identifier of the account',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id!: string

	@ApiProperty({
		description: 'The code of the asset',
		example: 'USD',
	})
	asset_code!: string

	@ApiProperty({
		description: 'The alias of the account',
		example: '90730809-0',
	})
	alias!: string

	@ApiProperty({
		description: 'The version of the account',
		example: '1',
	})
	version!: number
}
