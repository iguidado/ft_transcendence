import { getApiConfigPatchAvatar } from "../config/apiConfig.js"

function responseHandlerDefault(res) {
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
        const formData = new FormData();
        
        formData.append('avatar', body.file);

        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization': config.fetchOptions.headers.Authorization,
            },
            body: formData,
        }
        
        const response = await fetch(config.url+UrlPath, requestOptions).catch(err => {})
        
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
