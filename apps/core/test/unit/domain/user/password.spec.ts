import { Password } from '@/domain/user/password'

describe('Password', () => {
	const validPasswordText = '123456789123456789123456789!A@'

	it('should create a password with a valid value', () => {
		const password = Password.create({
			value: validPasswordText,
			isHashed: false,
		})

		expect(password.isRight()).toBeTruthy()
		expect(password.getRight().value).toBe(validPasswordText)
	})

	it('should be able to create a hashed password', () => {
		const notHashedPassword = Password.create({
			value: validPasswordText,
			isHashed: false,
		})

		const hash = notHashedPassword.getRight().getHashedValue()

		const hashedPassword = Password.create({
			value: hash,
			isHashed: true,
		})

		expect(hashedPassword.isRight()).toBeTruthy()
		expect(hashedPassword.getRight().isHashed).toBeTruthy()
	})

	it('should be able to compare a unhashed password with a hash', () => {
		const password = Password.create({
			value: validPasswordText,
			isHashed: false,
		})

		expect(
			password.getRight().comparePassword(validPasswordText),
		).resolves.toBeTruthy()
	})

	it('should be able to compare a hashed password with a hash', () => {
		const notHashedPassword = Password.create({
			value: validPasswordText,
			isHashed: false,
		})

		const hash = notHashedPassword.getRight().getHashedValue()

		const hashedPassword = Password.create({
			value: hash,
			isHashed: true,
		})

		expect(
			hashedPassword.getRight().comparePassword(validPasswordText),
		).resolves.toBeTruthy()
		expect(hashedPassword.getRight().getHashedValue()).toBe(hash)
	})

	it('should not create a password with a value less than 6 characters', () => {
		const password = Password.create({
			value: '12345',
			isHashed: false,
		})

		expect(password.isLeft()).toBeTruthy()
	})

	it('should not create a password with a value greater than 256 characters', () => {
		const chars =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'

		const password = Password.create({
			value: Array(257)
				.map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
				.join(''),
			isHashed: false,
		})

		expect(password.isLeft()).toBeTruthy()
	})
})
