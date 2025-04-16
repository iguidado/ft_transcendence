import { postRequest } from "../utils/postRequest.js";

function deleteFriendResponseHandler(response) {
    console.log("Friend deleted successfully:", response);
}

function deleteFriendErrorHandler(error) {
    console.error("Error while deleting friend:", error);
}

export function deleteFriendRequest({username}, responseHandler=deleteFriendResponseHandler, errorHandler=deleteFriendErrorHandler) {
    postRequest({
        UrlPath: "/api/user/friends/remove/",
        body: {username},
        responseHandler,
        errorHandler
    });
}