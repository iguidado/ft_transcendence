import { handleRegistration } from "./register.js";
import { loginForm } from "./login_page/loginForm.js";
import { disconnect } from "./utils/disconnect.js";
import { getAccessToken } from "./utils/getAccessToken.js";

export function loadLoginPage(onloginSuccess) {
	if (getAccessToken()) {
		disconnect();
		return;
	}
	loginForm(onloginSuccess);
	const registerBtn = document.getElementById("registerButton");
	if (registerBtn) {
		registerBtn.addEventListener("click", () => {
			showRegister();
		});
	}
}

export function showRegister() {
	document.getElementById("loginSection").style.display = "none";
	document.getElementById("registerSection").style.display = "block";
	handleRegistration();
}

export function showLogin() {
	document.getElementById("loginSection").style.display = "block";
	document.getElementById("registerSection").style.display = "none";
}
