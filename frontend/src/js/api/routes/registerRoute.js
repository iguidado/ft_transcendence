import { postRequest } from "../utils/postRequest.js";


function registerResponseHandler(response) {
	console.log(response)
}

function registerErrorHandler(error) {
	console.log(error)
}

export function registerRequest({username, password, confirm_password}, responseHandler=registerResponseHandler, errorHandler=registerErrorHandler) {
	postRequest({
		UrlPath: "/api/register/",
		body: {username, password, confirm_password},
		responseHandler,
		errorHandler
	})
}
