import { disconnect } from "./utils/disconnect"
import { getProfileData, pullProfile } from "./utils/profileUtils"

// profileData: {
// 	"id": 5,
// 	"username": "toto",
// 	"email": null,
// 	"displayName": "",
// 	"avatar": "/media/static/api/images/defaults.png",
// 	"date_joined": "2025-04-02T22:59:43.397801Z",
// 	"wins": 0,
// 	"looses": 0,
// 	"match_history": [],
// 	"otp_2fa": "",
// 	"otp_2fa_expiry_time": null,
// 	"otp_email": "",
// 	"otp_email_expiry_time": null,
// 	"is_2fa_enabled": false,
// 	"jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNjYwMzg4LCJpYXQiOjE3NDM2NTY3ODgsImp0aSI6IjQzMGQ3MGIyNzJiMTQ5OTBiMGIyYjJjYjY4ZGI2M2UxIiwidXNlcl9pZCI6NX0.2iv6FMJjU5T2kVpErwRscvTPtKGFvxT7FMS7XXDf4N4",
// 	"friends": [],
// 	"win_ratio": 0
// }

export function loadProfilePage() {
	displayInformations()
	settingsModal()
}

function displayInformations() {
	pullProfile().then((isSuccess) => {
		if (!isSuccess)
			return noProfileData()
		const profileData = getProfileData()
		document.getElementById("usernameDisplay")
			.textContent = profileData.displayName
		document.getElementById("userAvatar")
			.src = profileData.avatar || "./rsc/pear.png"
		document.getElementById("gamesPlayed")
			.textContent = profileData.gamesPlayed
		document.getElementById("gamesWon")
			.textContent = profileData.gamesWon
	})
}

function noProfileData() {
	// const containersList = document.getElementsByClassName("profile-frame")
	// for (const elem of containersList) {
	// 	elem.style.display = "none"
	// }
	// TODO showError("Session expired")
	disconnect()
}

function settingsModal() {
	const settingsBtn = document.getElementById("openSettings")
	const settingsModal = document.getElementById("settingsModal")
	let isOpen = false
	settingsBtn.addEventListener("click", () => {
		isOpen = !isOpen
		settingsModal.style.display = isOpen ? "block" : "none"
	})
	twoFactorAuthSection()
	saveSettings()
	disconnectBtn()
}

function twoFactorAuthSection() {
	const profileData = getProfileData()
	const settingsModal = document.getElementById("settingsModal")
	const enable2FA = document.getElementById("enable2FA")
	const email2FASection = document.getElementById("email2FASection")
	const verify2FAModal = document.getElementById("verify2FAModal")
	const send2FAEmailBtn = document.getElementById("send2FAEmailBtn")
	const confirm2FABtn = document.getElementById("confirm2FABtn")
	email2FASection.style.display = enable2FA.checked ? "block" : "none"
	enable2FA.checked = profileData.is_2fa_enabled || false
	enable2FA.addEventListener("change", () => {
		email2FASection.style.display = enable2FA.checked ? "block" : "none"
	})
	send2FAEmailBtn.addEventListener("click", () => {
			email2FASection.style.display = "none"
			verify2FAModal.style.display = "block"
			// TODO 2FA update
			// api/user/2fa/update
			// {
			// 	"action": "enable" or "disable",
			// 	"email": "user@example.com"
			// }
			const emailInput = document.getElementById("email2FAInput").value
			console.log("Send email !", emailInput)
		})
	confirm2FABtn.addEventListener("click", () => {
			// TODO Confirm code
			// api/user/verify-email-otp
			// {
			// 	"otp": "string"
			// }
			console.log("Confirm clicked !")
		})
}

function saveSettings() {
	const settingsModal = document.getElementById("settingsModal")
	document.getElementById("saveSettings")
		.addEventListener("click", () => {
			// TODO Save settings
			settingsModal.style.display = "none"
		})
}

function disconnectBtn() {
	document.getElementById("disconnect")
		.addEventListener("click", () => {
			disconnect()
		})
}