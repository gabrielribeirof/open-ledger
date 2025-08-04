import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiResponse, getSchemaPath } from '@nestjs/swagger'

import { InvalidFormatViolation } from '../domain/_errors/violations/invalid-format.violation'
import { InvalidUUIDViolation } from '../domain/_errors/violations/invalid-uuid.violation'
import { ErrorCode } from '../seedwork/error-code'
import { ErrorDTO } from './error.dto'
import { InvalidParametersErrorDTO } from './invalid-parameters.error.dto'

export function ApiErrorResponse(statusCode: HttpStatus, errorCode?: ErrorCode) {
	return applyDecorators(
		ApiResponse({
			status: statusCode,
			schema: {
				example: {
					code: errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
					...(errorCode === ErrorCode.INVALID_PARAMETERS && {
						violations: {
							amount: [new InvalidFormatViolation()],
							sources: { '0': { id: [new InvalidUUIDViolation()] } },
						},
					}),
				},
				type:
					errorCode === ErrorCode.INVALID_PARAMETERS
						? getSchemaPath(InvalidParametersErrorDTO)
						: getSchemaPath(ErrorDTO),
			},
		}),
	)
}
