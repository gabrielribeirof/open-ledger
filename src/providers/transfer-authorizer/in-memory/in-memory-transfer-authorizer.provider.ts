import { ITransferAuthorizerProvider } from '../itransfer-authorizer.provider';

export class InMemoryTransferAuthorizerProvider
	implements ITransferAuthorizerProvider
{
	constructor(private mockedResult = true) {}

	async execute(): Promise<boolean> {
		return this.mockedResult;
	}
}
