import { loadLoginPage, showLogin } from "../../login.js";
import { fetchHTMLContent } from "../../router.js";
import { displayError } from "../../utils/displayError.js";
import { getAccessToken } from "../../utils/getAccessToken.js";
import { getProfileData } from "../../utils/profileUtils.js";
import { updateLocalProfile } from "../../utils/updateLocalProfile.js";
import { addGuestProfileToStore } from "../loginGuestPage/utils/addGuestProfileToStore.js";
import { getGuestList } from "../loginGuestPage/utils/getGuestList.js";
import { getProfileFromToken } from "../loginGuestPage/utils/getProfileFromToken.js";
import { rmGuest } from "../loginGuestPage/utils/rmGuest.js";
import { loadTournamentNextMatchPage } from "../tournamentNextMatch/tournamentNextMatch.js";

var players = []
var ctx_save = null
export async function loadTournamentSetupPage(ctx) {
	if (!ctx)
		ctx_save = ctx
	else
		ctx = ctx_save
	const app = document.getElementById("main_container");
	const torunamentHtml = await fetchHTMLContent("tournament")
	app.innerHTML = torunamentHtml
	setupProfiles()
	displayPlayerList()
	setupAddPlayerBtn(ctx)
	setupStartBtn(ctx)
}


function setupProfiles() {
	players = getGuestList() || []
	const localProfile = getProfileData()
	if (localProfile) {
		localProfile.access_token = getAccessToken()
		players = [localProfile, ...players]
	}
}

function addPlayerToList(playerName, id) {
	const container = document.getElementById("tournament__playerlist");
	if (!container) {
		return;
	}

	const li = document.createElement("li");
	li.className = "list-group-item d-flex justify-content-between align-items-center tournament__playerlist__item";
	li.setAttribute("data-id", id); // Ajout de l'attribut data-id

	const span = document.createElement("span");
	span.className = "tournament__playerlist__item__name";
	span.textContent = playerName;

	const buttonContainer = document.createElement("div");
	buttonContainer.className = "d-flex gap-2";
	let localProfile = getProfileData()
	if (!localProfile) {
		const removeButton = document.createElement("button");
		removeButton.className = "btn btn-danger btn-sm";
		removeButton.textContent = "Remove";
		removeButton.onclick = () => {
			rmGuest(id);
			players = players.filter(p => p.id !== id);
			container.removeChild(li);
		};
		buttonContainer.appendChild(removeButton);
	}

	const paramButton = document.createElement("button");
	paramButton.className = "btn gear-btn";
	paramButton.setAttribute("data-bs-toggle", "modal");
	paramButton.setAttribute("data-bs-target", "#TDNsettingsModal");
	paramButton.style.backgroundImage = "url('./rsc/param.png')";
	paramButton.style.backgroundSize = "contain";
	paramButton.style.backgroundRepeat = "no-repeat";
	paramButton.style.backgroundPosition = "center";
	paramButton.style.width = "40px";
	paramButton.style.height = "40px";
	paramButton.style.padding = "0";
	paramButton.onclick = () => {
		const modal = document.getElementById("TDNsettingsModal");
		openTDNSettingsModal(modal, playerName, id);
	};

	buttonContainer.appendChild(paramButton);

	li.appendChild(span);
	li.appendChild(buttonContainer);

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
			const backBtn = document.getElementById("backBtn");
			if (backBtn) {
				backBtn.style.display = "block";
				backBtn.addEventListener("click", () => {
					app.innerHTML = "";
					loadTournamentSetupPage(ctx);
				});
			}
			loadLoginPage(res => {
				if (!getProfileData()) {
					updateLocalProfile(res)
				} else {
					getProfileFromToken(res.access_token).then(profile => {
						profile.access_token = res.access_token
						addGuestProfileToStore(profile, (error) => {})
						loadTournamentSetupPage(ctx)
					})
				}
			})
		})
	}
}


function generatePlanning() {
	const random_order = players.sort(() => Math.random() - 0.5)
	const planning = []
	for (let i = 0; i < random_order.length - 1; i += 2) {
		const p1 = random_order[i];
		const p2 = random_order[i + 1];
		planning.push([p1, p2])
	}
	if (random_order.length % 2)
		planning.push([random_order[random_order.length - 1]])
	return planning
}



function setupStartBtn(ctx) {
	const btn = document.getElementById("tournament__startbtn")
	btn.onclick = e => {
		e.preventDefault()
		if (players.length < 2) {
			displayError("why are you solo ???")
			return
		}
		loadTournamentNextMatchPage(ctx, generatePlanning())
	}
}


function openTDNSettingsModal(modal, playerName, id) {
	const modalTitle = modal.querySelector(".modal-title");
	const newTDNInput = modal.querySelector("#newTDN");

	// Mettre à jour le titre de la modale et le placeholder
	modalTitle.textContent = `Edit Display Name for ${playerName}`;
	newTDNInput.value = playerName;

	// Afficher la modale
	const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
	modalInstance.show();

	// Ajouter un gestionnaire pour le bouton "Save"
	saveTDNbtn(modal, id, newTDNInput);
}

function saveTDNbtn(modal, id, newTDNInput) {
	const saveButton = modal.querySelector("#saveTDNSettings");
	saveButton.onclick = () => {
		const newDisplayName = newTDNInput.value.trim();
		if (newDisplayName) {
			// Mettre à jour le display name du joueur
			const player = players.find(p => p.id === id);
			if (player) {
				if (newDisplayName.length > 15) {
					displayError("Display name must be 15 characters or less (˶ᵔ ᵕ ᵔ˶)");
					return;
				}
				player.displayName = newDisplayName;

				// Mettre à jour l'affichage dans la liste
				const playerListItem = document.querySelector(`#tournament__playerlist li[data-id="${id}"]`);
				if (playerListItem) {
					const nameSpan = playerListItem.querySelector(".tournament__playerlist__item__name");
					nameSpan.textContent = newDisplayName;
				}
			}
		}
		// Fermer la modale
		const modalInstance = bootstrap.Modal.getInstance(modal);
		modalInstance.hide();
	};
}
