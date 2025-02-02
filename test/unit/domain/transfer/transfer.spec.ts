import { Transfer } from '@/domain/transfer/transfer';
import { Monetary } from '@/shared/domain/monetary';
import { TransferAmountMustBeGreaterThanZeroError } from '@/shared/errors/transfer-amount-must-be-greater-than-zero.error';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

describe('Transfer', () => {
	it('should not create transfer with invalid amount data', () => {
		const originId = new UniqueIdentifier();
		const targetId = new UniqueIdentifier();
		const amount = Monetary.create(0);

		const sut = Transfer.create({
			originId,
			targetId,
			amount,
		}).getLeft();

		expect(sut).toBeInstanceOf(TransferAmountMustBeGreaterThanZeroError);
	});

	it('should create transfer with valid data', () => {
		const originId = new UniqueIdentifier();
		const targetId = new UniqueIdentifier();
		const amount = Monetary.create(100);

		const sut = Transfer.create({
			originId,
			targetId,
			amount,
		}).getRight();

		expect(sut.originId).toBe(originId);
		expect(sut.targetId).toBe(targetId);
		expect(sut.amount).toBe(amount);
	});
});
