import { ApiProperty } from '@nestjs/swagger'

export class CreateAccountDTO {
	@ApiProperty({
		description: 'The code of the asset associated with the account',
		example: 'USD',
	})
	asset_code!: string

	@ApiProperty({
		description: 'The alias for the account',
		example: '8979968912-1',
	})
	alias!: string
}
