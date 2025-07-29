import { HttpService } from '@nestjs/axios'
import { Logger } from '@nestjs/common'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export abstract class HttpClient {
	constructor(
		private readonly _logger: Logger,
		public readonly httpService: HttpService,
		public readonly baseUrl: string,
	) {
		this.httpService.axiosRef.defaults.baseURL = this.baseUrl
		this.httpService.axiosRef.interceptors.request.use(
			(request) => this.logRequest(request),
			(error) => this.logError(error),
		)
		this.httpService.axiosRef.interceptors.response.use(
			(response) => this.logResponse(response),
			(error) => this.logError(error),
		)
	}

	private logRequest(request: InternalAxiosRequestConfig) {
		this._logger.log({
			status: 'request',
		})

		return request
	}

	private logResponse(response: AxiosResponse) {
		this._logger.log({
			status: 'response',
			metadata: {
				url: response.config.url,
				status: response.status,
				headers: response.headers,
				data: response.data,
			},
		})

		return response
	}

	private logError(error: AxiosError) {
		this._logger.error({
			status: 'error',
			metadata: {
				message: error.message,
				method: error.config?.method,
				url: error.config?.url,
				status: error.response?.status,
				headers: error.response?.headers,
				data: error.response?.data,
			},
		})

		throw error
	}
}
