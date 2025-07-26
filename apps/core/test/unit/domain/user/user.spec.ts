import { User } from '@/domain/user/user';
import { createFakeUser, createUserProps } from '@test/helpers/user.helpers';

describe('User', () => {
	it('should create user with valid date', () => {
		const props = createUserProps();

		const sut = createFakeUser(props);

		expect(sut).toBeInstanceOf(User);
		expect(sut.name).toBe(props.name);
		expect(sut.document.value).toBe(props.document);
		expect(sut.email.value).toBe(props.email);
		expect(sut.password.value).toBe(props.password);
	});
});
