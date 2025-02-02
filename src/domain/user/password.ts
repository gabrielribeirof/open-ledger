import * as bcrypt from 'bcrypt';
import { ValueObject } from '@/shared/seedwork/value-object';
import { Violation } from '@/shared/seedwork/violation';
import { Either, left, right } from '@/shared/lib/either';
import { BadLengthViolation } from '@/shared/errors/violations/bad-length.violation';

interface PasswordProperties {
	value: string;
	isHashed: boolean;
}

export class Password extends ValueObject<PasswordProperties> {
	get value() {
		return this.props.value;
	}

	get isHashed() {
		return this.props.isHashed;
	}

	private constructor(props: PasswordProperties) {
		super(props);
	}

	public async comparePassword(password: string): Promise<boolean> {
		if (this.isHashed) {
			return await bcrypt.compare(password, this.value);
		} else {
			return this.value === password;
		}
	}

	public getHashedValue() {
		if (this.isHashed) {
			return this.value;
		} else {
			return bcrypt.hashSync(this.value, 12);
		}
	}

	public static create(props: PasswordProperties): Either<Violation, Password> {
		const value = props.value.trim();

		if (value.length < 6 || value.length > 256) {
			return left(new BadLengthViolation(6, 256, 'números'));
		}

		return right(new Password(props));
	}
}
