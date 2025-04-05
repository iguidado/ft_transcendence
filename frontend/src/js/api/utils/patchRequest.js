import { getApiConfigPatch } from "../config/apiConfig"

function responseHandlerDefault(res) {
	console.log(res)
}

function errorHandlerDefault(err) {
	console.error(err)
}

export async function patchRequest({
	UrlPath="",
	responseHandler=responseHandlerDefault,
	errorHandler=errorHandlerDefault,
	config,
	body
}) {
	if (!config)
		config = getApiConfigPatch()
	try {
		const requestOptions = {
			...config.fetchOptions,
			headers: {
				...config.fetchOptions.headers,
			},
			body: JSON.stringify(body),
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
