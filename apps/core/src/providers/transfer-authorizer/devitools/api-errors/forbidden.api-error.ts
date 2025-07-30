import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'

import {
	DevitoolsAuthorizeResponse,
	devitoolsAuthorizeResponseSchema,
} from '../schemas/devitools-authorize-response.schema'

export class ForbiddenApiError {
	constructor(private error: AxiosError) {}

	static canHandle(error: Error): error is AxiosError {
		return !!(isAxiosError(error) && error.response && error.response.status === HttpStatusCode.Forbidden)
	}

	response(): DevitoolsAuthorizeResponse {
		return devitoolsAuthorizeResponseSchema.parse(this.error.response?.data)
	}
}
