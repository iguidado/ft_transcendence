import {Game} from "../../pong-game/src/core/Game"
import { appendCustomSettings } from "../../game_pages/setting_page/appendCustomSettings"
import { appendPresetButtons } from "../../game_pages/setting_page/appendPresetButtons"
import { CustomBtnsList } from "../../game_pages/setting_page/config/CustomBtnsList"
import { defaultConfig } from "../../pong-game/src/config/preset/defaultConfig"
import { initConfig } from "../../pong-game/src/config/initConfig"
import { setupSwitchMenuButton } from "../../game_pages/setting_page/setupSwitchMenuButton"
import { loadGamePage } from "../game_page/loadGamePage"

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