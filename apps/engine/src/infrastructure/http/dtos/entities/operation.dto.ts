import { ApiProperty } from '@nestjs/swagger'

import { AmountDTO } from './amount.dto'

export class OperationDTO {
	@ApiProperty({
		description: 'Unique identifier of the operation',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id!: string

	@ApiProperty({
		description: 'Operation amount',
	})
	amount!: AmountDTO

	@ApiProperty({
		description: 'Type of operation',
		enum: ['DEBIT', 'CREDIT'],
		example: 'DEBIT',
	})
	type!: 'DEBIT' | 'CREDIT'

	@ApiProperty({
		description: 'Account identifier associated with this operation',
		example: '456e7890-e89b-12d3-a456-426614174001',
	})
	account_id!: string
}
