import { faker } from '@faker-js/faker/.'
import { cnpj, cpf } from 'cpf-cnpj-validator'

import { Document } from '@/domain/user/document'
import { Email } from '@/domain/user/email'
import { Password } from '@/domain/user/password'
import { User } from '@/domain/user/user'

interface Props {
	name: string
	email: string
	document: string
	password: string
}

export function createUserProps(): Props {
	return {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		document: cpf.generate(false),
		password: faker.internet.password({ length: 15 }),
	}
}

export function createFakeUser(props: Partial<Props> = {}) {
	const willGenerateCpf = Math.random() > 0.5
	const documentValue = willGenerateCpf ? cpf.generate(false) : cnpj.generate(false)

	const email = Email.create({
		value: props.email ?? faker.internet.email(),
	}).getRight()
	const document = Document.create({
		value: props.document ?? documentValue,
	}).getRight()
	const password = Password.create({
		value: props.password ?? faker.internet.password({ length: 15 }),
		isHashed: false,
	}).getRight()

	return User.create({
		name: props.name ?? faker.person.fullName(),
		email,
		password,
		document,
	})
}
