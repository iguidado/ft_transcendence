import { postRequest } from "../utils/postRequest.js";


function addFriendResponseHandler(response) {
}

function addFriendErrorHandler(error) {
}

export async function addFriendRequest({username}, responseHandler=addFriendResponseHandler, errorHandler=addFriendErrorHandler) {
	return postRequest({
		UrlPath: "/api/user/friends/add/",
		body: {username},
		responseHandler,
		errorHandler
	})
}


