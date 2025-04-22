import { getRequest } from "../utils/getRequest.js"

function usersResponseHandler(response) {
}

function usersErrorHandler(error) {
}

export function usersListRequest(responseHandler=usersResponseHandler, errorHandler=usersErrorHandler) {
	getRequest({
		UrlPath: "/api/users/",
		responseHandler,
		errorHandler
	})
}