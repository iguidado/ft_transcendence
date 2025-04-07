import { patchRequest } from "../../utils/patchRequest.js"

function toggle2faResponseHandler(response) {
	console.log(response)
}

function toggle2faErrorHandler(error) {
	console.log(error)
}

export function verifyEmailOTP(otp, responseHandler=toggle2faResponseHandler, errorHandler=toggle2faErrorHandler) {
	patchRequest({
		UrlPath: "/api/user/verify-email-otp/",
		body: {otp},
		responseHandler,
		errorHandler
	})
}
