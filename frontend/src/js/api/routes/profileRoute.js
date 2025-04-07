import { getRequest } from "../utils/getRequest";

function profileResponseHandler(response) {
	console.log(response)
}

function profileErrorHandler(error) {
	console.log(error)
}

export function profileRequest(responseHandler=profileResponseHandler, errorHandler=profileErrorHandler) {
	getRequest({
		UrlPath: "/api/user/profile/",
		responseHandler,
		errorHandler
	})
}