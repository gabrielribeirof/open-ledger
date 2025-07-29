import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class ProviderNotFoundError extends Error {
	constructor() {
		super(ErrorCode.PROVIDER_NOT_FOUND)
	}
}
