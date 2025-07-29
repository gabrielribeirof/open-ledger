interface ValueObjectProperties {
	[index: string]: any
}

export abstract class ValueObject<T extends ValueObjectProperties> {
	constructor(public properties: T) {}

	public equals(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false
		}

		return JSON.stringify(this.properties) === JSON.stringify(vo.properties)
	}
}
