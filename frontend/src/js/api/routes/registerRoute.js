import { postRequest } from "../utils/postRequest.js";


function registerResponseHandler(response) {
}

function registerErrorHandler(error) {
}

export function registerRequest({username, password, confirm_password}, responseHandler=registerResponseHandler, errorHandler=registerErrorHandler) {
	postRequest({
		UrlPath: "/api/register/",
		body: {username, password, confirm_password},
		responseHandler,
		errorHandler
	})
}
