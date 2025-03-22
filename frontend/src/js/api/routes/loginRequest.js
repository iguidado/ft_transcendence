import { postRequest } from "../utils/postRequest";

function loginResponseHandler(response) {
	console.log(response)
}

function loginErrorHandler(error) {
	console.log(error)
}

export function loginRequest({email, password}, responseHandler=loginResponseHandler, errorHandler=loginErrorHandler) {
	console.log("TEST")
	postRequest({
		UrlPath: "/api/login/",
		body: {email, password},
		responseHandler,
		errorHandler
	})
}
