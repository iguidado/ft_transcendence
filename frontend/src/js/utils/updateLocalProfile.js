import { load_page } from "../router"
import { pullProfile } from "./profileUtils"
import { saveAccessToken } from "./saveAccessToken"

export function updateLocalProfile(res) {
	saveAccessToken(res.access_token, res.refresh_token)
	pullProfile()
		.then(() => {
			load_page("profile")
		})
}