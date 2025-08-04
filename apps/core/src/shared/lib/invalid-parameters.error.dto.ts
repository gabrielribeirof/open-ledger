import { ApiProperty } from '@nestjs/swagger'

import { ErrorDTO } from './error.dto'

export class InvalidParametersErrorDTO extends ErrorDTO {
	@ApiProperty({
		description: 'A map of violations where each key is a field name and the value is an array of error messages.',
	})
	violations?: Record<string, string[]>
}
