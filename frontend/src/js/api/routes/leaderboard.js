import { getRequest } from "../utils/getRequest.js"

function leaderboardResponseHandler(response) {
}

function leaderboardErrorHandler(error) {
}

export function leaderboardRequest(responseHandler=leaderboardResponseHandler, errorHandler=leaderboardErrorHandler) {
	getRequest({
		UrlPath: "/api/leaderboard/",
		responseHandler,
		errorHandler
	})
}