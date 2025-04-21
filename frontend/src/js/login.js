import { handleRegistration } from "./register.js";
import { loginForm } from "./login_page/loginForm.js";
import { disconnect } from "./utils/disconnect.js";
import { getProfileData } from "./utils/profileUtils.js";

export function loadLoginPage(onloginSuccess) {
	if(!onloginSuccess && getProfileData()) {
		disconnect()
	}
	loginForm(onloginSuccess);
	const registerBtn = document.getElementById("registerButton");
	if (registerBtn) {
		registerBtn.addEventListener("click", (e) => {
			e.preventDefault();
			showRegister(onloginSuccess);
		});
	}
}

export function showRegister(onloginSuccess) {
	document.getElementById("loginSection").style.display = "none";
	document.getElementById("registerSection").style.display = "block";
	handleRegistration(onloginSuccess);
}

export function showLogin() {
	document.getElementById("loginSection").style.display = "block";
	document.getElementById("registerSection").style.display = "none";
}
