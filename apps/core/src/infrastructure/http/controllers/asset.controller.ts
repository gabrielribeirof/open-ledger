import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { CreateAssetService } from '@/services/create-asset.service'
import { GetAssetByCodeService } from '@/services/get-asset-by-code.service'
import { ApiErrorResponse } from '@/shared/lib/api-error-response'
import { ErrorCode } from '@/shared/seedwork/error-code'

import { CreateAssetDTO } from '../dtos/create-asset.dto'
import { AssetDTO } from '../dtos/entities/asset.dto'
import { AssetMapper } from '../mappers/asset.mapper'

@Controller('assets')
@ApiExtraModels(AssetDTO)
export class AssetController {
	constructor(
		private readonly createAssetService: CreateAssetService,
		private readonly getAssetByCodeService: GetAssetByCodeService,
	) {}

	@Post()
	@ApiCreatedResponse({
		schema: {
			$ref: getSchemaPath(AssetDTO),
		},
	})
	@ApiErrorResponse(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_PARAMETERS)
	@ApiErrorResponse(HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS)
	async create(@Body() body: CreateAssetDTO): Promise<AssetDTO> {
		const asset = await this.createAssetService.execute({
			name: body.name,
			code: body.code,
		})

		return AssetMapper.toDTO(asset)
	}

	@Get(':code')
	@ApiOkResponse({
		schema: {
			$ref: getSchemaPath(AssetDTO),
		},
	})
	@ApiErrorResponse(HttpStatus.NOT_FOUND, ErrorCode.ASSET_NOT_FOUND)
	async getByCode(@Param('code') code: string): Promise<AssetDTO> {
		return await this.getAssetByCodeService.execute(code)
	}
}
