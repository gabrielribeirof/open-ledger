import { CreateTransferDomainService } from '@/domain/services/create-transfer.domain-service';
import { InMemoryAccountRepository } from '@/infrastructure/repositories/in-memory/in-memory-account.repository';
import { InMemoryUnitOfWork } from '@/infrastructure/repositories/in-memory/in-memory.unit-of-work';
import { InMemoryTransferAuthorizerProvider } from '@/providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider';
import {
	CreateTransferServiceInput,
	CreateTransferService,
} from '@/services/create-transfer.service';
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error';
import { InvalidFormatViolation } from '@/shared/domain/_errors/violations/invalid-format.violation';
import { AccountNotFoundError } from '@/shared/domain/_errors/account-not-found.error';
import { createFakeAccount } from '@test/helpers/account.helpers';
import { v4 } from 'uuid';

const unitOfWork = new InMemoryUnitOfWork();
const domainService = new CreateTransferDomainService(
	new InMemoryTransferAuthorizerProvider(true),
	unitOfWork,
);
const accountRepository = new InMemoryAccountRepository();

const sut = new CreateTransferService(domainService, accountRepository);

describe('CreateTransferDomainService', () => {
	beforeEach(() => {
		accountRepository.accounts.clear();
	});

	it('should not be executed with invalid parameters', async () => {
		const result = sut.execute({
			origin_id: 'originId',
			target_id: 'targetId',
			amount: 1.111,
		});

		expect(result).rejects.toEqual(
			new InvalidParametersError<CreateTransferServiceInput>({
				origin_id: [new InvalidFormatViolation()],
				target_id: [new InvalidFormatViolation()],
				amount: [new InvalidFormatViolation()],
			}),
		);
	});

	it('should not be executed if the origin account does not exist', async () => {
		const result = sut.execute({
			origin_id: v4(),
			target_id: v4(),
			amount: 1,
		});

		expect(result).rejects.toBeInstanceOf(AccountNotFoundError);
	});

	it('should not be executed if the target account does not exist', async () => {
		const originAccount = createFakeAccount();

		accountRepository.save(originAccount);

		const result = sut.execute({
			origin_id: originAccount.id.value,
			target_id: v4(),
			amount: 1,
		});

		expect(result).rejects.toBeInstanceOf(AccountNotFoundError);
	});
});
