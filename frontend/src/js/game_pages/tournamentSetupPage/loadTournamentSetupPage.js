import { fetchHTMLContent } from "../../router";

export async function loadTournamentSetupPage(ctx) {
	const app = document.getElementById("main_container");
	const torunamentHtml = await fetchHTMLContent("tournament")
	app.innerHTML = torunamentHtml
}