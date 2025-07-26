import { User } from '@/domain/user/user';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';

export class UserMapper {
	static toPersistence(user: User): UserEntity {
		const entity = new UserEntity();

		entity.id = user.id.value;
		entity.name = user.name;
		entity.email = user.email.value;
		entity.document = user.document.value;
		entity.password = user.password.getHashedValue();

		return entity;
	}
}
