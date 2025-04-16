import { loadLoginPage, showLogin } from "../../login";
import { fetchHTMLContent } from "../../router";
import { displayError } from "../../utils/displayError";
import { getAccessToken } from "../../utils/getAccessToken";
import { getProfileData } from "../../utils/profileUtils";
import { updateLocalProfile } from "../../utils/updateLocalProfile";
import { addGuestProfileToStore } from "../loginGuestPage/utils/addGuestProfileToStore";
import { getGuestList } from "../loginGuestPage/utils/getGuestList";
import { getProfileFromToken } from "../loginGuestPage/utils/getProfileFromToken";
import { rmGuest } from "../loginGuestPage/utils/rmGuest";
import { loadTournamentNextMatchPage } from "../tournamentNextMatch/tournamentNextMatch";

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
	// console.log(players)
	// const localProfile = getProfileData()
	// if (localProfile) {
	// 	localProfile.access_token = getAccessToken()
	// 	players = [localProfile, ...players]
	// }
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

function setupStartBtn(ctx) {
	const btn = document.getElementById("tournament__startbtn")
	btn.onclick = e => {
		e.preventDefault()
		if (players.length % 2) {
			displayError("odd player count")
			return
		}
		loadTournamentNextMatchPage(ctx, generatePlanning())
	}
}

function generatePlanning() {
	const random_order = players.sort(() => Math.random() - 0.5)
	const planning = []
	for (let i = 0; i < random_order.length; i+=2) {
		const p1 = random_order[i];
		const p2 = random_order[i+1];
		planning.push([p1, p2])
	}
	return planning
}