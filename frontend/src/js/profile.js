import { toggle2faRequest } from "./api/routes/user/toggle2fa"
import { verifyEmailOTP } from "./api/routes/user/verifyEmailOTP"
import { load_page } from "./router"
import { disconnect } from "./utils/disconnect"
import { getProfileData, pullProfile } from "./utils/profileUtils"

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
	// TODO showError("Session expired")
	disconnect()
}

function settingsModal() {
	console.log("Profile data: ", getProfileData())
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
		email2FASection.style.display = "block"
		verify2FAModal.style.display = "none"
	})
	send2FAEmailBtn.addEventListener("click", () => {
			email2FASection.style.display = "none"
			verify2FAModal.style.display = "block"
			const emailInput = document.getElementById("email2FAInput").value
			toggle2faRequest(
				{
					action: profileData.is_2fa_enabled ? "disable" : "enable", 
					email: emailInput
				},
				profileData.is_2fa_enabled ? loadProfilePage : displayCodeValidation,
				toggle2faError
			)
		})
	confirm2FABtn.addEventListener("click", () => {
			const otp = document.getElementById("code2FAInput").value
			verifyEmailOTP(otp, (res) => {
				console.log(res)
				load_page("profile")
			})
		})
}

function displayCodeValidation(res) {
	console.log(res)
	document.getElementById("verify2FAModal").style.display = "block"
	document.getElementById("email2FASection").style.display = "none"
}

function toggle2faError(err, res) {
	// TODO show errors
	console.warn("Error:", err)
	console.warn("API Response:", res)
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