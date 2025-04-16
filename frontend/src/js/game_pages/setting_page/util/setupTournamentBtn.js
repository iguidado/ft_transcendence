import { loadTournamentSetupPage } from "../../tournamentSetupPage/loadTournamentSetupPage"

export function setupTournamentBtn(ctx) {
	const btn = document.getElementById("tournament-btn")
	btn.addEventListener("click", e => {
		e.preventDefault()
		loadTournamentSetupPage(ctx)
	})
}