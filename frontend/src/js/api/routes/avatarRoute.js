import { getRequest } from "../utils/getRequest.js";

function profileResponseHandler(response) {
}

function profileErrorHandler(error) {
}

export function avatarRequest(responseHandler=profileResponseHandler, errorHandler=profileErrorHandler) {
    getRequest({
        UrlPath: "/api/user/available-avatars/",
        responseHandler,
        errorHandler
    })
}