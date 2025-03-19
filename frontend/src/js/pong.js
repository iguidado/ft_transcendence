import {Game} from "./pong-game/src/core/Game"
import {teteTetePreview} from "./pong-game/src/config/preset/teteTetePreview"

function update_preview(props) {
	props.game?.cleanup()
	props.game = new Game(props.container, props.config)
	props.game.start()
}


export function loadGame(){
	const container = document.getElementById("game-preview");
	const game = new Game(container)
	const ctx = {
		container,
		game
	}

	ctx.game.start()

	const btnSolo = document.getElementById("btn-solo")
	if (btnSolo) {
		btnSolo.onclick = () => {
			delete ctx.config
			update_preview(ctx)
		}
	}

	const btnVersus = document.getElementById("btn-versus")
	if (btnVersus) {
		btnVersus.onclick = () => {
			console.log("CLIQUE")
			ctx.config = teteTetePreview
			update_preview(ctx)
			console.log(game.gameId)
		}
	}
}


