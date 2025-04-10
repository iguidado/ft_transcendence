import { getRequest } from "../utils/getRequest.js";

function profileResponseHandler(response) {
	console.log(response)
}

function profileErrorHandler(error) {
	console.log(error)
}

export function avatarRequest(responseHandler=profileResponseHandler, errorHandler=profileErrorHandler) {
    getRequest({
        UrlPath: "/api/user/available-avatars/",
        responseHandler,
        errorHandler
    })
}