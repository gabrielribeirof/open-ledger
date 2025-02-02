import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { IUserRepository } from '@/domain/user/iuser.repository';
import { User } from '@/domain/user/user';
import { UserMapper } from '@/infrastructure/http/mappers/user-mapper';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmUserRepository implements IUserRepository {
	constructor(
		@InjectRepository(UserEntity)
		private readonly repository: EntityRepository<UserEntity>,
	) {}

	async findById(id: UniqueIdentifier): Promise<User | null> {
		const user = await this.repository.findOne(id.value);

		return user ? UserMapper.toDomain(user) : null;
	}

	async save(user: User): Promise<void> {
		await this.repository.upsert(UserMapper.toPersistence(user));
	}
}
