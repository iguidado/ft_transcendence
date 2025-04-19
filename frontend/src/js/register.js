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
		function registerRequestErrorCallBack(err, response) {
			if (response?.status === 400) {
				if (username.length < 3 || username.length > 25) {
					displayError(
						"Username must be betweem 3 and 15 characters long."
					);
				} else if (!/^[a-zA-Z0-9]+$/.test(username)) {
					displayError(
						"Usename must contain only letters and numbers."
					);
				} else if (password.length < 6) {
					displayError(
						"Password must be at least 6 characters long."
					);
				} else if (password !== confirm_password) {
					displayError(
						"Passwords do not match. Please try again."
					);
				}
			} else if (response?.status === 409) {
				displayError(
					"Username already exists. Please choose another one."
				);
			} else {
				displayError(
					"An error occurred: " + err
				);
			}
		}
		
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



