import { getApiConfigPatchAvatar } from "../config/apiConfig.js"

function responseHandlerDefault(res) {
    console.log(res)
}

function errorHandlerDefault(err) {
}

export async function patchAvatar({
    UrlPath="",
    responseHandler=responseHandlerDefault,
    errorHandler=errorHandlerDefault,
    config,
    body
}) {
    if (!config)
        config = getApiConfigPatchAvatar()
    try {
        // On ne veut pas créer nous-mêmes le FormData, mais utiliser celui qu'on nous passe
        const formData = new FormData();
        
        // Ajouter le fichier avec la clé 'avatar' (comme attendu par le backend)
        formData.append('avatar', body.file);

        const requestOptions = {
            method: 'PATCH',
            // IMPORTANT: Ne pas inclure de Content-Type ici - le navigateur le définira automatiquement
            headers: {
                'Authorization': config.fetchOptions.headers.Authorization,
                // Ne pas définir Content-Type pour un FormData
            },
            body: formData,
        }
        
        const response = await fetch(config.url+UrlPath, requestOptions)
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorJson;
            try {
                errorJson = JSON.parse(errorText);
            } catch (e) {
                errorJson = { detail: errorText };
            }
            throw new Error(errorJson.detail || `Request failed with status ${response.status}`);
        }
        
        return responseHandler(response)
    } catch (error) {
        return errorHandler(error)
    }
}
