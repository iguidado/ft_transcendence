import { initBuildButtons } from "./layout.js";
import { showRegister } from "./login.js";
import { loadGame } from "./loadGame.js";
import { loadLoginPage } from "./login.js";
import { loadProfilePage } from "./profile.js";
import { loadDashboardPage } from "./dashboard.js";
import { gameRegistry } from "./pong-game/src/core/GameRegistry.js";
import { loadTournamentSetupPage } from "./game_pages/tournamentSetupPage/loadTournamentSetupPage.js";
import { pullProfile } from "./utils/profileUtils.js";
import { disconnect } from "./utils/disconnect.js";

function cleanupModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  });
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  document.body.classList.remove('modal-open');
}

export async function fetchHTMLContent(url) {
	try {
		url = `/fragments/${url}.html`;
		const response = await fetch(url).catch(err => { });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const htmlContent = await response.text();
		return htmlContent;
	} catch (error) {
		throw new Error(error);
	}
}

const routeConfigs = {
	pong: {
		script: loadGame,
		htmlFrag: "pong"
	},
	login: {
		script: loadLoginPage,
		htmlFrag: "login"
	},
	register: {
		script: showRegister,
		htmlFrag: "register"
	},
	profile: {
		script: loadProfilePage,
		htmlFrag: "profile"
	},
	dashboard: {
		script: loadDashboardPage,
		htmlFrag: "dashboard"
	},
	tournament: {
		script: loadTournamentSetupPage,
		htmlFrag: "tournament"
	}
};


export async function load_page(url, props = undefined, pushHistory = true) {
	cleanupModals();
	let currentGame = gameRegistry.getCurrentContext()
	if (currentGame)
		currentGame.cleanup()
	if (url != "login") {
		const data = await pullProfile()
		if (!data) {
			disconnect()
			return
		}
	}
	const tmp = url.split("/")
	if (tmp.length == 2) {
		url = tmp[0]
		props = tmp[1]
	}
	const config = routeConfigs[url]
	if (!config) {
		load_page("profile", props)
		return
	}
	const app = document.getElementById('app');
	if (config.htmlFrag) {
		const htmlContent = await fetchHTMLContent(config.htmlFrag);
		let mainContainer = document.getElementById("main_container")
		if (!mainContainer) {
			mainContainer = document.createElement('div');
			mainContainer.id = "main_container"
			app.appendChild(mainContainer)
		}
		mainContainer.innerHTML = htmlContent;
	}
	appendBuildingSideMenu(url, props)
	if (config.script) await config.script(props);
	if (pushHistory)
		history.pushState({ page: tmp.join("/") }, "", `/${tmp.join("/")}`)
	return
}

async function appendBuildingSideMenu(url, props) {
	const app = document.getElementById('app');
	const htmlLayout = await fetchHTMLContent('layout')
	const layout = document.createElement('div');
	layout.innerHTML = htmlLayout;
	if (url === 'login') {
		const allGroups = layout.querySelectorAll('[id$="Group"]');
		allGroups.forEach(group => {
			group.style.display = 'none';
		});

	} else {
		const groupElement = layout.querySelector(`#${url}Group`);
		if (groupElement) {
			groupElement.style.display = 'none';
		}
	}

	app.appendChild(layout);
	initBuildButtons();
}

window.addEventListener('popstate', (event) => {
	cleanupModals();
	const path = window.location.pathname.substring(1);
	load_page(path, undefined, false);
});

export function getCurrentPageFromURL() {
	const path = window.location.pathname;
	if (path && path.startsWith("/"))
		return path.substring(1);
	return path;
}

