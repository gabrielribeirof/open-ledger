import { Document } from '@/domain/user/document';
import { Email } from '@/domain/user/email';
import { Password } from '@/domain/user/password';
import { User } from '@/domain/user/user';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

export class UserMapper {
	static toDomain(user: UserEntity): User {
		const id = UniqueIdentifier.create(user.id);
		const document = Document.create({ value: user.document }).getRight();
		const email = Email.create({ value: user.email }).getRight();
		const password = Password.create({
			value: user.password,
			isHashed: true,
		}).getRight();

		return User.create(
			{
				name: user.name,
				document,
				email,
				password,
			},
			id.getRight(),
		);
	}

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
