import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger'

import { CreateTransactionService } from '@/services/create-transaction.service'
import { ApiErrorResponse } from '@/shared/lib/api-error-response'
import { ErrorCode } from '@/shared/seedwork/error-code'

import { CreateTransactionDTO } from '../dtos/create-transaction.dto'
import { OperationDTO } from '../dtos/entities/operation.dto'
import { TransactionDTO } from '../dtos/entities/transaction.dto'
import { TransactionMapper } from '../mappers/transaction.mapper'

@Controller('transactions')
@ApiExtraModels(TransactionDTO)
@ApiExtraModels(OperationDTO)
export class TransactionController {
	constructor(private readonly createTransactionService: CreateTransactionService) {}

	@Post()
	@ApiCreatedResponse({
		schema: {
			$ref: getSchemaPath(TransactionDTO),
		},
	})
	@ApiErrorResponse(HttpStatus.NOT_FOUND, ErrorCode.ASSET_NOT_FOUND)
	@ApiErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.TRANSACTION_AMBIGUOUS_ACCOUNT)
	@ApiErrorResponse(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_PARAMETERS)
	async create(@Body() body: CreateTransactionDTO) {
		const transaction = await this.createTransactionService.execute({
			asset_code: body.asset_code,
			value: body.value,
			scale: body.scale,
			sources: body.sources,
			targets: body.targets,
		})

		return TransactionMapper.toDTO(transaction)
	}
}
