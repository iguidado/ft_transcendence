import { loadLoginPage } from "../../login.js"
import { fetchHTMLContent } from "../../router.js"
import { getProfileData } from "../../utils/profileUtils.js"
import { updateLocalProfile } from "../../utils/updateLocalProfile.js"
import { addGuestProfileToStore } from "./utils/addGuestProfileToStore.js"
import { getProfileFromToken } from "./utils/getProfileFromToken.js"

export const loginGuestPage = async (successHandler = console.log, errorHandler = (error) => {}) => {
	return new Promise((resolve) => {
		fetchHTMLContent("login").then(htmlContent => {
			const app = document.getElementById('main_container')
			app.innerHTML = htmlContent
			loadLoginPage(res => {
				if (!getProfileData()) {
					updateLocalProfile(res)
				} else {
					getProfileFromToken(res.access_token).then(profile => {
						profile.access_token = res.access_token
						addGuestProfileToStore(profile, errorHandler)
						resolve(true)
					})
				}
			})
		})
	})
}
