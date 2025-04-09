import {Game} from "../../pong-game/src/core/Game.js"
import { appendCustomSettings } from "./util/appendCustomSettings.js"
import { appendPresetButtons } from "./util/appendPresetButtons.js"
import { CustomBtnsList } from "./config/CustomBtnsList.js"
import { defaultConfig } from "../../pong-game/src/config/preset/defaultConfig.js"
import { initConfig } from "../../pong-game/src/config/initConfig.js"
import { setupSwitchMenuButton } from "./util/setupSwitchMenuButton.js"
import { loadGamePage } from "../game_page/loadGamePage.js"

export function loadSettingPage() {
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
		loadGamePage(ctx)
	})

	ctx.game.start()


}