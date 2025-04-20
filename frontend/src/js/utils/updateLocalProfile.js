import { load_page } from "../router.js"
import { pullProfile } from "./profileUtils.js"
import { saveAccessToken } from "./saveAccessToken.js"

export function updateLocalProfile(res) {
	saveAccessToken(res.access_token, res.refresh_token)
	pullProfile()
		.then(() => {
			load_page("profile")
		})
}