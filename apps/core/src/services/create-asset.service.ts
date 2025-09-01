import { Inject } from '@nestjs/common'

import { Asset } from '@/domain/asset/asset'
import { AssetCode } from '@/domain/asset/asset-code'
import { AssetName } from '@/domain/asset/asset-name'
import { ASSET_REPOSITORY_TOKEN, IAssetRepository } from '@/domain/asset/iasset.repository'
import { AlreadyExistsError } from '@/shared/domain/_errors/already-exists.error'
import { InvalidParametersError } from '@/shared/domain/_errors/invalid-parameters.error'

interface CreateAssetServiceInput {
	name: string
	code: string
}

export class CreateAssetService {
	constructor(
		@Inject(ASSET_REPOSITORY_TOKEN)
		private readonly assetRepository: IAssetRepository,
	) {}

	async execute(input: CreateAssetServiceInput): Promise<Asset> {
		const name = AssetName.create({ value: input.name })
		const code = AssetCode.create({ value: input.code })

		if (name.isLeft() || code.isLeft()) {
			throw new InvalidParametersError({
				name: name.isLeft() ? [name.value] : null,
				code: code.isLeft() ? [code.value] : null,
			})
		}

		const existsAssetWithSameCode = await this.assetRepository.findByCode(code.value.value)

		if (existsAssetWithSameCode) throw new AlreadyExistsError()

		const asset = Asset.create({ name: name.value, code: code.value })

		await this.assetRepository.save(asset)

		return asset
	}
}
