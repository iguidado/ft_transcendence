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
        console.error(`Container with id "tournament__playerlist" not found.`);
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

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-danger btn-sm";
    removeButton.textContent = "Remove";
    removeButton.onclick = () => {
        rmGuest(id);
        players = players.filter(p => p.id !== id);
        container.removeChild(li);
    };

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

    buttonContainer.appendChild(removeButton);
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
	const modalInstance = new bootstrap.Modal(modal);
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
                player.displayName = newDisplayName;
                console.log(`Display name updated for player ${id}: ${newDisplayName}`);

                // Mettre à jour l'affichage dans la liste
                const playerListItem = document.querySelector(`#tournament__playerlist li[data-id="${id}"]`);
                if (playerListItem) {
                    const nameSpan = playerListItem.querySelector(".tournament__playerlist__item__name");
                    nameSpan.textContent = newDisplayName;
                }
            } else {
                console.error(`Player with ID ${id} not found.`);
            }
        } else {
            console.error("Display name cannot be empty.");
        }

        // Fermer la modale
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("TDNsettingsModal");

    // Écouter l'événement de fermeture de la modale
    modal.addEventListener("hidden.bs.modal", () => {
		const modalInstance = new bootstrap.Modal(modal);
	modalInstance.show();

        // Déplacer le focus vers un élément en dehors de la modale
        const openButton = document.querySelector('[data-bs-target="#TDNsettingsModal"]');
        if (openButton) {
            openButton.focus();
        }
    });
});