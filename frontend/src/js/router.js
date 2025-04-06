import { initBuildButtons } from "./build";
import { showRegister } from "./login";
import { loadGame } from "./loadGame";
import { loadLoginPage } from "./login";
import { loadProfilePage } from "./profile";



async function fetchHTMLContent(url) {
	try {
		url = `./fragments/${url}.html`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const htmlContent = await response.text();
		// console.log(htmlContent); // Affiche le contenu HTML dans la console
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
	profile: loadProfilePage
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
		// TODO Navigation in url
	});
}

