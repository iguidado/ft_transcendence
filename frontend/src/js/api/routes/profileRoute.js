import { getRequest } from "../utils/getRequest.js";

function profileResponseHandler(response) {
}

function profileErrorHandler(error) {
}

export async function profileRequest(
	responseHandler = profileResponseHandler,
	errorHandler = profileErrorHandler,
	token = null
) {
	return getRequest({
		UrlPath: "/api/user/profile/",
		responseHandler,
		errorHandler,
		token
	});
}
