
import { patchRequest } from "../utils/patchRequest.js"

export function updateAvatarResponseHandler(response) {
    console.log(response)
}

function updateAvatarErrorHandler(error) {
    console.log(error)
}



export function updateAvatarRequest(avatarCode, responseHandler=updateAvatarResponseHandler, errorHandler=updateAvatarErrorHandler) {
    console.log("avatarCode :", avatarCode)
    patchRequest({
        UrlPath: "/api/user/profile/update_avatar/",
        body: {avatar : avatarCode},
        responseHandler,
        errorHandler
    })
}