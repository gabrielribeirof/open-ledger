import { ValueObject } from '../../shared/seedwork/value-object';

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

	public static create(value: number) {
		return new Monetary({ value });
	}
}
