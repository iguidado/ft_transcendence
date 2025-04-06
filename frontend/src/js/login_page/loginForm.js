import { loginRequest } from "../api/routes/login"
import { verifyLoginOTP } from "../api/routes/user/verifyLoginOTP"
import { load_page } from "../router"
import { displayError } from "../utils/displayError"
import { pullProfile } from "../utils/profileUtils"
import { saveAccessToken } from "../utils/saveAccessToken"

// export function validate2FA() {
// 	// const twoFACode = document.getElementById('twoFACodeInput').value

// 	// Si tu veux fermer le modal après validation manuelle
// 	// 1) Récupérer l'instance du modal
// 	const myModal = document.getElementById('twoFAModal')
// 	const modalInstance = bootstrap.Modal.getInstance(myModal)
// 	// 2) on le ferme
// 	modalInstance.hide()

// 	// suite: rediriger ou activer la 2FA etc.
// }

function fetchHandler(res) {
	console.log("API Login response : ", res)
	if (res.access_token) {
		saveAccessToken(res.access_token, res.refresh_token)
		pullProfile()
			.then(() => {
				load_page("profile")
			})
			.catch((err) => {
				console.error("loginForm.js : pullProfile : ", err)
			})
	} else {
		// validate2FA()
		const valide2FAsection = document.getElementById("2FALoginModal")
		console.log(valide2FAsection)
		valide2FAsection.style.display = "block"
		document
			.getElementById("validate2FAFromLogin")
			.addEventListener("click", (e) => {
				e.preventDefault()
				const otp = document.getElementById("code2FAInputLogin").value
				verifyLoginOTP(otp, (res) => {
					console.log("TEST",res)
				})
			})
	}
}

function fetchErrorHandler(err) {
	// DONE login error actions ( a ameliorer l'erreur est en json pour le moment)
	displayError(
		"An error occurred during registration. Please try again." + err
	)
}

export function loginForm() {
	const loginForm = document.getElementById("loginForm")
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const username = document.getElementById("loginInput").value
		const password = document.getElementById("passwordInput").value
		loginRequest({ username, password }, fetchHandler, fetchErrorHandler)
	})
}
