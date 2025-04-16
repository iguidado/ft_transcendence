import { fetchHTMLContent } from "../../router";

export async function loadTournamentSetupPage(ctx) {
	const app = document.getElementById("main_container");
	const torunamentHtml = await fetchHTMLContent("tournament")
	app.innerHTML = torunamentHtml
	displayPlayerList()
	setupAddPlayerBtn()
}

function displayPlayerList() {
	const container = document.getElementById("")
}

function setupAddPlayerBtn() {
	const btn = document.getElementById("tournament__startbtn")
	btn.onclick = e => {
		e.preventDefault()
		console.log("TEST")
	}
}