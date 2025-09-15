import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { CreateAccountService } from '@/services/create-account.service'
import { GetAccountByAliasService } from '@/services/get-account-by-alias.service'
import { ApiErrorResponse } from '@/shared/lib/api-error-response'
import { ErrorCode } from '@/shared/seedwork/error-code'

import { CreateAccountDTO } from '../dtos/create-account.dto'
import { AccountDTO } from '../dtos/entities/account.dto'
import { AccountMapper } from '../mappers/account.mapper'

@Controller('accounts')
@ApiExtraModels(AccountDTO)
export class AccountController {
	constructor(
		private readonly createAccountService: CreateAccountService,
		private readonly getAccountByAliasService: GetAccountByAliasService,
	) {}

	@Post()
	@ApiCreatedResponse({
		schema: {
			$ref: getSchemaPath(AccountDTO),
		},
	})
	@ApiErrorResponse(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_PARAMETERS)
	@ApiErrorResponse(HttpStatus.NOT_FOUND, ErrorCode.ASSET_NOT_FOUND)
	@ApiErrorResponse(HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS)
	async create(@Body() body: CreateAccountDTO): Promise<AccountDTO> {
		const account = await this.createAccountService.execute(body)
		return AccountMapper.toDTO(account)
	}

	@Get(':alias')
	@ApiOkResponse({
		schema: {
			$ref: getSchemaPath(AccountDTO),
		},
	})
	@ApiErrorResponse(HttpStatus.NOT_FOUND, ErrorCode.ACCOUNT_NOT_FOUND)
	async getByAlias(@Param('alias') alias: string): Promise<AccountDTO> {
		return await this.getAccountByAliasService.execute(alias)
	}
}
