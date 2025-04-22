import { Game } from "../../pong-game/src/core/Game.js"
import { appendCustomSettings } from "./util/appendCustomSettings.js"
import { appendPresetButtons } from "./util/appendPresetButtons.js"
import { CustomBtnsList } from "./config/CustomBtnsList.js"
import { defaultConfig } from "../../pong-game/src/config/preset/defaultConfig.js"
import { initConfig } from "../../pong-game/src/config/initConfig.js"
import { setupSwitchMenuButton } from "./util/setupSwitchMenuButton.js"
import { setupStartBtn } from "./util/setupStartBtn.js"
import { setupTournamentBtn } from "./util/setupTournamentBtn.js"

export function loadSettingPage() {
	const game_container = document.getElementById("game-preview")
	const ctx = {
		container: game_container,
		config: initConfig(defaultConfig)
	}
	setupGamePreview(ctx)
	appendCustomSettings(CustomBtnsList(ctx))
	appendPresetButtons(ctx)
	setupSwitchMenuButton(ctx)
	setupStartBtn(ctx)
	setupTournamentBtn(ctx)
}

function setupGamePreview(ctx) {
	if (ctx.game) {
		ctx.game.cleanup()
	}
	ctx.game = new Game(ctx.container, ctx.config)
	ctx.game.scoreMonitor.onEndMatch = () => {
		setupGamePreview(ctx)
	}
	ctx.game.start()
}