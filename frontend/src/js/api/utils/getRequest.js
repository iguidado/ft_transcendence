import { getApiConfigGet } from "../config/apiConfig.js"

function responseHandlerDefault(res) {
}

function errorHandlerDefault(err) {
}

export async function getRequest({
    UrlPath = "",
    responseHandler = responseHandlerDefault,
    errorHandler = errorHandlerDefault,
    config,
    token = null
}) {
    if (!config)
        config = getApiConfigGet(token)
    try {
        const requestOptions = {
            ...config.fetchOptions,
            headers: {
                ...config.fetchOptions.headers,
            },
        }
        const response = await fetch(config.url + UrlPath, requestOptions).catch(() => {
        })

        if (!response || !response.ok) {
            const errorData = await response?.json().catch(() => ({}))
            let error = new Error(errorData.message || `Request failed with status ${response?.status}`)
            errorHandler(error, response)
            return null
        }

        const data = await response.json()
        responseHandler(data)
        return data

    } catch (error) {
        errorHandler(error)
        return null
    }
}
