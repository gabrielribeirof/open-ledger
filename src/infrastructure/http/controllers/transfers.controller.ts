import { Body, Controller, Post } from '@nestjs/common';
import { CreateP2PTransferService } from '@/services/create-p2p-transfer.service';
import { TransferMapper } from '../mappers/transfer-mapper';
import { CreateTransferDTO } from '../dtos/create-transfer.dto';

@Controller('transfers')
export class TransfersController {
	constructor(private createP2PTransferService: CreateP2PTransferService) {}

	@Post()
	async create(@Body() body: CreateTransferDTO) {
		const transferOrError = await this.createP2PTransferService.execute({
			amount: body.amount,
			origin_id: body.origin_id,
			target_id: body.target_id,
		});

		if (transferOrError.isLeft()) throw transferOrError.value;

		return TransferMapper.toDTO(transferOrError.value);
	}
}
