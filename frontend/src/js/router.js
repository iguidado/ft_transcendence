import { initBuildButtons } from "./layout.js";
import { showRegister } from "./login.js";
import { loadGame } from "./loadGame.js";
import { loadLoginPage } from "./login.js";
import { loadProfilePage } from "./profile.js";
import { loadDashboardPage } from "./dashboard.js";
import { gameRegistry } from "./pong-game/src/core/GameRegistry.js";
import { clearGuestStore } from "./game_pages/loginGuestPage/utils/clearGuestStore.js";
// import { loadSocketTestPage } from "./socket-test";


export async function fetchHTMLContent(url) {
	try {
		url = `/fragments/${url}.html`;
		const response = await fetch(url);
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
	}
};

export async function load_page(url, props=undefined, pushHistory=true) {
	clearGuestStore()
	let currentGame = gameRegistry.getCurrentContext()
	if (currentGame)
		currentGame.cleanup()
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
	appendBuildingSideMenu(url)
	if (config.script) config.script(props);
	if (pushHistory)
		history.pushState({ page: tmp.join("/") }, "", `/${tmp.join("/")}`)
}



async function appendBuildingSideMenu(url) {
	const app = document.getElementById('app');
	const htmlLayout = await fetchHTMLContent('layout')
	const layout = document.createElement('div');
	layout.innerHTML = htmlLayout;
	const groupElement = layout.querySelector(`#${url}Group`);
	if (groupElement) {
		groupElement.style.display = 'none';
	}
	app.appendChild(layout);
	initBuildButtons();
}

window.addEventListener('popstate', (event) => {
    const path = window.location.pathname.substring(1);
    load_page(path, undefined, false);
});

export function getCurrentPageFromURL() {
	const path = window.location.pathname;
	if (path && path.startsWith("/"))
		return path.substring(1);
	return path;
}

