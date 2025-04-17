import { getApiConfigDefault } from "./api/config/apiConfig.js"
import { avatarRequest } from "./api/routes/avatarRoute.js"
import { updateAvatarRequest, updateAvatarResponseHandler } from "./api/routes/updateAvatar.js"
import { updateDisplayNameRequest } from "./api/routes/updateDisplayNameRequest.js"
import { toggle2faRequest } from "./api/routes/user/toggle2fa.js"
import { verifyEmailOTP } from "./api/routes/user/verifyEmailOTP.js"
import { usersListRequest } from "./api/routes/usersRoute.js"
import { addFriendRequest } from "./api/routes/addFriendRoute.js"
import { load_page } from "./router.js"
import { disconnect } from "./utils/disconnect.js"
import { getProfileData, pullProfile } from "./utils/profileUtils.js"
import { deleteFriendRequest } from "./api/routes/deleteFriendRoute.js";
import { initializeWebSocketConnection } from "./utils/webSocketManager.js";

export async function loadProfilePage() {
    // Enlever les anciens écouteurs pour éviter les doublons
    window.removeEventListener('userStatusUpdate', handleUserStatusUpdate);
    
    // Initialiser le WebSocket si ce n'est pas déjà fait
    if (!window.userStatusSocket || window.userStatusSocket.readyState !== WebSocket.OPEN) {
        initializeWebSocketConnection();
    }
    
    // Ajouter l'écouteur d'événements pour les mises à jour de statut
    window.addEventListener('userStatusUpdate', handleUserStatusUpdate);

    await pullProfile().then((profile) => {
        if (!profile)
            return noProfileData()
        displayInformations()
        settingsModal()
        addFriendModal()
    });

    // Nettoyer l'écouteur lorsqu'on quitte la page
    return function cleanup() {
        window.removeEventListener('userStatusUpdate', handleUserStatusUpdate);
    };
}

// Gestion des mises à jour de statut d'utilisateur
function handleUserStatusUpdate(event) {
    const { username, isOnline } = event.detail;
    console.log(`Status update received: ${username} is ${isOnline ? 'online' : 'offline'}`);
    
    // Mettre à jour la liste des amis si elle est affichée
    updateFriendStatusInUI(username, isOnline);
}

// Fonction pour mettre à jour le statut d'un ami dans l'interface
function updateFriendStatusInUI(username, isOnline) {
    // Méthode plus robuste pour trouver l'élément de liste correspondant au bon ami
    const friendItems = document.querySelectorAll('#friendsList li[data-username]');
    
    friendItems.forEach(item => {
        if (item.getAttribute('data-username') === username) {
            // Mettre à jour l'indicateur de statut (premier enfant supposé être l'indicateur)
            const statusIndicator = item.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.style.backgroundColor = isOnline ? "green" : "grey";
                console.log(`Mise à jour du statut pour ${username}: ${isOnline ? 'en ligne' : 'hors ligne'}`);
            }
        }
    });
}

async function displayInformations() {
    const profileData = getProfileData()
    console.log("profileData", profileData)
    document.getElementById("usernameDisplay")
    .textContent = profileData.displayName.charAt(0).toUpperCase() + profileData.displayName.slice(1)
    document.getElementById("userAvatar")
        .src = profileData.avatar
    document.getElementById("gamesPlayed")
        .innerHTML = profileData?.match_history.length | 0
    document.getElementById("gamesWon")
        .textContent = profileData.wins | 0
    displayFriendsList()
}

function noProfileData() {
    disconnect()
}

