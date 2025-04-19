import { ApiProperty } from '@nestjs/swagger';

export class TransferDTO {
	@ApiProperty()
	id!: string;
}
