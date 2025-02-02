import { Email } from '@/domain/user/email';
import { InvalidFormatViolation } from '@/shared/errors/violations/invalid-format.violation';
import { faker } from '@faker-js/faker';

describe('Email', () => {
	it('should create an Email with a valid email address', () => {
		const validEmail = faker.internet.email();
		const sut = Email.create({ value: validEmail });

		expect(sut.isRight()).toBe(true);
		expect(sut.value).toBeInstanceOf(Email);
		if (sut.isRight()) {
			expect(sut.value.value).toBe(validEmail);
		}
	});

	it('should return InvalidFormatViolation for an invalid email address', () => {
		const invalidEmail = 'user@invalid-email';
		const sut = Email.create({ value: invalidEmail });

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});

	it('should return InvalidFormatViolation for a non-email string', () => {
		const nonEmail = 'not-an-email';
		const sut = Email.create({ value: nonEmail });

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});

	it('should return InvalidFormatViolation for an empty string', () => {
		const emptyEmail = '';
		const sut = Email.create({ value: emptyEmail });

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});

	it('should return InvalidFormatViolation for a null value', () => {
		const nullEmail = null;
		const sut = Email.create({ value: nullEmail });

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});

	it('should return InvalidFormatViolation for an undefined value', () => {
		const undefinedEmail = undefined;
		const sut = Email.create({ value: undefinedEmail });

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});
});
