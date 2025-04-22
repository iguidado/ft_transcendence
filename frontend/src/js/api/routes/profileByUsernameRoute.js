import { getRequest } from "../utils/getRequest.js"

function usersResponseHandler(response) {
}

function usersErrorHandler(error) {
}

export async function profileByUsernameRoute(username, responseHandler=usersResponseHandler, errorHandler=usersErrorHandler) {
	return await getRequest({
		UrlPath: "/api/user/"+username+"/profile/",
		responseHandler,
		errorHandler
	})
}