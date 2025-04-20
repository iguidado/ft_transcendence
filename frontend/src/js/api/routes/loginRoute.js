import { postRequest } from "../utils/postRequest.js";

function loginResponseHandler(response) {
	console.log(response)
}

function loginErrorHandler(error) {
	console.log(error)
}

export function loginRequest({username, password}, responseHandler=loginResponseHandler, errorHandler=loginErrorHandler) {
	postRequest({
		UrlPath: "/api/login/",
		body: {username, password},
		responseHandler,
		errorHandler
	})
}
