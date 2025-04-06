import { initBuildButtons } from "./build";
import { showRegister } from "./login";
import { loadGame } from "./loadGame";
import { loadLoginPage } from "./login";
import { loadProfilePage } from "./profile";
// import { loadSocketTestPage } from "./socket-test";


async function fetchHTMLContent(url) {
	try {
		url = `./fragments/${url}.html`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const htmlContent = await response.text();
		return htmlContent;
	} catch (error) {
		console.error('Erreur lors de la récupération du fichier HTML:', error);
	}
}

// url name: script to load
const routeScripts = {
	pong: loadGame,
	login: loadLoginPage,
	register: showRegister,
	profile: loadProfilePage,
	// 'socket-test': loadSocketTestPage
}


export function load_page(url) {
	fetchHTMLContent(url).then(htmlContent => {
		const app = document.getElementById('app');
		app.innerHTML = htmlContent;
		fetchHTMLContent('build').then(htmlContent => {
			const building = document.createElement('div');
			building.innerHTML = htmlContent;
			const groupElement = building.querySelector(`#${url}Group`);
			if (groupElement) {
				groupElement.style.display = 'none';
			}
			app.appendChild(building);
			initBuildButtons(); 
		});
		if (routeScripts[url]) routeScripts[url]();
			history.pushState({page: url}, "", `/${url}`);
	});
}

window.addEventListener('popstate', (event) => {
	const path = window.location.pathname.substring(1);
	const page = path || 'login';
	load_page(page);
});

export function getCurrentPageFromURL() {
	const path = window.location.pathname.substring(1);
	return path && routeScripts.hasOwnProperty(path) ? path : 'login';
}