function settingsModal() {
    const modalElement = document.getElementById("settingsModal");
    modalElement.addEventListener('shown.bs.modal', () => {
    //   loadAvailableAvatars();
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

//save settings DONE
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


function updateAvatar(avatarCode) {
    updateAvatarRequest(avatarCode, updateAvatarResponseHandler, error => {
        console.error("Erreur lors de la mise à jour de l'avatar", error);})
        
    }
    
    function loadAvailableAvatars() {
            avatarRequest(avatarResponseHandler, error => {
                console.error("Erreur lors de la récupération des avatars disponibles", error);
            })
            
    
      }

  function avatarResponseHandler(data) {
  const avatarGallery = document.getElementById("avatarGallery");
  avatarGallery.innerHTML = ''; // Vide le conteneur
  data.forEach(avatar => {
    const img = document.createElement("img");
    img.src = getApiConfigDefault().url + avatar.url;
    img.alt = avatar.name;
    img.style.cursor = "pointer";
    img.style.width = "50px";
    img.style.height = "50px";
    img.addEventListener("click", () => {
        updateAvatar(avatar.code)
        document.getElementById("userAvatar")
        .src = img.src
        console.log("test", img.src)
    });
    avatarGallery.appendChild(img);
  })
}





//DONE gestion modale addfriends

function addFriendModal() {
    const addFriendModal = document.getElementById("addFriendModal");
    // Chargez la liste des utilisateurs quand la modale s'ouvre
    addFriendModal.addEventListener('shown.bs.modal', () => {
        loadUsersList();
    });
    
    // Gestion du bouton de confirmation d'ajout d'ami
    const addFriendBtn = document.getElementById("addFriendConfirmBtn");
    addFriendBtn.addEventListener("click", () => {
        // Récupérer l'utilisateur sélectionné
        const friendUsernameSelect = document.getElementById("friendUsername");
        const selectedUsername = friendUsernameSelect.value;
        
        if (selectedUsername) {
            console.log("Ajout d'ami:", selectedUsername);
            addFriend(selectedUsername);
            
            // Fermer la modale après l'ajout
            const modal = bootstrap.Modal.getInstance(addFriendModal);
            modal.hide();
            load_page("profile");
        } else {
            console.error("Aucun utilisateur sélectionné");
        }
        displayFriendsList();
    });
    // Gestion du bouton de suppression d'ami
    const deleteFriendBtn = document.getElementById("deleteFriendBtn");
    deleteFriendBtn.addEventListener("click", () => {
        // Récupérer l'utilisateur sélectionné
        const friendUsernameSelect = document.getElementById("friendUsername");
        const selectedUsername = friendUsernameSelect.value;

        if (selectedUsername) {
            console.log("Suppression d'ami:", selectedUsername);
            deleteFriend(selectedUsername);

            // Fermer la modale après la suppression
            const modal = bootstrap.Modal.getInstance(addFriendModal);
            modal.hide();
            load_page("profile");
        } else {
            console.error("Aucun utilisateur sélectionné pour suppression");
        }
        displayFriendsList();
    });
}

function loadUsersList() {
    usersListRequest((users) => {
        const friendUsernameElement = document.getElementById("friendUsername");
        friendUsernameElement.innerHTML = ''; // Vide le conteneur avant d'ajouter les utilisateurs
        
        // Ajouter une option vide par défaut
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a username";
        friendUsernameElement.appendChild(defaultOption);
        
        // Ajouter chaque utilisateur comme option dans le select
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.username;
            option.textContent = user.username;
            friendUsernameElement.appendChild(option);
        });
    }, (error) => {
        console.error("Erreur lors de la récupération de la liste des utilisateurs :", error);
    });
}

function addFriend(username) {
    addFriendRequest({username}, response => {
    console.log("Friend added successfully:", response);
    }, error => {
    console.error("ERROR during friend add", error);
    })
}

function deleteFriend(username) {
    deleteFriendRequest({username}, response => {
        console.log("Friend deleted successfully:", response);
    }, error => {
        console.error("Error during friend deletion:", error);
    });
}

//Affichage liste d'amis

function displayFriendsList() {
    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = '';
    const profileData = getProfileData();
    
    if (!profileData.friends || profileData.friends.length === 0) {
        const noFriendsItem = document.createElement("li");
        noFriendsItem.className = "list-group-item";
        noFriendsItem.textContent = "You have no friends yet.";
        friendsList.appendChild(noFriendsItem);
        return;
    }
    
    // Ajouter chaque ami dans la liste
    profileData.friends.forEach(friend => {
        const friendItem = document.createElement("li");
        friendItem.className = "list-group-item d-flex align-items-center";
        friendItem.setAttribute("data-username", friend.username); // Ajouter attribut data-username
        
        // Indicateur de statut
        const statusIndicator = document.createElement("span");
        statusIndicator.className = "status-indicator";
        statusIndicator.style.width = "10px";
        statusIndicator.style.height = "10px";
        statusIndicator.style.borderRadius = "50%";
        statusIndicator.style.marginRight = "10px";
        statusIndicator.style.backgroundColor = friend.is_online ? "green" : "grey";
        
        // Nom de l'ami
        const friendName = document.createElement("span");
        friendName.textContent = friend.username;
        
        // Ajouter l'indicateur et le nom à l'élément de liste
        friendItem.appendChild(statusIndicator);
        friendItem.appendChild(friendName);
        
        friendsList.appendChild(friendItem);
    });
}

