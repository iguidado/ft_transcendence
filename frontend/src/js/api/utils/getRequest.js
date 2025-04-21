import { getApiConfigGet } from "../config/apiConfig.js"

function responseHandlerDefault(res) {
    // Logiquement, vous pouvez gérer la réponse ici si nécessaire
}

function errorHandlerDefault(err) {
    // Ne rien afficher dans la console pour les erreurs par défaut
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
            // Ignorer les erreurs de réseau ici
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
        // Appeler le gestionnaire d'erreurs sans afficher dans la console
        errorHandler(error)
        return null
    }
}
