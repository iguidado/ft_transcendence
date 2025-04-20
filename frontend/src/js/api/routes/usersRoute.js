import { getRequest } from "../utils/getRequest.js"

function usersResponseHandler(response) {
	console.log(response)
}

function usersErrorHandler(error) {
	console.log(error)
}

export function usersListRequest(responseHandler=usersResponseHandler, errorHandler=usersErrorHandler) {
	getRequest({
		UrlPath: "/api/users/",
		responseHandler,
		errorHandler
	})
}