import { postRequest } from "../utils/postRequest.js";


function addFriendResponseHandler(response) {
	console.log(response)
}

function addFriendErrorHandler(error) {
	console.log(error)
}

export function addFriendRequest({username}, responseHandler=addFriendResponseHandler, errorHandler=addFriendErrorHandler) {
	postRequest({
		UrlPath: "/api/user/friends/add/",
		body: {username},
		responseHandler,
		errorHandler
	})
}
