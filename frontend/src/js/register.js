import { registerRequest } from "./api/routes/register"
import { load_page } from "./router"
import { displayError } from "./utils/displayError"

export function handleRegistration() {
	const registerForm = document.getElementById("registerForm")
	if (!registerForm)
		return
	registerForm.addEventListener("submit", async (e) => {
		e.preventDefault()
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
}

function registerRequestCallBack(res) {
	console.log("Register API Response", res)
	load_page("login")
}

function registerRequestErrorCallBack(err) {
	// DONE Register error actions
	
	displayError("An error occurred during registration. Please try again." + err);
}