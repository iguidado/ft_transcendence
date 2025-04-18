import { updateDisplayNameRequest } from "../api/routes/updateDisplayNameRequest.js"
import { disconnect } from "./disconnect.js"
import { toggle2faRequest } from "../api/routes/user/toggle2fa.js"
import { verifyEmailOTP } from "../api/routes/user/verifyEmailOTP.js"


export function settingsModal(profileData) {
    const modalElement = document.getElementById("settingsModal");
    modalElement.addEventListener('shown.bs.modal', () => {
    //   loadAvailableAvatars();
    });
    
    twoFactorAuthSection(profileData);
    saveSettings();
    disconnectBtn();
}

function twoFactorAuthSection(profileData) {
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
		const otp = document.getElementById("code2FAInput").value;
		verifyEmailOTP(otp, (res) => {
			const modal = document.getElementById("settingsModal");
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide(); // Cacher la modale
			modal.querySelectorAll("input").forEach(input => input.value = ""); // Nettoyer les champs de la modale
			load_page("profile");
		});
	});
}

function displayCodeValidation(res) {
	document.getElementById("verify2FAModal").style.display = "block"
	document.getElementById("email2FASection").style.display = "none"
}

function toggle2faError(err, res) {
	// TODO show errors
	console.warn("Error:", err)
	console.warn("API Response:", res)
}


function saveSettings() {

	const saveButton = document.getElementById("saveSettings");
	saveButton.addEventListener("click", () => {
	const newDisplayName = document.getElementById("newDisplayName").value.trim();
	console.log("Nouveau nom d'utilisateur :", newDisplayName);
	if (newDisplayName) {
		updateDisplayNameRequest(newDisplayName, (response) => {
			console.log("Nom d'utilisateur mis à jour avec succès :", response);
			document.getElementById("usernameDisplay").textContent =
			  newDisplayName.charAt(0).toUpperCase() + newDisplayName.slice(1);
		  }, (error) => {
			console.error("Erreur lors de la mise à jour du nom d'utilisateur :", error);
		  });
		} else {
		  console.log("Aucun nouveau nom fourni.");
		}
		const modal = document.getElementById('settingsModal');
		const modalInstance = bootstrap.Modal.getInstance(modal);
		modalInstance.hide();
	});
}

function disconnectBtn() {
	document.getElementById("disconnect")
		.addEventListener("click", () => {
			disconnect()
		})
}
