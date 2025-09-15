import type { ErrorCode } from './error-code'

export class Error {
	constructor(public code: ErrorCode) {}
}
