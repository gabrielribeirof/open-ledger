import { faker } from '@faker-js/faker'
import { generateFakeAmount } from '@test/helpers/amount.helpers'

import { InvalidFormatViolation } from '@/shared/domain/_errors/violations/invalid-format.violation'
import { Amount } from '@/shared/domain/amount'

describe('Amount', () => {
	describe('add', () => {
		it('should add two valid amounts with same scale', () => {
			const number1 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const number2 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const scale = faker.number.int({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_SCALE })
			const amount1 = generateFakeAmount({ value: number1, scale: scale }).getRight()
			const amount2 = generateFakeAmount({ value: number2, scale: scale }).getRight()

			const result = amount1.add(amount2)

			expect(result).toBeInstanceOf(Amount)
			expect(result.value).toBe(amount1.value + amount2.value)
		})

		it('should add two valid amounts with divergent scale', () => {
			const number1 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const number2 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const scale1 = faker.number.int({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_SCALE - 1 })
			const scale2 = scale1 + 1
			const amount1 = generateFakeAmount({ value: number1, scale: scale1 }).getRight()
			const amount2 = generateFakeAmount({ value: number2, scale: scale2 }).getRight()

			const result = amount1.add(amount2)

			expect(result).toBeInstanceOf(Amount)
			const expectedScale = Math.max(scale1, scale2)
			const expectedValue =
				number1 * 10n ** BigInt(expectedScale - scale1) + number2 * 10n ** BigInt(expectedScale - scale2)
			expect(result.value).toBe(expectedValue)
			expect(result.scale).toBe(expectedScale)
		})
	})

	describe('subtract', () => {
		it('should subtract two valid amounts with same scale', () => {
			const number1 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const number2 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const scale = faker.number.int({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_SCALE })
			const amount1 = generateFakeAmount({ value: number1, scale: scale }).getRight()
			const amount2 = generateFakeAmount({ value: number2, scale: scale }).getRight()

			const result = amount1.subtract(amount2)

			expect(result).toBeInstanceOf(Amount)
			expect(result.value).toBe(amount1.value - amount2.value)
		})

		it('should subtract two valid amounts with divergent scale', () => {
			const number1 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const number2 = faker.number.bigInt({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_VALUE })
			const scale1 = faker.number.int({ min: Amount.MINIMUM_NUMBER, max: Amount.MAXIMUM_SCALE - 1 })
			const scale2 = scale1 + 1
			const amount1 = generateFakeAmount({ value: number1, scale: scale1 }).getRight()
			const amount2 = generateFakeAmount({ value: number2, scale: scale2 }).getRight()

			const result = amount1.subtract(amount2)

			expect(result).toBeInstanceOf(Amount)
			const expectedScale = Math.max(scale1, scale2)
			const expectedValue =
				number1 * 10n ** BigInt(expectedScale - scale1) - number2 * 10n ** BigInt(expectedScale - scale2)
			expect(result.value).toBe(expectedValue)
			expect(result.scale).toBe(expectedScale)
		})
	})

	describe('equals', () => {
		it('should return true for equal value with same scale', () => {
			const amount1 = generateFakeAmount().getRight()
			const amount2 = generateFakeAmount({ value: amount1.value, scale: amount1.scale }).getRight()

			const result = amount1.equals(amount2)

			expect(result).toBe(true)
		})

		it('should return false for equal value with different scale', () => {
			const amount1 = generateFakeAmount().getRight()
			const amount2 = generateFakeAmount({ value: amount1.value, scale: amount1.scale + 1 }).getRight()

			const result = amount1.equals(amount2)

			expect(result).toBe(false)
		})

		it('should return true for equal amount with different normalizations', () => {
			const amount1 = generateFakeAmount({ value: 1000n, scale: 3 }).getRight()
			const amount2 = generateFakeAmount({ value: 1n, scale: 0 }).getRight()

			const result = amount1.equals(amount2)

			expect(result).toBe(true)
		})

		it('should return false for unequal amounts with different normalizations', () => {
			const amount1 = generateFakeAmount().getRight()
			const amount2 = generateFakeAmount({ value: amount1.value + 1n, scale: amount1.scale + 1 }).getRight()

			const result = amount1.equals(amount2)

			expect(result).toBe(false)
		})
	})

	describe('isZero', () => {
		it('should return true for zero amount', () => {
			const amount = Amount.zero()
			expect(amount.isZero()).toBe(true)
		})

		it('should return false for non-zero amount', () => {
			const amount = generateFakeAmount({
				value: faker.number.bigInt({ min: 1n, max: Amount.MAXIMUM_VALUE }),
			}).getRight()
			expect(amount.isZero()).toBe(false)
		})
	})

	describe('percentage', () => {
		it('should calculate the correct percentage of the amount', () => {
			const amount = generateFakeAmount({
				value: faker.number.bigInt({ min: 1n, max: Amount.MAXIMUM_VALUE }),
			}).getRight()
			const percent = faker.number.int({ min: 1, max: 100 })

			const result = amount.percentage(percent)

			expect(result.value).toBe((amount.value * BigInt(percent)) / 100n)
		})

		it('should not calculate the percentage for invalid values', () => {
			const amount = generateFakeAmount().getRight()
			expect(() => amount.percentage(-1)).toThrow()
			expect(() => amount.percentage(101)).toThrow()
		})
	})

	describe('zero', () => {
		it('should create a zeroed amount', () => {
			const amount = Amount.zero()
			expect(amount.value).toBe(0n)
			expect(amount.scale).toBe(0)
		})
	})

	describe('create', () => {
		it('should create a valid data', () => {
			const amount = generateFakeAmount()
			expect(amount.isRight()).toBe(true)
		})

		it('should create a valid maximum data', () => {
			const amount = generateFakeAmount({ value: Amount.MAXIMUM_VALUE, scale: Amount.MAXIMUM_SCALE })
			expect(amount.isRight()).toBe(true)
		})

		it('should create a valid minimum data', () => {
			const amount = generateFakeAmount({ value: BigInt(Amount.MINIMUM_NUMBER), scale: Amount.MINIMUM_NUMBER })
			expect(amount.isRight()).toBe(true)
		})

		it('should not create an amount with value less than minimum number property', () => {
			const amount = generateFakeAmount({ value: BigInt(Amount.MINIMUM_NUMBER - 1) })
			expect(amount.isLeft()).toBe(true)
			expect(amount.value).toBeInstanceOf(InvalidFormatViolation)
		})

		it('should not create an amount with scale less than minimum number property', () => {
			const amount = generateFakeAmount({ scale: Amount.MINIMUM_NUMBER - 1 })
			expect(amount.isLeft()).toBe(true)
			expect(amount.value).toBeInstanceOf(InvalidFormatViolation)
		})

		it('should not create an amount with value greater than maximum number property', () => {
			const amount = generateFakeAmount({ value: Amount.MAXIMUM_VALUE + 1n })
			expect(amount.isLeft()).toBe(true)
			expect(amount.value).toBeInstanceOf(InvalidFormatViolation)
		})

		it('should not create an amount with scale greater than maximum scale property', () => {
			const amount = generateFakeAmount({ scale: Amount.MAXIMUM_SCALE + 1 })
			expect(amount.isLeft()).toBe(true)
			expect(amount.value).toBeInstanceOf(InvalidFormatViolation)
		})
	})
})
