import { createFakeAccount } from '@test/helpers/account.helpers'

import { AccountType } from '@/domain/account/account-type'
import { CreateTransferDomainService } from '@/domain/services/create-transfer.domain-service'
import { InMemoryUnitOfWork } from '@/infrastructure/repositories/in-memory/in-memory.unit-of-work'
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider'
import { InsufficientAccountTypePermissionsError } from '@/shared/domain/_errors/insufficient-account-type-permissions.error'
import { InsufficientFundsError } from '@/shared/domain/_errors/insufficient-funds.error'
import { InternalServerError } from '@/shared/domain/_errors/internal-server.error'
import { UnauthorizedTransferError } from '@/shared/domain/_errors/unauthorized-transfer.error'
import { Monetary } from '@/shared/domain/monetary'
import { Error } from '@/shared/seedwork/error'

function createSut(isTransferAuthorized = true) {
	const unitOfWork = new InMemoryUnitOfWork()
	const sut = new CreateTransferDomainService(new InMemoryTransferAuthorizerProvider(isTransferAuthorized), unitOfWork)

	return {
		sut,
		unitOfWork,
	}
}

describe('CreateTransferDomainService', () => {
	it('should not create a transfer if the originating account type is different from common', async () => {
		const origin = createFakeAccount({ type: AccountType.MERCHANT })
		const target = createFakeAccount({ type: AccountType.COMMON })

		const amount = Monetary.create(100).getRight()

		expect(createSut().sut.execute(origin, target, amount)).rejects.toBeInstanceOf(
			InsufficientAccountTypePermissionsError,
		)
	})

	it('should not create a transfer if the originating account balance is insufficient', async () => {
		const origin = createFakeAccount({ type: AccountType.COMMON, balance: 50 })
		const target = createFakeAccount({ type: AccountType.COMMON })

		const amount = Monetary.create(100).getRight()

		expect(createSut().sut.execute(origin, target, amount)).rejects.toBeInstanceOf(InsufficientFundsError)
	})

	it('should not create a transfer if the transfer is not authorized', async () => {
		const origin = createFakeAccount({
			type: AccountType.COMMON,
			balance: 100,
		})
		const target = createFakeAccount({ type: AccountType.COMMON })

		const amount = Monetary.create(100).getRight()

		expect(createSut(false).sut.execute(origin, target, amount)).rejects.toBeInstanceOf(UnauthorizedTransferError)
	})

	it('should not create a transfer if transfer creation fails', async () => {
		const origin = createFakeAccount({ type: AccountType.COMMON })
		const target = createFakeAccount({ type: AccountType.COMMON })

		const amount = Monetary.create(-100).getRight()

		expect(createSut().sut.execute(origin, target, amount)).rejects.toBeInstanceOf(Error)
	})

	it('should not create a transfer when unit of work fails', async () => {
		const origin = createFakeAccount({
			type: AccountType.COMMON,
			balance: 100,
		})
		const target = createFakeAccount({ type: AccountType.COMMON })

		const amount = Monetary.create(100).getRight()

		const unitOfWork = new InMemoryUnitOfWork()
		unitOfWork.commit = jest.fn().mockRejectedValueOnce('Unit of work failed')
		unitOfWork.rollback = jest.fn()

		const sut = new CreateTransferDomainService(new InMemoryTransferAuthorizerProvider(true), unitOfWork)

		await expect(sut.execute(origin, target, amount)).rejects.toBeInstanceOf(InternalServerError)

		expect(unitOfWork.rollback).toHaveBeenCalled()
		expect(unitOfWork.commit).toHaveBeenCalled()
	})

	it('should create a transfer if all conditions are met', async () => {
		const origin = createFakeAccount({
			type: AccountType.COMMON,
			balance: 100,
		})
		const target = createFakeAccount({ type: AccountType.COMMON, balance: 0 })

		const amount = Monetary.create(100).getRight()

		expect(createSut().sut.execute(origin, target, amount)).resolves.toMatchObject({
			originId: origin.id,
			targetId: target.id,
			amount,
		})
	})
})
