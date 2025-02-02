import { IUserRepository } from '@/domain/user/iuser.repository';
import { User } from '@/domain/user/user';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

export class InMemoryUserRepository implements IUserRepository {
	public users = new Map<string, User>();

	async findById(id: UniqueIdentifier): Promise<User | null> {
		return this.users.get(id.value);
	}

	async save(user: User): Promise<void> {
		this.users.set(user.id.value, user);
	}
}
