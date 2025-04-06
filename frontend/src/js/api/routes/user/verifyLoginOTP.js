import { patchRequest } from "../../utils/patchRequest"

function toggle2faResponseHandler(response) {
	console.log(response)
}

function toggle2faErrorHandler(error) {
	console.log(error)
}

export function verifyLoginOTP(otp, responseHandler=toggle2faResponseHandler, errorHandler=toggle2faErrorHandler) {
	patchRequest({
		UrlPath: "/api/user/verify-login-otp/",
		body: {otp},
		responseHandler,
		errorHandler
	})
}
