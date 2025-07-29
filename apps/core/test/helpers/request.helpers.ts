import axios from 'axios'

export function request() {
	return axios.create({
		baseURL: 'http://account-web-api:3000',
	})
}
