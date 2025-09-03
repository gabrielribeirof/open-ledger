import { AggregateRoot } from '@/shared/seedwork/aggregate-root'
import type { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import type { Document } from './document'
import type { Email } from './email'
import type { Password } from './password'

interface UserProperties {
	name: string
	document: Document
	email: Email
	password: Password
}

export class User extends AggregateRoot<UserProperties> {
	get name() {
		return this.properties.name
	}

	get document() {
		return this.properties.document
	}

	get email() {
		return this.properties.email
	}

	get password() {
		return this.properties.password
	}

	private constructor(props: UserProperties, id?: UniqueIdentifier) {
		super(props, id)
	}

	public static create(props: UserProperties, id?: UniqueIdentifier): User {
		return new User(props, id)
	}
}
