import { load_page } from "../router";
import { deleteProfileData } from "./profileUtils";
import { saveAccessToken } from "./saveAccessToken";

export function disconnect() {
	deleteProfileData()
	saveAccessToken(null, null)
	load_page("login")
}