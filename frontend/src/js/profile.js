import { getApiConfigDefault } from "./api/config/apiConfig.js"
import { avatarRequest } from "./api/routes/avatarRoute.js"
import { updateAvatarRequest, updateAvatarResponseHandler } from "./api/routes/updateAvatar.js"
import { usersListRequest } from "./api/routes/usersRoute.js"
import { addFriendRequest } from "./api/routes/addFriendRoute.js"
import { load_page } from "./router.js"
import { getProfileData, pullProfile } from "./utils/profileUtils.js"
import { deleteFriendRequest } from "./api/routes/deleteFriendRoute.js";
import { initializeWebSocketConnection } from "./utils/webSocketManager.js";
import { getProfileByUsername } from "./utils/getProfileByUsername.js"
import { settingsModal } from "./utils/settingsModal.js"
import { disconnect } from "./utils/disconnect.js"



export async function loadProfilePage(username = null) {
	await pullProfile()
	let isLocalProfile = true
	let profileData = getProfileData()
	if (username && username != profileData.username) {
		profileData = await getProfileByUsername(username)
		isLocalProfile = false
	}
	if (!profileData)
		return noProfileData()
	if (isLocalProfile) {
		settingsModal(profileData)
		addFriendModal()
	}
	addFriendBtnSetup(isLocalProfile)
	setupUserStatus(profileData)
	displayInformations(profileData)
}

function addFriendBtnSetup(isLocalProfile) {
	const addFriendBtn = document.getElementById("addFriendBtn");
	if (!isLocalProfile)
		addFriendBtn.style.display = "none";
}

function setupUserStatus() {
	window.removeEventListener('userStatusUpdate', handleUserStatusUpdate);
	if (!window.userStatusSocket || window.userStatusSocket.readyState !== WebSocket.OPEN)
		initializeWebSocketConnection()
	window.addEventListener('userStatusUpdate', handleUserStatusUpdate);
}

function handleUserStatusUpdate(event) {
	const { username, isOnline } = event.detail;
	console.log(`Status update received: ${username} is ${isOnline ? 'online' : 'offline'}`);
	updateFriendStatusInUI(username, isOnline);
}

function updateFriendStatusInUI(username, isOnline) {
	const friendItems = document.querySelectorAll('#friendsList li[data-username]');
	friendItems.forEach(item => {
		if (item.getAttribute('data-username') === username) {
			const statusIndicator = item.querySelector('.status-indicator');
			if (statusIndicator) {
				statusIndicator.style.backgroundColor = isOnline ? "green" : "grey";
				console.log(`Mise à jour du statut pour ${username}: ${isOnline ? 'en ligne' : 'hors ligne'}`);
			}
		}
	});
}

async function displayInformations(profileData) {
	document.getElementById("usernameDisplay")
		.textContent = profileData.displayName.charAt(0).toUpperCase() + profileData.displayName.slice(1)
	document.getElementById("userAvatar")
		.src = profileData.avatar
	document.getElementById("gamesPlayed")
		.innerHTML = profileData?.match_history.length | 0
	document.getElementById("gamesWon")
		.textContent = profileData.wins | 0
	displayFriendsList(profileData)
}

function noProfileData() {
	disconnect()
}


function updateAvatar(avatarCode) {
	updateAvatarRequest(avatarCode, updateAvatarResponseHandler, error => {
		console.error("Erreur lors de la mise à jour de l'avatar", error);
	})

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
			addFriend(selectedUsername);

			// Fermer la modale après l'ajout
			const modal = bootstrap.Modal.getInstance(addFriendModal);
			modal.hide();
			load_page("profile");
		} else {
			console.error("Aucun utilisateur sélectionné");
		}
		displayFriendsList(profileData);
	});
	const deleteFriendBtn = document.getElementById("deleteFriendBtn");
	deleteFriendBtn.addEventListener("click", () => {
		const friendUsernameSelect = document.getElementById("friendUsername");
		const selectedUsername = friendUsernameSelect.value;
		if (selectedUsername) {
			deleteFriend(selectedUsername);
			const modal = bootstrap.Modal.getInstance(addFriendModal);
			modal.hide();
			load_page("profile");
		} else {
			console.error("Aucun utilisateur sélectionné pour suppression");
		}
		displayFriendsList(profileData);
	});
}

function loadUsersList() {
	usersListRequest((users) => {
		const friendUsernameElement = document.getElementById("friendUsername");
		friendUsernameElement.innerHTML = '';
		const defaultOption = document.createElement("option");
		defaultOption.value = "";
		defaultOption.textContent = "Select a username";
		friendUsernameElement.appendChild(defaultOption);
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
	addFriendRequest({ username })
}

function deleteFriend(username) {
	deleteFriendRequest({ username });
}

function displayFriendsList(profileData) {
	const friendsList = document.getElementById("friendsList");
	friendsList.innerHTML = '';
	if (!profileData.friends || profileData.friends.length === 0) {
		const noFriendsItem = document.createElement("li");
		noFriendsItem.className = "list-group-item";
		noFriendsItem.textContent = "You have no friends yet.";
		friendsList.appendChild(noFriendsItem);
		return;
	}
	profileData.friends.forEach(friend => {
		const friendItem = document.createElement("li");
		friendItem.className = "list-group-item d-flex align-items-center";
		friendItem.setAttribute("data-username", friend.username);
		const statusIndicator = document.createElement("span");
		statusIndicator.className = "status-indicator";
		statusIndicator.style.width = "10px";
		statusIndicator.style.height = "10px";
		statusIndicator.style.borderRadius = "50%";
		statusIndicator.style.marginRight = "10px";
		statusIndicator.style.backgroundColor = friend.is_online ? "green" : "red";

		// Nom de l'ami
		const friendName = document.createElement("span");
		friendName.textContent = friend.username;

		// Ajouter l'indicateur et le nom à l'élément de liste
		friendItem.appendChild(statusIndicator);
		friendItem.appendChild(friendName);

		friendsList.appendChild(friendItem);
		friendItem.onclick = e => {
			e.preventDefault()
			load_page("profile/"+friend.username)
		}
	});
}

