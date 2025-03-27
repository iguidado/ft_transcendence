import {Game} from "../../pong-game/src/core/Game"
import { appendCustomSettings } from "../../game_pages/setting_page/appendCustomSettings"
import { appendPresetButtons } from "../../game_pages/setting_page/appendPresetButtons"
import { CustomBtnsList } from "../../game_pages/setting_page/config/CustomBtnsList"
import { defaultConfig } from "../../pong-game/src/config/preset/defaultConfig"
import { initConfig } from "../../pong-game/src/config/initConfig"
import { setupSwitchMenuButton } from "../../game_pages/setting_page/setupSwitchMenuButton"

export function loadSettingPage() {
	const container = document.getElementById("pong-setup")
	const game_container = document.getElementById("game-preview")
    const ctx = {
		container: game_container,
        config: initConfig(defaultConfig)
    }
	ctx.game = new Game(game_container, ctx.config)
    appendCustomSettings(CustomBtnsList(ctx))

    appendPresetButtons(ctx)

	setupSwitchMenuButton(ctx)
	
	const startBtn = document.getElementById("start-btn")
	if (!startBtn)
		throw new Error("can't find #start-btn")

	startBtn.addEventListener("click", () => {
		ctx.game.cleanup()
		container.innerHTML = ""
		container.id = "game-container"
		const score = document.createElement("div")
		score.id = "score-container"
		const scoreText = document.createElement("p")
		scoreText.id = "score-text"
		scoreText.innerText = "5 - 5"
		score.appendChild(scoreText)
		container.appendChild(score)
		ctx.container = document.createElement("div")
		ctx.container.id = "pong-game"
		container.appendChild(ctx.container)

		ctx.game = new Game(ctx.container, ctx.config)
		ctx.game.start()
	})

	ctx.game.start()


}