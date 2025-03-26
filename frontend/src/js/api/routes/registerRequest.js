import { postRequest } from "../utils/postRequest";

function registerResponseHandler(response) {
	console.log(response)
}

function registerErrorHandler(error) {
	console.log(error)
}

export function registerRequest({username, email, password, confirm_password}, responseHandler=registerResponseHandler, errorHandler=registerErrorHandler) {
	console.log({username, email, password, confirm_password})
	postRequest({
		UrlPath: "/api/register/",
		body: {username, email, password, confirm_password},
		responseHandler,
		errorHandler
	})
}
