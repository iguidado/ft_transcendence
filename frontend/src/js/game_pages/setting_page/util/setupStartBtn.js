import { loadGamePage } from "../../game_page/loadGamePage"
import { displayGestLogin } from "./displayGestLogin"
import { playersCount } from "./playersCount"

export const setupStartBtn = (ctx) => {
	const startBtn = document.getElementById("start-btn")
	if (!startBtn)
		consople.error("setupStartBtn : can't find #start-btn")
	startBtn.addEventListener("click", () => {
		let playerCount = playersCount(ctx.config)
		while (--playerCount > 0) {
			displayGestLogin()
		}
		loadGamePage(ctx)
	})
}