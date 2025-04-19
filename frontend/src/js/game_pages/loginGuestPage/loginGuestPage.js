import { loadLoginPage } from "../../login.js"
import { fetchHTMLContent, load_page } from "../../router.js"
import { getProfileData } from "../../utils/profileUtils.js"
import { updateLocalProfile } from "../../utils/updateLocalProfile.js"
import { addGuestProfileToStore } from "./utils/addGuestProfileToStore.js"
import { getProfileFromToken } from "./utils/getProfileFromToken.js"

export const loginGuestPage = async () => {
	return new Promise((resolve) => {
		const onLoginSuccess = res => {
			if (!getProfileData()) {
				updateLocalProfile(res)
			} else {
				getProfileFromToken(res.access_token).then(profile => {
					profile.access_token = res.access_token
					addGuestProfileToStore(profile, console.error)
					resolve(true)
				})
			}
		}
		fetchHTMLContent("login").then(htmlContent => {
			const app = document.getElementById('main_container')
			app.innerHTML = htmlContent
			load_page("login", onLoginSuccess)
		})
	})
}
