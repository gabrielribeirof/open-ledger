import { ValueObject } from '../../shared/seedwork/value-object';
import { InvalidFormatViolation } from '../domain/errors/violations/invalid-format.violation';
import { Either, left, right } from '../lib/either';
import { Violation } from '../seedwork/violation';

interface MonetaryProps {
	value: number;
}

export class Monetary extends ValueObject<MonetaryProps> {
	public static readonly MAX_VALUE = 9999999999999.99;

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

	get toCents(): number {
		const stringifyValue = this.value.toString();

		return parseInt(stringifyValue.replace('.', ''));
	}

	private static hasUpToTwoDecimals(value: number) {
		const parts = value.toString().split('.');

		if (parts.length === 1) return true;

		return parts[1].length <= 2;
	}

	private constructor(props: MonetaryProps) {
		super(props);
	}

	public static create(value: number): Either<Violation, Monetary> {
		if (value > this.MAX_VALUE) {
			return left(new InvalidFormatViolation());
		}

		if (!this.hasUpToTwoDecimals(value)) {
			return left(new InvalidFormatViolation());
		}

		return right(new Monetary({ value }));
	}
}
