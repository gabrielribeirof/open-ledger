import { UniqueIdentifier } from '../../shared/seedwork/unique-identifier';
import { Account } from './account';

export interface IAccountRepository {
	findById(id: UniqueIdentifier): Promise<Account | null>;
	save(account: Account): Promise<void>;
}

export const ACCOUNT_REPOSITORY = 'IAccountRepository';
