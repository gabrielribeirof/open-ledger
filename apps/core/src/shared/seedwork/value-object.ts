interface ValueObjectProperties {
	[index: string]: any
}

export abstract class ValueObject<T extends ValueObjectProperties> {
	constructor(public props: T) {}

	public equals(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false
		}

		return JSON.stringify(this.props) === JSON.stringify(vo.props)
	}
}
