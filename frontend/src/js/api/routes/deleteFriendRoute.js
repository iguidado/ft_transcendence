import { postRequest } from "../utils/postRequest.js";

function deleteFriendResponseHandler(response) {
    console.log("Friend deleted successfully:", response);
}

function deleteFriendErrorHandler(error) {
    console.error("Error while deleting friend:", error);
}

//TODO Lauryn jai fait ca pour delete si tu peux creer une route delete? :)

export function deleteFriendRequest({username}, responseHandler=deleteFriendResponseHandler, errorHandler=deleteFriendErrorHandler) {
    postRequest({
        UrlPath: "/api/user/friends/delete/",
        body: {username},
        responseHandler,
        errorHandler
    });
}