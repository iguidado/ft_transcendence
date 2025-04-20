import { postRequest } from "../utils/postRequest.js";

function deleteFriendResponseHandler(response) {
    console.log("Friend deleted successfully:", response);
}

function deleteFriendErrorHandler(error) {
}

export async function deleteFriendRequest({username}, responseHandler=deleteFriendResponseHandler, errorHandler=deleteFriendErrorHandler) {
    return postRequest({
        UrlPath: "/api/user/friends/remove/",
        body: {username},
        responseHandler,
        errorHandler
    });
}