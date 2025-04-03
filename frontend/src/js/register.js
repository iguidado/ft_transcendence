import { registerRequest } from "./api/routes/registerRequest"
import { load_page } from "./router"

export function handleRegistration() {
	console.log("Initializing registration form")

	const registerForm = document.getElementById("registerForm")
	if (registerForm)
		registerForm.addEventListener("submit", async (e) => {
		e.preventDefault()
		const username = registerForm.querySelector(
			'input[placeholder="Choose your login"]' // ???!!!
		).value
		const password = registerForm.querySelector(
			'input[placeholder="Choose your password"]' // ???!!!
		).value
		const confirm_password = registerForm.querySelector(
			'input[placeholder="Confirm your password"]' // ???!!!
		).value
		const submitButton = registerForm.querySelector('button[type="submit"]')
		const originalButtonText = submitButton.textContent
		submitButton.disabled = true
		submitButton.textContent = "Registering..."
		registerRequest(
			{ username, password, confirm_password },
			registerRequestCallBack,
			registerRequestErrorCallBack
		)
	})
}

function registerRequestCallBack(res) {
	console.log(res)
	submitButton.textContent = originalButtonText
	submitButton.disabled = false
	alert("Registration successful")
	load_page("profile")
}

function registerRequestErrorCallBack(err) {
	console.error("Register Error", err)
}