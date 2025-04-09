import { load_page, getCurrentPageFromURL } from "./router.js"
import { getProfileData } from "./utils/profileUtils.js"

document.body.classList.add("themePink")

window.addEventListener("DOMContentLoaded", () => {
	console.log("YAYA")
	const currentPage = getCurrentPageFromURL()
	if (currentPage) {
		load_page(currentPage)
		return
	}
	if (getProfileData())
		load_page('profile')
	else
		load_page('login')
})