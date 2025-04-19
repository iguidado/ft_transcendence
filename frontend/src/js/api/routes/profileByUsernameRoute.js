import { getRequest } from "../utils/getRequest.js"

function usersResponseHandler(response) {
	console.log(response)
}

function usersErrorHandler(error) {
}

export async function profileByUsernameRoute(username, responseHandler=usersResponseHandler, errorHandler=usersErrorHandler) {
	await getRequest({
		UrlPath: "/api/user/"+username+"/profile/",
		responseHandler,
		errorHandler
	})
}