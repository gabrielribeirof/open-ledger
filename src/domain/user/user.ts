import { AggregateRoot } from '@/shared/seedwork/aggregate-root';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Password } from './password';
import { Document } from './document';
import { Email } from './email';

interface UserProperties {
	name: string;
	document: Document;
	email: Email;
	password: Password;
}

export class User extends AggregateRoot<UserProperties> {
	get name() {
		return this.props.name;
	}

	get document() {
		return this.props.document;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}

	private constructor(props: UserProperties, id?: UniqueIdentifier) {
		super(props, id);
	}

	public static create(props: UserProperties, id?: UniqueIdentifier): User {
		return new User(props, id);
	}
}
