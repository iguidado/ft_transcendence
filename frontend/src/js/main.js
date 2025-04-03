import { load_page } from "./router.js";
import { getProfileData } from "./utils/profileUtils.js";

document.body.classList.add("themePink");

window.addEventListener("DOMContentLoaded", () => {
	// TODO Check url and go right page when site load
	if (getProfileData())
		load_page("profile")
	else
    	load_page('login');
});