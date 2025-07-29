import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class TransferAuthorizerProviderError extends Error {
	constructor() {
		super(ErrorCode.TRANSFER_AUTHORIZER_PROVIDER_ERROR)
	}
}
