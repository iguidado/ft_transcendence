import { patchRequest } from "../utils/patchRequest.js"

function updateDisplayNameResponseHandler(response) {
    console.log(response)
}

function updateDisplayNameErrorHandler(error) {
    console.error(error)
}

export function updateDisplayNameRequest(newDisplayName, responseHandler=updateDisplayNameResponseHandler, errorHandler=updateDisplayNameErrorHandler) {
    patchRequest({
        UrlPath: "/api/user/profile/update_displayname/",
        body: { display_name: newDisplayName },
        responseHandler,
        errorHandler
    })
}