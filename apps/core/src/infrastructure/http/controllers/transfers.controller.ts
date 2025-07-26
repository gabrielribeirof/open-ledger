import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransferService } from '@/services/create-transfer.service';
import { TransferMapper } from '../mappers/transfer-mapper';
import { CreateTransferDTO } from '../dtos/create-transfer.dto';
import {
	ApiCreatedResponse,
	ApiExtraModels,
	getSchemaPath,
} from '@nestjs/swagger';
import { TransferDTO } from '../dtos/entities/transfer.dto';

@Controller('transfers')
@ApiExtraModels(TransferDTO)
export class TransfersController {
	constructor(private createTransferService: CreateTransferService) {}

	@Post()
	@ApiCreatedResponse({
		schema: {
			$ref: getSchemaPath(TransferDTO),
		},
	})
	async create(@Body() body: CreateTransferDTO) {
		const transfer = await this.createTransferService.execute({
			amount: body.amount,
			origin_id: body.origin_id,
			target_id: body.target_id,
		});

		return TransferMapper.toDTO(transfer);
	}
}
