import { ApiProperty } from '@nestjs/swagger'

export class CreateAssetDTO {
	@ApiProperty({
		description: 'The name of the asset',
		example: 'United States Dollar',
	})
	name!: string

	@ApiProperty({
		description: 'The code of the asset',
		example: 'USD',
	})
	code!: string
}
