import { Monetary } from '@/shared/domain/monetary';
import { InvalidFormatViolation } from '@/shared/domain/_errors/violations/invalid-format.violation';

describe('Monetary', () => {
	describe('create', () => {
		it('should create a valid monetary object with integer value', () => {
			const monetaryOrError = Monetary.create(100);

			expect(monetaryOrError.isRight()).toBeTruthy();
			expect(monetaryOrError.getRight().value).toBe(100);
		});

		it('should create a valid monetary object with decimal value', () => {
			const monetaryOrError = Monetary.create(100.5);

			expect(monetaryOrError.isRight()).toBeTruthy();
			expect(monetaryOrError.getRight().value).toBe(100.5);
		});

		it('should fail when value exceeds maximum allowed', () => {
			const monetaryOrError = Monetary.create(9999999999999.999);

			expect(monetaryOrError.isLeft()).toBeTruthy();
			expect(monetaryOrError.value).toBeInstanceOf(InvalidFormatViolation);
		});

		it('should fail when value has more than two decimal places', () => {
			const monetaryOrError = Monetary.create(100.123);

			expect(monetaryOrError.isLeft()).toBeTruthy();
			expect(monetaryOrError.value).toBeInstanceOf(InvalidFormatViolation);
		});
	});

	describe('operations', () => {
		it('should add two monetary values correctly', () => {
			const monetary1 = Monetary.create(100.5).value as Monetary;
			const monetary2 = Monetary.create(50.25).value as Monetary;

			monetary1.add(monetary2);

			expect(monetary1.value).toBe(150.75);
		});

		it('should subtract monetary value correctly', () => {
			const monetary1 = Monetary.create(100.5).value as Monetary;
			const monetary2 = Monetary.create(50.25).value as Monetary;

			monetary1.subtract(monetary2);

			expect(monetary1.value).toBe(50.25);
		});
	});

	describe('toCents', () => {
		it('should convert value to cents correctly for integer value', () => {
			const monetary = Monetary.create(100).value as Monetary;

			expect(monetary.toCents).toBe(10000);
		});

		it('should convert value to cents correctly for decimal value', () => {
			const monetary = Monetary.create(100.5).value as Monetary;

			expect(monetary.toCents).toBe(10050);
		});
	});
});
