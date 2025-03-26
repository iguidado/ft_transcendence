import { postRequest } from "../utils/postRequest";

function registerResponseHandler(response) {
	console.log(response)
}

function registerErrorHandler(error) {
	console.log(error)
}

export function registerRequest({login, email, password, confirmPassword}, responseHandler=registerResponseHandler, errorHandler=registerErrorHandler) {
	console.log("TEST")
	postRequest({
		UrlPath: "/api/register/",
		body: {login, email, password, confirmPassword},
		responseHandler,
		errorHandler
	})
}
