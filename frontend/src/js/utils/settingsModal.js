import { updateDisplayNameRequest } from "../api/routes/updateDisplayNameRequest.js"
import { disconnect } from "./disconnect.js"
import { toggle2faRequest } from "../api/routes/user/toggle2fa.js"
import { verifyEmailOTP } from "../api/routes/user/verifyEmailOTP.js"
import { updateAvatarRequest } from "../api/routes/updateAvatar.js"
import { load_page } from "../router.js"
import { displayError } from "./displayError.js"

export function settingsModal(profileData) {
    const modalElement = document.getElementById("settingsModal");
    modalElement.addEventListener('shown.bs.modal', () => {
    });
    
    setupAvatarUpload();
    twoFactorAuthSection(profileData);
    saveSettings();
    disconnectBtn();
}

function setupAvatarUpload() {
    const avatarInput = document.getElementById("avatarUpload");
    const avatarPreview = document.getElementById("avatarPreview");
    
    avatarInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement("canvas");
                    canvas.width = 50;
                    canvas.height = 50;
                    const ctx = canvas.getContext("2d");
                    
                    ctx.drawImage(img, 0, 0, 50, 50);
                    
                    avatarPreview.src = canvas.toDataURL("image/jpeg");
                    avatarPreview.style.display = "block";
                    
                    canvas.toBlob((blob) => {
                        avatarInput.resizedBlob = blob;
                    }, "image/jpeg", 0.9);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
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
	if (profileData.is_2fa_enabled)
		send2FAEmailBtn.innerText = "Disable 2FA"
	send2FAEmailBtn.addEventListener("click", (e) => {
        e.preventDefault()
		const emailInput = document.getElementById("email2FAInput").value
		toggle2faRequest(
			{
				action: profileData.is_2fa_enabled ? "disable" : "enable",
				email: emailInput
			},
			profileData.is_2fa_enabled ? returnToProfile : displayCodeValidation,
			toggle2faError
		)
	})
    function returnToProfile() {
        const modal = document.getElementById("settingsModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        modal.querySelectorAll("input").forEach(input => input.value = "");
        load_page("profile");
    }
	confirm2FABtn.addEventListener("click", (e) => {
        e.preventDefault()
		const otp = document.getElementById("code2FAInput").value;
		verifyEmailOTP(otp, (res) => {
			const modal = document.getElementById("settingsModal");
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide(); 
			modal.querySelectorAll("input").forEach(input => input.value = ""); 
			load_page("profile");
		}, err => {
            displayError("Invalid OTP. Please try again.");
        });
	});
}

function displayCodeValidation(res) {
	document.getElementById("verify2FAModal").style.display = "block"
	document.getElementById("email2FASection").style.display = "none"
}

function toggle2faError(err, res) {
    displayError("Invalid email address. Please try again.");
}

function saveSettings() {
    const saveButton = document.getElementById("saveSettings");
    saveButton.addEventListener("click", async (e) => {
        e.preventDefault();
        let displayNameUpdated = false;
        let avatarUpdated = false;

        const newDisplayName = document.getElementById("newDisplayName").value.trim(); 
        if (newDisplayName) {
            if (newDisplayName.length > 15 || newDisplayName.length < 2) {
                displayError("Displayname must be between 2 and 15 characters (˶ᵔ ᵕ ᵔ˶)");
                return;
            }
            
            try {
                await new Promise((resolve, reject) => {
                    updateDisplayNameRequest(newDisplayName, (response) => {
                        document.getElementById("usernameDisplay").textContent =
                        newDisplayName.charAt(0).toUpperCase() + newDisplayName.slice(1);
                        displayNameUpdated = true;
                        resolve();
                    }, (err, res) => {
						if (!res) {
							displayError("Something wrong with new user name")
						} else if (res.status == 400) {
							displayError("Invalid user name")
						}
					});
                });
            } catch (error) {
            }
        }

        const avatarInput = document.getElementById("avatarUpload");
        if (avatarInput && avatarInput.files.length > 0 && avatarInput.resizedBlob) {
            const formData = new FormData();
            formData.append("avatar", avatarInput.resizedBlob, "avatar.jpg");
            
            try {
                await new Promise((resolve, reject) => {
                    updateAvatarRequest(formData, 
                        (response) => {
                            
                            const avatarElements = document.querySelectorAll('[data-user-avatar], .profile-avatar, .user-avatar, #userAvatar');
                            const newAvatarUrl = response.avatar || response.message && `/media/avatars/${response.avatarUrl}`;
                            
                            if (newAvatarUrl) {
                                avatarElements.forEach(el => {
                                    if (el) el.src = newAvatarUrl;
                                });
                                
                                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                                if (userData) {
                                    userData.avatar = newAvatarUrl;
                                    localStorage.setItem('userData', JSON.stringify(userData));
                                }
                            }
                            avatarUpdated = true;
                            resolve();
                        },
                        reject
                    );
                });
            } catch (error) {
                displayError("Error updating avatar:", error);
            }
        } else if (avatarInput && avatarInput.files.length > 0 && !avatarInput.files[0].type.startsWith("image/")) {
            displayError("Please select an image to upload.");
        }
        if (displayNameUpdated || avatarUpdated) {
            load_page("profile");
        }

        const modal = document.getElementById('settingsModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
}

function disconnectBtn() {
	document.getElementById("disconnect")
		.addEventListener("click", (e) => {
        e.preventDefault()
			disconnect()
		})
}
