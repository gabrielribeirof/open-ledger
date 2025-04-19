import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateTransferDTO {
	@ApiProperty()
	@IsNumber({
		maxDecimalPlaces: 2,
	})
	amount!: number;

	@ApiProperty()
	@IsUUID()
	origin_id!: string;

	@ApiProperty()
	@IsUUID()
	target_id!: string;
}
