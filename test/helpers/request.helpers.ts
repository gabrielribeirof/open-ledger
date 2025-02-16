import axios from 'axios';

export function request() {
	return axios.create({
		baseURL: 'http://wallet-web-api:3000',
	});
}
