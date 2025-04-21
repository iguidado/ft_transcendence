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
import { displayError } from "./utils/displayError.js"

export async function loadProfilePage(username = null) {
	await pullProfile()
	let isLocalProfile = true
	let profileData = getProfileData()
	if (!profileData)
		return noProfileData()
	if (username && username != profileData.username) {
		profileData = await getProfileByUsername(username);
		isLocalProfile = false;
	}
	if (isLocalProfile) {
		settingsModal(profileData)
		addFriendModal();
	}
	addBackBtnSetup(isLocalProfile);
	addFriendBtnSetup(isLocalProfile);
	addSettingsBtnSetup(isLocalProfile);
	addDisconnectBtnSetup(isLocalProfile);
	setupUserStatus(profileData);
	displayInformations(profileData);
	displayMatchHistory(profileData.match_history);
}

function addBackBtnSetup(isLocalProfile) {
	console.log("isLocalProfile", isLocalProfile)
	const backBtn = document.getElementById("backButton");
	if (isLocalProfile) {
		backBtn.style.display = "none";
	} else {
		backBtn.style.display = "block";
		console.log(backBtn)
		backBtn.addEventListener("click", (e) => {
			e.preventDefault();
			load_page("profile");
		});
	}
}

function addSettingsBtnSetup(isLocalProfile) {
	const settingsBtn = document.getElementById("openSettings");
	if (!isLocalProfile)
		settingsBtn.style.display = "none";
}

function addDisconnectBtnSetup(isLocalProfile) {
	const disconnectBtn = document.getElementById("disconnect");
	if (!isLocalProfile)
		disconnectBtn.style.display = "none";
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
				statusIndicator.style.backgroundColor = isOnline ? "green" : "red";
				console.log(`Mise à jour du statut pour ${username}: ${isOnline ? 'en ligne' : 'hors ligne'}`);
			}
		}
	});
}

async function displayInformations(profileData) {
	document.getElementById("usernameDisplay")
		.textContent = profileData.displayName.charAt(0).toUpperCase() + profileData.displayName.slice(1)
	document.getElementById("realUsername")
		.textContent = profileData.username.charAt(0).toUpperCase() + profileData.username.slice(1)
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




//DONE gestion modale addfriends

function addFriendModal() {
    const addFriendModal = document.getElementById("addFriendModal");
	const profileData = getProfileData();
    addFriendModal.addEventListener('shown.bs.modal', () => {
        loadUsersList();
    });

    const addFriendBtn = document.getElementById("addFriendConfirmBtn");
    addFriendBtn.addEventListener("click", (e) => {
		e.preventDefault()
        const friendUsernameSelect = document.getElementById("friendUsername");
        const selectedUsername = friendUsernameSelect.value;

        if (selectedUsername) {
            const isAlreadyFriend = profileData.friends.some(friend => friend.username === selectedUsername);
            if (isAlreadyFriend) {
               displayError("You are already friends with this user (˶ᵔ ᵕ ᵔ˶)");
                return;
            }
            addFriend(selectedUsername).then(() => {
				const modal = bootstrap.Modal.getInstance(addFriendModal);
				modal.hide();
				load_page("profile");
			});
        } else {
            displayError("Please select a username to add as a friend (˶ᵔ ᵕ ᵔ˶)");
			return;
        }
        displayFriendsList(profileData);
    });

    const deleteFriendBtn = document.getElementById("deleteFriendBtn");
	deleteFriendBtn.addEventListener("click", (e) => {
		e.preventDefault()
		const friendUsernameSelect = document.getElementById("friendUsername");
		const selectedUsername = friendUsernameSelect.value;
		if (selectedUsername) {
			const isNotFriend = !profileData.friends.some(friend => friend.username === selectedUsername);
			if (isNotFriend) {
				displayError("You are not friends with this user ! (˶ᵔ ᵕ ᵔ˶)");
				return;
			}
			deleteFriend(selectedUsername).then(() => {
				const modal = bootstrap.Modal.getInstance(addFriendModal);
				modal.hide();
				load_page("profile");
			});
		} else {
			displayError("Please select a username to delete from your friends list (˶ᵔ ᵕ ᵔ˶)");
			return;
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
	});
}

async function addFriend(username) {
	return addFriendRequest({ username })
}

async function deleteFriend(username) {
	return deleteFriendRequest({ username });
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

function displayMatchHistory(matchHistory) {
    const profileData = getProfileData();
    let currentProfileUsername = window.location.pathname.split('/').pop() || profileData.username;
	currentProfileUsername = currentProfileUsername == "" ? profileData.username : currentProfileUsername;
    const matchHistoryContainer = document.getElementById("matchHistory");
    matchHistoryContainer.innerHTML = ''; // Réinitialiser le conteneur

    if (!matchHistory || matchHistory.length === 0) {
        matchHistoryContainer.innerHTML = '<p>No match historic yet</p>';
        return;
    }

    matchHistory.forEach(match => {
        const matchItem = document.createElement("div");
        matchItem.className = "match-item";

        const date = document.createElement("p");
        date.textContent = `Date : ${new Date(match.date).toLocaleString()}`;

        const player1Container = document.createElement("p");
        const player1Link = document.createElement("span");
        player1Link.textContent = match.player_one;
        player1Link.className = "player-link";
        player1Link.style.cursor = "pointer";
        player1Link.onclick = (e) => {
            e.preventDefault();
			if (match.player_one != currentProfileUsername){
				if (match.player_one == profileData.username)
					load_page("profile");
				else
					load_page("profile/" + match.player_one);
			}
        };
        player1Container.append("Player 1 : ", player1Link, ` - Score : ${match.score_p1}`);

        const player2Container = document.createElement("p");
        const player2Link = document.createElement("span");
        player2Link.textContent = match.player_two;
        player2Link.className = "player-link";
        player2Link.style.cursor = "pointer";
        player2Link.onclick = (e) => {
            e.preventDefault();
			if (match.player_two != currentProfileUsername){
				if (match.player_two == profileData.username)
					load_page("profile");
				else
					load_page("profile/" + match.player_two);
			}
        };
        player2Container.append("Player 2 : ", player2Link, ` - Score : ${match.score_p2}`);

        const result = document.createElement("p");
        // Determine if the current profile user is player one or two
        const isPlayerOne = match.player_one === currentProfileUsername;
        const hasWon = isPlayerOne ? match.winner === match.player_one : match.winner === match.player_two;
        result.textContent = `Result : ${hasWon ? "Victory" : "Defeat"}`;

        matchItem.appendChild(date);
        matchItem.appendChild(player1Container);
        matchItem.appendChild(player2Container);
        matchItem.appendChild(result);

        matchHistoryContainer.appendChild(matchItem);
    });
}

