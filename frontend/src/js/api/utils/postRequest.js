import { getApiConfigPost } from "../config/apiConfig";

function responseHandlerDefault(res) {
	console.log(res);
}

function errorHandlerDefault(err) {
	console.error(err);
}

export async function postRequest({
	UrlPath = "",
	body,
	responseHandler = responseHandlerDefault,
	errorHandler = errorHandlerDefault,
	config,
}) {
	if (!config) config = getApiConfigPost();
	try {
		const requestOptions = {
			...config.fetchOptions,
			headers: {
				...config.fetchOptions.headers,
			},
			body: JSON.stringify(body),
		};
		const response = await fetch(config.url + UrlPath, requestOptions)
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			let error =  new Error(errorData.message || `Request failed with status ${response.status}`)
			errorHandler(error, response)
			return
		}
		const data = await response.json();
		responseHandler(data);
	} catch (error) {
		errorHandler(error);
	}
}
