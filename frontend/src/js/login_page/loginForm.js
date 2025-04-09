import { loginRequest } from "../api/routes/loginRoute.js"
import { verifyLoginOTP } from "../api/routes/user/verifyLoginOTP.js"
import { load_page } from "../router.js"
import { displayError } from "../utils/displayError.js"
import { pullProfile } from "../utils/profileUtils.js"
import { saveAccessToken } from "../utils/saveAccessToken.js"

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
		const valide2FAsection = document.getElementById("2FALoginModal")
		console.log(valide2FAsection)
		valide2FAsection.style.display = "block"
		console.log(res)
		if (!res.temp_token) {
			console.warn("valide2FAsection !res.temp_token")
			return
		}
		document
			.getElementById("validate2FAFromLogin")
			.addEventListener("click", (e) => {
				e.preventDefault()
				saveAccessToken(res.temp_token)
				const otp = document.getElementById("code2FAInputLogin").value
				verifyLoginOTP(otp, (res) => {
					console.log("validate2FAFromLogin",res)
				})
			})
	}
}

function fetchErrorHandler(err, response) {
	// DONE login error actions ( a ameliorer l'erreur est en json pour le moment)

	if (response.status === 401) {
		displayError(
			"Wrong login or password. Please try again."
		)
	}
	else if (response.status === 500) {
		displayError(
			"Server error. Please try again later."
		)
	}
	else if (response.status === 400) {
		displayError(
			"Bad request. Please check your input."
		)
	}
	else{
		displayError(
			"An error occurred. Please try again." + err
		)
	}
}

export function loginForm() {
	const loginForm = document.getElementById("loginForm")
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const username = document.getElementById("loginInput").value
		const password = document.getElementById("passwordInput").value
		saveAccessToken(null)
		loginRequest({ username, password }, fetchHandler, fetchErrorHandler)
	})
}
