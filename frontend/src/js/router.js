import { initBuildButtons } from "./layout.js";
import { showRegister } from "./login.js";
import { loadGame } from "./loadGame.js";
import { loadLoginPage } from "./login.js";
import { loadProfilePage } from "./profile.js";
import { loadDashboardPage } from "./dashboard.js";
// import { loadSocketTestPage } from "./socket-test";


export async function fetchHTMLContent(url) {
	try {
		url = `./fragments/${url}.html`;
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

// url name: script to load
const routeScripts = {
	pong: loadGame,
	login: loadLoginPage,
	register: showRegister,
	profile: loadProfilePage,
	dashboard: loadDashboardPage
	// 'socket-test': loadSocketTestPage
}

export function load_page(url) {
	fetchHTMLContent(url).then(htmlContent => {
		if (!htmlContent) {
			load_page("profile")
			return
		} 
		const app = document.getElementById('app');
		let mainContainer = document.getElementById("main_container")
		if (!mainContainer) {
			mainContainer = document.createElement('div');
			mainContainer.id = "main_container"
			app.appendChild(mainContainer)
		}
		mainContainer.innerHTML = htmlContent;
		fetchHTMLContent('layout').then(htmlContent => {
			const layout = document.createElement('div');
			layout.innerHTML = htmlContent;
			const groupElement = layout.querySelector(`#${url}Group`);
			if (groupElement) {
				groupElement.style.display = 'none';
			}
			app.appendChild(layout);
			initBuildButtons(); 
		});
		if (routeScripts[url]) routeScripts[url]();
			history.pushState({page: url}, "", `/${url}`);
	}).catch(err => load_page("profile"))
}

window.addEventListener('popstate', (event) => {
	const path = window.location.pathname.substring(1);
	const page = path || 'login';
	load_page(page);
});

export function getCurrentPageFromURL() {
	const path = window.location.pathname.substring(1);
	return path || null;
}

