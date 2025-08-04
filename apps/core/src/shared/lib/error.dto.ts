import { ApiProperty } from '@nestjs/swagger'

import { ErrorCode } from '../seedwork/error-code'

export class ErrorDTO {
	@ApiProperty({
		enum: ErrorCode,
	})
	code!: ErrorCode
}
