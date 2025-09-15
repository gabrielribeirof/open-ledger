import type { ViolationCode } from './violation-code'

export abstract class Violation {
	constructor(
		public readonly code: ViolationCode,
		public readonly message: string,
	) {}
}
