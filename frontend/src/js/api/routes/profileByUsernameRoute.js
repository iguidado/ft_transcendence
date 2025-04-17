import { getRequest } from "../utils/getRequest"

function usersResponseHandler(response) {
	console.log(response)
}

function usersErrorHandler(error) {
	console.log(error)
}

export async function profileByUsernameRoute(username, responseHandler=usersResponseHandler, errorHandler=usersErrorHandler) {
	console.log("YUUUU", username)
	await getRequest({
		UrlPath: "/api/user/"+username+"/profile/",
		responseHandler,
		errorHandler
	})
}