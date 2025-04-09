import { getRequest } from "../utils/getRequest"

function leaderboardResponseHandler(response) {
	console.log(response)
}

function leaderboardErrorHandler(error) {
	console.log(error)
}

export function leaderboardRequest(responseHandler=leaderboardResponseHandler, errorHandler=leaderboardErrorHandler) {
	getRequest({
		UrlPath: "/api/leaderboard/",
		responseHandler,
		errorHandler
	})
}