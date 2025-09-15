import { getConfigOrThrowUtil } from '@/shared/utils/get-config-or-throw.util'

describe('getConfigOrThrowUtil', () => {
	const originalEnv = process.env

	beforeEach(() => {
		process.env = { ...originalEnv }
	})

	afterEach(() => {
		process.env = originalEnv
	})

	it('should return the environment variable value when it exists', () => {
		const key = 'TEST_VAR'
		const expectedValue = 'test-value'
		process.env[key] = expectedValue

		const result = getConfigOrThrowUtil(key)

		expect(result).toBe(expectedValue)
	})

	it('should throw an error when the environment variable does not exist', () => {
		const key = 'NON_EXISTENT_VAR'
		delete process.env[key]

		expect(() => {
			getConfigOrThrowUtil(key)
		}).toThrow()
	})
})
