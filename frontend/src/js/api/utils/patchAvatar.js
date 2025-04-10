import { getApiConfigPatchAvatar } from "../config/apiConfig.js"

function responseHandlerDefault(res) {
    console.log(res)
}

function errorHandlerDefault(err) {
    console.error(err)
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
        formData.append('file', body.file);

        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization': config.fetchOptions.headers.Authorization,
            },
            body: formData,
        }
        
        const response = await fetch(config.url+UrlPath, requestOptions)
        return responseHandler(response)
    } catch (error) {
        return errorHandler(error)
    }
}
