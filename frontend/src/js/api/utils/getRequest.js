import { getApiConfigGet } from "../config/apiConfig.js"

function responseHandlerDefault(res) {
	console.log(res)
}

function errorHandlerDefault(err) {
}

export async function getRequest({
	UrlPath="",
	responseHandler=responseHandlerDefault,
	errorHandler=errorHandlerDefault,
	config,
	token=null
}) {
	if (!config)
		config = getApiConfigGet(token)
	try {
		// Ajouter les bons en-têtes et transformer le corps en JSON
		const requestOptions = {
			...config.fetchOptions,
			headers: {
				...config.fetchOptions.headers,
			},
		}
		const response = await fetch(config.url+UrlPath, requestOptions)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			let error =  new Error(errorData.message || `Request failed with status ${response.status}`)
			errorHandler(error, response)
			return
		}

		const data = await response.json()
		responseHandler(data)
		
	} catch (error) {
		errorHandler(error)
	}
}
