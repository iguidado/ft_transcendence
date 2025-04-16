import { fetchHTMLContent } from "../../router";

export async function loadTournamentNextMatchPage(ctx, planning) {
	console.log(planning)
	const app = document.getElementById("main_container");
	const torunamentHtml = await fetchHTMLContent("tournamentVersus")
	app.innerHTML = torunamentHtml
	const textContainer = document.getElementById("tournamentVersus__text")
	textContainer.innerHTML = planning[0][0].displayName + " VS " + planning[0][1].displayName
}