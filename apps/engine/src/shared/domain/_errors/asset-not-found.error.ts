import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class AssetNotFoundError extends Error {
	constructor() {
		super(ErrorCode.ASSET_NOT_FOUND)
	}
}
