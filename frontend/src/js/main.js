import { load_page, getCurrentPageFromURL } from "./router.js";
import { getProfileData } from "./utils/profileUtils.js";

document.body.classList.add("themePink");

window.addEventListener("DOMContentLoaded", () => {
	const currentPage = getCurrentPageFromURL();

	if (currentPage) {
		load_page(currentPage);
	} else if (getProfileData()) {
		load_page("profile");
	} else {
		load_page('login');
	}
});