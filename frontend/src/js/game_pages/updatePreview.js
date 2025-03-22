import { Game } from "../pong-game/src/core/Game"

export function updatePreview(props) {
	props.game?.cleanup()
	props.game = new Game(props.container, props.config)
	props.game.start()
}