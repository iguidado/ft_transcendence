export const apiConfigDefault = {
	url: 'http://127.0.0.1:8080',
	fetchOptions: {
		credentials: 'include',
		defaultHeaders: {
			'Content-Type': 'application/json',
		}
	}
}

export const apiConfigPost = {
	...apiConfigDefault,
	fetchOptions: {
		...apiConfigDefault.fetchOptions,
		method: 'POST'
	}
}