import { initBuildButtons } from "./build.js";
import { showLogin } from "./login.js";
import { loadGame } from "./loadGame.js";

async function fetchHTMLContent(url) {
    console.log('fetchHTMLContent:', url);
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
	pong: loadGame
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
    });
}

