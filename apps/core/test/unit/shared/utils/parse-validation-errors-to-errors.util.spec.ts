import { ValidationError } from '@nestjs/common'

import { InvalidParametersError } from '../../../../src/shared/domain/_errors/invalid-parameters.error'
import { parseValidationErrorsToErrorsUtil } from '../../../../src/shared/utils/parse-validation-errors-to-errors.util'

describe('parseValidationErrorsToErrorsUtil', () => {
	it('should return an InvalidParametersError instance', () => {
		const validationErrors: ValidationError[] = []

		const result = parseValidationErrorsToErrorsUtil(validationErrors)

		expect(result).toBeInstanceOf(InvalidParametersError)
	})

	it('should group violations by property', () => {
		const validationErrors: ValidationError[] = [
			{
				property: 'name',
				constraints: {
					isNotEmpty: 'name should not be empty',
				},
			},
			{
				property: 'email',
				constraints: {
					isEmail: 'email must be an email',
				},
			},
		]

		const result = parseValidationErrorsToErrorsUtil(validationErrors)

		expect(result.violations).toHaveProperty('name')
		expect(result.violations).toHaveProperty('email')
		expect(result.violations?.name).toHaveLength(1)
		expect(result.violations?.email).toHaveLength(1)
	})

	it('should handle validation errors without constraints', () => {
		const validationErrors: ValidationError[] = [
			{
				property: 'name',
			} as ValidationError,
		]

		const result = parseValidationErrorsToErrorsUtil(validationErrors)

		expect(result.violations).toBeUndefined()
	})
})
