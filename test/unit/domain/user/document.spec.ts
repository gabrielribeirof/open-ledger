import { Document } from '@/domain/user/document';
import { InvalidFormatViolation } from '@/shared/errors/violations/invalid-format.violation';
import { cpf, cnpj } from 'cpf-cnpj-validator';

describe('Document', () => {
	it('should create a Document with a valid CPF', () => {
		const validCPF = cpf.generate(false);
		const sut = Document.create({
			value: validCPF,
		});

		expect(sut.isRight()).toBe(true);
		expect(sut.value).toBeInstanceOf(Document);
		if (sut.isRight()) {
			expect(sut.value.value).toBe(validCPF);
		}
	});

	it('should create a Document with a valid CNPJ', () => {
		const validCNPJ = cnpj.generate(false);
		const sut = Document.create({
			value: validCNPJ,
		});

		expect(sut.isRight()).toBe(true);
		expect(sut.value).toBeInstanceOf(Document);
		if (sut.isRight()) {
			expect(sut.value.value).toBe(validCNPJ);
		}
	});

	it('should return InvalidFormatViolation for an invalid CPF', () => {
		const invalidCPF = '123.456.789-00';
		const sut = Document.create({
			value: invalidCPF,
		});

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});

	it('should return InvalidFormatViolation for an invalid CNPJ', () => {
		const invalidCNPJ = '12.345.678/0001-00';
		const sut = Document.create({
			value: invalidCNPJ,
		});

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});

	it('should return InvalidFormatViolation for a value that is neither CPF nor CNPJ', () => {
		const invalidValue = 'abcdef12345';
		const sut = Document.create({
			value: invalidValue,
		});

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});

	it('should return InvalidFormatViolation for an empty string', () => {
		const emptyValue = '';
		const sut = Document.create({
			value: emptyValue,
		});

		expect(sut.isLeft()).toBe(true);
		expect(sut.value).toBeInstanceOf(InvalidFormatViolation);
	});
});
