import { getApiConfigDefault } from "./api/config/apiConfig.js"
import { avatarRequest } from "./api/routes/avatarRoute.js"
import { updateAvatarRequest } from "./api/routes/updateAvatar.js"
import { updateDisplayNameRequest } from "./api/routes/updateDisplayNameRequest.js"
import { toggle2faRequest } from "./api/routes/user/toggle2fa.js"
import { verifyEmailOTP } from "./api/routes/user/verifyEmailOTP.js"
import { load_page } from "./router.js"
import { disconnect } from "./utils/disconnect.js"
import { getProfileData, pullProfile } from "./utils/profileUtils.js"

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
		.textContent = profileData.displayName.charAt(0).toUpperCase() + profileData.displayName.slice(1)
		document.getElementById("userAvatar")
			.src = profileData.avatar
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
	const modalElement = document.getElementById("settingsModal");
	modalElement.addEventListener('shown.bs.modal', () => {
	  loadAvailableAvatars();
	});
	
	twoFactorAuthSection();
	saveSettings();
	disconnectBtn();
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
				load_page("profile")
			})
		})
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

        // Close the modal using Bootstrap's API
        const modal = document.getElementById('settingsModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        // Refresh the page to show updated changes
        window.location.reload();
    });
}


function disconnectBtn() {
	document.getElementById("disconnect")
		.addEventListener("click", () => {
			disconnect()
		})
}

function loadAvailableAvatars() {
		avatarRequest(avatarResponseHandler, error => {
			console.error("Erreur lors de la récupération des avatars disponibles", error);
		})
		

  }

  function updateAvatar(avatarCode) {
	updateAvatarRequest(avatarCode, updateAvatarResponseHandler, error => {
		console.error("Erreur lors de la mise à jour de l'avatar", error);})
  }
  

  function avatarResponseHandler(data) {
  console.log("Avatars reçus :", data);
  const avatarGallery = document.getElementById("avatarGallery");
  avatarGallery.innerHTML = ''; // Vide le conteneur
  data.forEach(avatar => {
	const img = document.createElement("img");
	img.src = getApiConfigDefault().url + avatar.url;
	img.alt = avatar.name;
	img.style.cursor = "pointer";
	img.style.width = "50px";
	img.style.height = "50px";
	img.addEventListener("click", () => updateAvatar(avatar.code));
	avatarGallery.appendChild(img);
  })
}


async function updateAvatarResponseHandler(data) {
    if (data.avatar) {
        const userAvatar = document.getElementById("userAvatar");
        userAvatar.src = getApiConfigDefault().url + data.avatar;
        console.log("Avatar mis à jour avec succès !");
    } else {
        console.error("Erreur lors de la mise à jour de l'avatar", data);
    }
}

// function handleSaveChanges() {
//     // Close the modal
//     const profileModal = document.getElementById('profileSettingsModal');
//     const modalInstance = bootstrap.Modal.getInstance(profileModal);
//     modalInstance.hide();

//     // Refresh the page
//     window.location.reload();
// }

// // Add event listener to the save button
// document.addEventListener('DOMContentLoaded', () => {
//     const saveButton = document.querySelector('#profileSettingsModal .btn-primary');
//     if (saveButton) {
//         saveButton.addEventListener('click', handleSaveChanges);
//     }
// });