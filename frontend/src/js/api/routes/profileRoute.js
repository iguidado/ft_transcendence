import { getRequest } from "../utils/getRequest.js";

function profileResponseHandler(response) {
	console.log(response);
}

function profileErrorHandler(error) {
	console.log(error);
}

export function profileRequest(
	responseHandler = profileResponseHandler,
	errorHandler = profileErrorHandler,
	token = null
) {
	getRequest({
		UrlPath: "/api/user/profile/",
		responseHandler,
		errorHandler,
		token
	});
}
