import { ValueObject } from '@/shared/seedwork/value-object';

import { isEmail } from 'class-validator';
import { Either, left, right } from '@/shared/lib/either';
import { Violation } from '@/shared/seedwork/violation';
import { InvalidFormatViolation } from '@/shared/domain/errors/violations/invalid-format.violation';

interface EmailProperties {
	value: string;
}

export class Email extends ValueObject<EmailProperties> {
	get value() {
		return this.props.value;
	}

	private constructor(props: EmailProperties) {
		super(props);
	}

	public static create(props: EmailProperties): Either<Violation, Email> {
		if (!isEmail(props.value)) {
			return left(new InvalidFormatViolation());
		}

		return right(new Email(props));
	}
}
