import { UniqueIdentifier } from './unique-identifier';

export class Entity<T> {
	protected readonly _id: UniqueIdentifier;
	public readonly props: T;

	get id(): UniqueIdentifier {
		return this._id;
	}

	constructor(props: T, id?: UniqueIdentifier) {
		this._id = id || new UniqueIdentifier();
		this.props = props;
	}
}
