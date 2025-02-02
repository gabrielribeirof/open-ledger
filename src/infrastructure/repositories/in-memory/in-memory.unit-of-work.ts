import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work';

export class InMemoryUnitOfWork implements IUnitOfWork {
	async begin() {}

	async commit() {}

	async rollback() {}
}
