import { ApiProperty, getSchemaPath } from '@nestjs/swagger'

import { AmountDTO } from './amount.dto'
import { OperationDTO } from './operation.dto'

export class TransactionDTO {
	@ApiProperty({
		description: 'Unique identifier of the transaction',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id!: string

	@ApiProperty({
		description: 'Unique identifier of the asset associated with the transaction',
		example: '456e7890-e89b-12d3-a456-426614174001',
	})
	asset_id!: string

	@ApiProperty({
		description: 'Transaction amount',
		type: AmountDTO,
	})
	amount!: AmountDTO

	@ApiProperty({
		description: 'List of operations in the transaction',
		type: 'array',
		items: {
			type: 'object',
			$ref: getSchemaPath(OperationDTO),
		},
	})
	operations!: OperationDTO[]
}
