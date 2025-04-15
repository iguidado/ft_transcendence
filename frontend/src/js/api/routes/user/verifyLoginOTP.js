import { patchRequest } from "../../utils/patchRequest.js"

function toggle2faResponseHandler(response) {
	console.log(response)
}

function toggle2faErrorHandler(error) {
	console.log(error)
}

export function verifyLoginOTP(body, responseHandler=toggle2faResponseHandler, errorHandler=toggle2faErrorHandler) {
	patchRequest({
		UrlPath: "/api/user/verify-login-otp/",
		body: body,
		responseHandler,
		errorHandler
	})
}
