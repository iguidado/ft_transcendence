import { clearGuestStore } from "./game_pages/loginGuestPage/utils/clearGuestStore.js"
import { load_page, getCurrentPageFromURL } from "./router.js"
import { getProfileData, pullProfile } from "./utils/profileUtils.js"

document.body.classList.add("themePink")

window.addEventListener("DOMContentLoaded", () => {
	clearGuestStore()
	pullProfile()
	const currentPage = getCurrentPageFromURL()
	load_page(currentPage, undefined, false)
})