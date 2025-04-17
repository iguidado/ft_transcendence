import { registerRequest } from "./api/routes/registerRoute.js"
import { load_page } from "./router.js"
import { displayError } from "./utils/displayError.js"
import { saveAccessToken } from "./utils/saveAccessToken.js"

export function handleRegistration(onloginSuccess) {
	const registerForm = document.getElementById("registerForm")
	if (!registerForm)
		return
	registerForm.addEventListener("submit", async (e) => {
		e.preventDefault()
		saveAccessToken(null)
		const username = registerForm.querySelector(
			'input[placeholder="Choose your login"]'
		).value
		const password = registerForm.querySelector(
			'input[placeholder="Choose your password"]'
		).value
		const confirm_password = registerForm.querySelector(
			'input[placeholder="Confirm your password"]'
		).value
		const submitButton = registerForm.querySelector('button[type="submit"]')
		submitButton.disabled = true
		setTimeout(
			() => submitButton.disabled = false,
			500
		)
		registerRequest(
			{ username, password, confirm_password },
			registerRequestCallBack,
			registerRequestErrorCallBack
		)
	})
	const backToLoginButton = document.getElementById("backToLoginButton");
	if (backToLoginButton) {
		backToLoginButton.addEventListener("click", () => {
			load_page("login", onloginSuccess);
		});
	}
	function registerRequestCallBack(res) {
		console.log("Register API Response", res)
		load_page("login", onloginSuccess)
	}
}


function registerRequestErrorCallBack(err) {
	// DONE Register error actions
	
	displayError("An error occurred during registration. Please try again." + err);
}

