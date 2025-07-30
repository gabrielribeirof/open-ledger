import { Asset } from './asset'

export interface IAssetRepository {
	findByCode(code: string): Promise<Asset | null>
}

export const ASSET_REPOSITORY_TOKEN = 'IAssetRepository'
