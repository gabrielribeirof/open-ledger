import { Either, left, right } from '@/shared/lib/either';
import { ValueObject } from '../../shared/seedwork/value-object';
import { InvalidFormatViolation } from '../../shared/errors/violations/invalid-format.violation';
import { Violation } from '../../shared/seedwork/violation';

interface MonetaryProps {
	value: number;
}

export class Monetary extends ValueObject<MonetaryProps> {
	get value(): number {
		return this.props.value;
	}

	private set value(value: number) {
		this.props.value = value;
	}

	public add(value: Monetary) {
		this.value += value.value;
	}

	public subtract(value: Monetary) {
		this.value -= value.value;
	}

	private constructor(props: MonetaryProps) {
		super(props);
	}

	public static create(value: number): Either<Violation, Monetary> {
		if (value < 0) {
			return left(new InvalidFormatViolation());
		}

		return right(new Monetary({ value }));
	}
}
