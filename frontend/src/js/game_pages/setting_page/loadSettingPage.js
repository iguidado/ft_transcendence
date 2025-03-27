import {Game} from "../../pong-game/src/core/Game"
import { appendCustomSettings } from "../../game_pages/setting_page/appendCustomSettings"
import { appendPresetButtons } from "../../game_pages/setting_page/appendPresetButtons"
import { CustomBtnsList } from "../../game_pages/setting_page/config/CustomBtnsList"
import { defaultConfig } from "../../pong-game/src/config/preset/defaultConfig";
import { initConfig } from "../../pong-game/src/config/initConfig";
import { setupSwitchMenuButton } from "../../game_pages/setting_page/setupSwitchMenuButton";

export function loadSettingPage() {
	const container = document.getElementById("game-preview");
    const ctx = {
		container,
        config: initConfig(defaultConfig)
    }
	ctx.game = new Game(container, ctx.config)
    appendCustomSettings(CustomBtnsList(ctx));

    appendPresetButtons(ctx);
    
    ctx.game.start()
	
	setupSwitchMenuButton(ctx)
}