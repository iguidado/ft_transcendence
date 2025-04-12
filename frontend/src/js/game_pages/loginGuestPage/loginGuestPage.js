import { loadLoginPage } from "../../login"
import { fetchHTMLContent } from "../../router"
import { getProfileData } from "../../utils/profileUtils"
import { updateLocalProfile } from "../../utils/updateLocalProfile"
import { getProfileFromToken } from "./utils/getProfileFromToken"

export const loginGuestPage = async (successHandler=console.log, errorHandler=console.error) => {
	return new Promise((resolve) => {
		fetchHTMLContent("login").then(htmlContent => {
			const app = document.getElementById('main_container')
			app.innerHTML = htmlContent
			loadLoginPage(res => {
				if (!getProfileData()) {
					updateLocalProfile()
					loginGuestPage(successHandler, errorHandler).then((status) => {
						resolve(status)
					})
				} else {
					getProfileFromToken(res.access_token).then(console.log)
					resolve(true)
				}
			})
		})
	})
}
