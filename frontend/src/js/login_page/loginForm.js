import { loginRequest } from "../api/routes/loginRoute.js";
import { verifyLoginOTP } from "../api/routes/user/verifyLoginOTP.js";
import { getGuestList } from "../game_pages/loginGuestPage/utils/getGuestList.js";
import { disconnect } from "../utils/disconnect.js";
import { displayError } from "../utils/displayError.js";
import { getProfileData } from "../utils/profileUtils.js";
import { updateLocalProfile } from "../utils/updateLocalProfile.js";

function fetchHandler(res, onloginSuccess = updateLocalProfile) {
	console.log("API Login response : ", res);
	if (res.access_token) {
		onloginSuccess(res);
		console.log("WebSocket initialized after login");
	} else {
		const valide2FAsection = document.getElementById("2FALoginModal");
		const twoFAModal = bootstrap.Modal.getOrCreateInstance(valide2FAsection);
		twoFAModal.show();
		if (!res.temp_token) {
			return;
		}
		document
			.getElementById("validate2FAFromLogin")
			.addEventListener("click", (e) => {
				e.preventDefault();
			const otp = document.getElementById("code2FAInputLogin").value;
				verifyLoginOTP(
					{ otp, temp_token: res.temp_token },
					(res) => {
						console.log("validate2FAFromLogin", res);
						if (res.access_token) {
							onloginSuccess(res);
						}

						twoFAModal.hide();
					},
					(err) => {
						displayError("Invalid OTP. Please try again.");
					}
				);
			});
	}
}

function fetchErrorHandler(err, response) {
	if (response?.status === 401) {
		displayError("Wrong login or password. Please try again.");
	} else if (response?.status === 500) {
		displayError("Server error. Please try again later.");
	} else if (response?.status === 400) {
		displayError("Bad request. Please check your input.");
	} else {
		displayError("An error occurred: " + err);
	}
}

function usernameAlreadyLogin(username) {
	const profile = getProfileData();
	if (!profile) return false;
	if (username == profile.username) return true;
	const profiles = getGuestList();
	if (!profiles) return false;
	for (const p of profiles) {
		if (p.username == username) return true;
	}
}

export function loginForm(onloginSuccess) {
	const loginFormElem = document.getElementById("loginForm");
	loginFormElem.addEventListener("submit", (e) => {
		e.preventDefault();
		const username = document.getElementById("loginInput").value;
		const password = document.getElementById("passwordInput").value;
		if (!onloginSuccess) disconnect();
		if (usernameAlreadyLogin(username)) {
			displayError("User already logged in");
			return;
		}
		loginRequest(
			{ username, password },
			(res) => fetchHandler(res, onloginSuccess),
			fetchErrorHandler
		);
	});
}
