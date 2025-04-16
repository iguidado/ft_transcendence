import { fetchHTMLContent } from "../../router";
import { loadGamePage } from "../game_page/loadGamePage";

export async function loadTournamentNextMatchPage(ctx, planning) {
	console.log(planning)
	const player1 = planning[0][0]
	const player2 = planning[0][1]
	const app = document.getElementById("main_container");
	const torunamentHtml = await fetchHTMLContent("tournamentVersus")
	app.innerHTML = torunamentHtml
	const textContainer = document.getElementById("tournamentVersus__text")
	textContainer.innerHTML = player1.displayName + " VS " + player2.displayName
	const startBtn  = document.getElementById("tournamentVersus__startbtn")
	startBtn.onclick = e => {
		e.preventDefault()
		setPlayerInputs(ctx.config)
		loadGamePage({...ctx, players: [player1, player2]})
	}
}

function setPlayerInputs(config) {
	config.paddles.controls.leftBot = false
	config.paddles.controls.rightBot = false
}