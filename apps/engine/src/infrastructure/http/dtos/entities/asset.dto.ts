import { ApiProperty } from '@nestjs/swagger'

export class AssetDTO {
	@ApiProperty({
		description: 'Unique identifier of the asset',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id!: string

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
