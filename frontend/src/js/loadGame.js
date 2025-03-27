import {Game} from "./pong-game/src/core/Game.js"
import {versus} from "./pong-game/src/config/preset/versus.js"
import { appendCustomSettings } from "./pongPageUtils/appendCustomSettings.js"
import { appendPresetButtons } from "./pongPageUtils/appendPresetButtons.js"
import { soloSettingList } from "./pongPageUtils/config/soloSettingList.js"
import { updatePreview } from "./pongPageUtils/updatePreview.js";
import { defaultConfig } from "./pong-game/src/config/preset/defaultConfig.js";
import { initConfig } from "./pong-game/src/config/initConfig.js";
import { setupSwitchMenuButton } from "./pong/menu.js"

export function loadGame(){
    const container = document.getElementById("game-preview");
    const game = new Game(container, defaultConfig)
    const ctx = {
        container,
        game,
        config: initConfig(defaultConfig)
    }
    appendCustomSettings(soloSettingList(ctx));
    
    // Add preset buttons to the mods-list-container
    appendPresetButtons(ctx);
    
    ctx.game.start()

    // const btnSolo = document.getElementById("btn-solo")
    // if (btnSolo) {
    //     btnSolo.onclick = () => {
    //         ctx.config = firstPerson
    //         updatePreview(ctx)
    //     }
    // }

    // const btnVersus = document.getElementById("btn-versus")
    // if (btnVersus) {
    //     btnVersus.onclick = () => {
    //         ctx.config = versus
    //         updatePreview(ctx)
    //         console.log(game.gameId)
    //     }
    // }

	setupSwitchMenuButton()
}


