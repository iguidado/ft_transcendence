import { loadLoginPage } from "../../login";
import { fetchHTMLContent } from "../../router";
import { getAccessToken } from "../../utils/getAccessToken";
import { getProfileData } from "../../utils/profileUtils";
import { updateLocalProfile } from "../../utils/updateLocalProfile";
import { addGuestProfileToStore } from "../loginGuestPage/utils/addGuestProfileToStore";
import { getGuestList } from "../loginGuestPage/utils/getGuestList";
import { getProfileFromToken } from "../loginGuestPage/utils/getProfileFromToken";
import { rmGuest } from "../loginGuestPage/utils/rmGuest";

var players = []

export async function loadTournamentSetupPage(ctx) {
	const app = document.getElementById("main_container");
	const torunamentHtml = await fetchHTMLContent("tournament")
	app.innerHTML = torunamentHtml
	setupProfiles()
	displayPlayerList()
	setupAddPlayerBtn(ctx)
	setupStartBtn()
}

/* <li
	class="list-group-item d-flex justify-content-between align-items-center tournament__playerlist__item">
	<span class="tournament__playerlist__item__name">Player 1</span>
	<button class="btn btn-danger btn-sm tournament__playerlist__item__removebtn">Remove</button>
</li> */

function setupProfiles() {
	players = getGuestList()
	const localProfile = getProfileData()
	if (localProfile) {
		localProfile.access_token = getAccessToken()
		players = [localProfile, ...players]
	}
}

function addPlayerToList(playerName, id) {
	console.log(playerName)
	const container = document.getElementById("tournament__playerlist");
	if (!container) {
		console.error(`Container with id "tournament__playerlist" not found.`);
		return;
	}

	const li = document.createElement("li");
	li.className = "list-group-item d-flex justify-content-between align-items-center tournament__playerlist__item";

	const span = document.createElement("span");
	span.className = "tournament__playerlist__item__name";
	span.textContent = playerName;
	const localProfile = getProfileData()
	const button = document.createElement("button");
	button.className = "btn btn-danger btn-sm tournament__playerlist__item__removebtn";
	button.textContent = "Remove";
	button.onclick = () => {
		rmGuest(id)
		players = players.filter(p => p.id != id)
		container.removeChild(li)
	}
	li.appendChild(span);
	if (!localProfile || id != localProfile.id)
		li.appendChild(button);

	container.appendChild(li);
}

function displayPlayerList() {
	for (const player of players) {
		addPlayerToList(player.displayName, player.id)
	}
}

function setupAddPlayerBtn(ctx) {
	const btn = document.getElementById("tournament__addplayerbtn")
	btn.onclick = e => {
		e.preventDefault()
		fetchHTMLContent("login").then(htmlContent => {
			const app = document.getElementById('main_container')
			app.innerHTML = htmlContent
			loadLoginPage(res => {
				if (!getProfileData()) {
					updateLocalProfile(res)
				} else {
					getProfileFromToken(res.access_token).then(profile => {
						profile.access_token = res.access_token
						addGuestProfileToStore(profile, console.error)
						loadTournamentSetupPage(ctx)
					})
				}
			})
		})
	}
}

function setupStartBtn() {
	const btn = document.getElementById("tournament__startbtn")
	btn.onclick = e => {
		e.preventDefault()
		console.log("TODO")
	}
}