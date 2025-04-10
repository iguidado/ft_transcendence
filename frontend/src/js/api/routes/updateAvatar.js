import { patchAvatar } from "../utils/patchAvatar.js"

function toggle2faResponseHandler(response) {
    console.log(response)
}

function toggle2faErrorHandler(error) {
    console.log(error)
}



export function updateAvatarRequest(avatarCode, responseHandler=toggle2faResponseHandler, errorHandler=toggle2faErrorHandler) {
    console.log("avatarCode :", avatarCode)
    patchAvatar({
        UrlPath: "/api/user/profile/update_avatar/",
        body: {avatar : avatarCode},
        responseHandler,
        errorHandler
    })
}