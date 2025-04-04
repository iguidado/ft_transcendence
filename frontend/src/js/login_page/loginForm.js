import { loginRequest } from "../api/routes/loginRequest";
import { load_page } from "../router";
import { pullProfile } from "../utils/profileUtils";
import { saveAccessToken } from "../utils/saveAccessToken";

function fetchHandler(res) {
	console.log("API Login response : ", res);
	// const valide2FAsection = document.getElementById("2FALoginModal");
	// console.log(valide2FAsection);
	// valide2FAsection.style.display = "block";
	if (res.access_token) {
		saveAccessToken(res.access_token, res.refresh_token);
		pullProfile()
			.then(() => {
				load_page("profile")
			})
			.catch((err) => {
				console.error("loginForm.js : pullProfile : ",err)
			})
	}
}

function fetchErrorHandler(err) {
	// TODO login error actions
	console.error("Login Error", err);
}

export function loginForm() {
	const loginForm = document.getElementById("loginForm");
  	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const username = document.getElementById("loginInput").value;
		const password = document.getElementById("passwordInput").value;
		loginRequest({username, password}, fetchHandler, fetchErrorHandler);
	});
}