import { Game } from "../../pong-game/src/core/Game.js"

export function updatePreview(props) {
	console.log(props.config)
	props.game?.cleanup()
	props.game = new Game(props.container, props.config)
	props.game.start()
}