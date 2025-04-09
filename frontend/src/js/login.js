import { handleRegistration } from "./register.js";
import { loginForm } from "./login_page/loginForm.js";

export function loadLoginPage() {
	// const app = document.getElementById("app");
	loginForm();
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
