import { Asset } from '@/domain/asset/asset'

import { AssetDTO } from '../dtos/entities/asset.dto'

export class AssetMapper {
	static toDTO(asset: Asset): AssetDTO {
		return {
			id: asset.id.value,
			name: asset.name.value,
			code: asset.code.value,
		}
	}
}
