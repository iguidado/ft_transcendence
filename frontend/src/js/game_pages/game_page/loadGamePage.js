import { Game } from "../../pong-game/src/core/Game.js"
import { load_page } from "../../router.js"

export function loadGamePage(ctx) {
	const container = document.getElementById("pong-setup")
	ctx.game.cleanup()
	container.innerHTML = ""
	container.id = "game-container"
	const score = document.createElement("div")
	score.id = "score-container"
	const scoreText = document.createElement("p")
	scoreText.id = "score-text"
	score.appendChild(scoreText)
	container.appendChild(score)
	ctx.container = document.createElement("div")
	ctx.container.id = "pong-game"
	container.appendChild(ctx.container)

	ctx.game = new Game(ctx.container, ctx.config, scoreText)
	ctx.game.scoreMonitor.onEndMatch = (winnerSide) => {
		console.log(winnerSide)
		ctx.game.cleanup()
		load_page("pong")
	}
	ctx.game.start()
}