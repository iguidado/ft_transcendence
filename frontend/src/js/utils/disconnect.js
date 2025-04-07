import { load_page } from "../router.js";
import { deleteProfileData } from "./profileUtils.js";
import { saveAccessToken } from "./saveAccessToken.js";

export function disconnect() {
	deleteProfileData()
	saveAccessToken(null, null)
	load_page("login")
}