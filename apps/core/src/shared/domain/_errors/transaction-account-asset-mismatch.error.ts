import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class TransactionAccountAssetMismatchError extends Error {
	constructor() {
		super(ErrorCode.TRANSACTION_ACCOUNT_ASSET_MISMATCH)
	}
}
