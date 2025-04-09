import { loadGamePage } from "../../game_page/loadGamePage"
import { displayGestLogin } from "./displayGestLogin"
import { playersCount } from "./playersCount"

export const setupStartBtn = (ctx) => {
	const startBtn = document.getElementById("start-btn")
	if (!startBtn)
		throw new Error("can't find #start-btn")
	
	startBtn.addEventListener("click", () => {
		let playerCount = playersCount(ctx.config)
		while (--playerCount) {
			displayGestLogin()
		}
		loadGamePage(ctx)
	})
}