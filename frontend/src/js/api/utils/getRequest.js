import { getApiConfigGet } from "../config/apiConfig";

function responseHandlerDefault(res) {
	console.log(res)
}

function errorHandlerDefault(err) {
	console.error(err)
}

export async function getRequest({
	UrlPath="",
	body,
	responseHandler=responseHandlerDefault,
	errorHandler=errorHandlerDefault,
	config
}) {
	if (!config)
		config = getApiConfigGet()
	try {
		// Ajouter les bons en-têtes et transformer le corps en JSON
		const requestOptions = {
			...config.fetchOptions,
			headers: {
				...config.fetchOptions.headers,
			},
		};

		console.log(config)
		const response = await fetch(config.url+UrlPath, requestOptions);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `Request failed with status ${response.status}`);
		}

		const data = await response.json();
		responseHandler(data)
		
	} catch (error) {
		errorHandler(error)
	}
}
