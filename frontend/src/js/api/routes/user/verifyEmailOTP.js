import { patchRequest } from "../../utils/patchRequest.js"

function toggle2faResponseHandler(response) {
}

function toggle2faErrorHandler(error) {
}

export function verifyEmailOTP(otp, responseHandler=toggle2faResponseHandler, errorHandler=toggle2faErrorHandler) {
	patchRequest({
		UrlPath: "/api/user/verify-email-otp/",
		body: {otp},
		responseHandler,
		errorHandler
	})
}
