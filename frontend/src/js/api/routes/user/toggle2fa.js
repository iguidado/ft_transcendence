import { patchRequest } from "../../utils/patchRequest"

function toggle2faResponseHandler(response) {
	console.log(response)
}

function toggle2faErrorHandler(error) {
	console.log(error)
}

export function toggle2faRequest({action, email}, responseHandler=toggle2faResponseHandler, errorHandler=toggle2faErrorHandler) {
	patchRequest({
		UrlPath: "/api/user/2fa/update/",
		body: {action, email},
		responseHandler,
		errorHandler
	})
}
