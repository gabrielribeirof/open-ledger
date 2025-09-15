import { AggregateRoot } from '@/shared/seedwork/aggregate-root'
import type { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import type { AssetCode } from './asset-code'
import type { AssetName } from './asset-name'

interface AssetProperties {
	name: AssetName
	code: AssetCode
}

export class Asset extends AggregateRoot<AssetProperties> {
	get name() {
		return this.properties.name
	}

	get code() {
		return this.properties.code
	}

	private constructor(props: AssetProperties, id?: UniqueIdentifier) {
		super(props, id)
	}

	public static create(properties: AssetProperties, id?: UniqueIdentifier): Asset {
		return new Asset(properties, id)
	}
}
