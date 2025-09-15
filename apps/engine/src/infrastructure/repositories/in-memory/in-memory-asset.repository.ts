import type { Asset } from '@/domain/asset/asset'
import type { IAssetRepository } from '@/domain/asset/iasset.repository'

export class InMemoryAssetRepository implements IAssetRepository {
	public assets = new Map<string, Asset>()

	async findByCode(code: string): Promise<Asset | null> {
		return this.assets.get(code) ?? null
	}

	async save(asset: Asset): Promise<void> {
		this.assets.set(asset.code.value, asset)
	}
}
