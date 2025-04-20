import { load_page } from "../router.js";
import { deleteProfileData } from "./profileUtils.js";
import { saveAccessToken } from "./saveAccessToken.js";
import { closeWebSocketConnection } from "./webSocketManager.js"

export function disconnect() {
	closeWebSocketConnection()
	deleteProfileData()
	saveAccessToken(null, null)
	load_page("login")
}