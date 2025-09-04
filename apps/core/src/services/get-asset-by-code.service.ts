import { Inject, Injectable } from '@nestjs/common'

import { ASSET_REPOSITORY_TOKEN, IAssetRepository } from '@/domain/asset/iasset.repository'
import { AssetDTO } from '@/infrastructure/http/dtos/entities/asset.dto'
import { AssetMapper } from '@/infrastructure/http/mappers/asset.mapper'
import { AssetNotFoundError } from '@/shared/domain/_errors/asset-not-found.error'

@Injectable()
export class GetAssetByCodeService {
	constructor(@Inject(ASSET_REPOSITORY_TOKEN) private readonly assetRepository: IAssetRepository) {}

	async execute(code: string): Promise<AssetDTO> {
		const asset = await this.assetRepository.findByCode(code)

		if (!asset) throw new AssetNotFoundError()

		return AssetMapper.toDTO(asset)
	}
}
