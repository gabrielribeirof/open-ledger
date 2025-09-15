import { Asset } from '@/domain/asset/asset'
import { AssetCode } from '@/domain/asset/asset-code'
import { AssetName } from '@/domain/asset/asset-name'
import { AssetEntity } from '@/infrastructure/typeorm/entities/asset.entity'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

import type { AssetDTO } from '../dtos/entities/asset.dto'

export class AssetMapper {
	static toDTO(asset: Asset): AssetDTO {
		return {
			id: asset.id.value,
			name: asset.name.value,
			code: asset.code.value,
		}
	}

	static toDomain(entity: AssetEntity): Asset {
		const id = UniqueIdentifier.create(entity.id).getRight()
		const name = AssetName.create({ value: entity.name }).getRight()
		const code = AssetCode.create({ value: entity.code }).getRight()

		return Asset.create(
			{
				name,
				code,
			},
			id,
		)
	}

	static toPersistence(asset: Asset): AssetEntity {
		const entity = new AssetEntity()
		entity.id = asset.id.value
		entity.name = asset.name.value
		entity.code = asset.code.value
		return entity
	}
}
