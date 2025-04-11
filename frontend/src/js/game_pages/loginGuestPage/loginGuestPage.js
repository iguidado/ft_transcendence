import { loadLoginPage } from "../../login"
import { fetchHTMLContent } from "../../router"
import { getProfileFromToken } from "./utils/loginGuest"

export const loginGuestPage = (successHandler=console.log, errorHandler=console.error) => {
	fetchHTMLContent("login").then(htmlContent => {
		const app = document.getElementById('app')
		app.innerHTML = htmlContent
		loadLoginPage(res => {
			getProfileFromToken(res.access_token)
		})
	})
}
