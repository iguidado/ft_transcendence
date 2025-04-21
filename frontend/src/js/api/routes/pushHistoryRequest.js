import { postRequest } from "../utils/postRequest.js";

function pushHistoryResponseHandler(response) {
	console.log(response)
}

function pushHistoryErrorHandler(error) {
	console.log(error)
}

export async function pushHistoryRequest(body, responseHandler=pushHistoryResponseHandler, errorHandler=pushHistoryErrorHandler) {
	return postRequest({
		UrlPath: "/api/users/create-match-history/",
		body,
		responseHandler,
		errorHandler
	})
}
