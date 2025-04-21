import { clearGuestStore } from "./game_pages/loginGuestPage/utils/clearGuestStore.js"
import { load_page, getCurrentPageFromURL } from "./router.js"
import { disconnect } from "./utils/disconnect.js"
import { pullProfile } from "./utils/profileUtils.js"

document.body.classList.add("themePink")

window.addEventListener("DOMContentLoaded", () => {
	clearGuestStore()
	const currentPage = getCurrentPageFromURL()
	load_page(currentPage, undefined, false)
})