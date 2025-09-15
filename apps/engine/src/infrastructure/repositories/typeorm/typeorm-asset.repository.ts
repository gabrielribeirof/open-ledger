import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Asset } from '@/domain/asset/asset'
import { IAssetRepository } from '@/domain/asset/iasset.repository'
import { AssetMapper } from '@/infrastructure/http/mappers/asset.mapper'
import { AssetEntity } from '@/infrastructure/typeorm/entities/asset.entity'

export class TypeORMAssetRepository implements IAssetRepository {
	constructor(
		@InjectRepository(AssetEntity)
		public assetRepository: Repository<AssetEntity>,
	) {}

	async findByCode(code: string): Promise<Asset | null> {
		const entity = await this.assetRepository.findOne({ where: { code } })
		return entity ? AssetMapper.toDomain(entity) : null
	}

	async save(asset: Asset): Promise<void> {
		const entity = AssetMapper.toPersistence(asset)
		await this.assetRepository.save(entity)
	}
}
