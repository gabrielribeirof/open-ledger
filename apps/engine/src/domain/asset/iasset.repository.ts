import type { Asset } from './asset'

export interface IAssetRepository {
	findByCode(code: string): Promise<Asset | null>
	save(asset: Asset): Promise<void>
}

export const ASSET_REPOSITORY_TOKEN = 'IAssetRepository'
