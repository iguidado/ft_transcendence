import { Vector3 } from "three/src/Three.Core.js"
import { config } from "./config.js"
import { ball } from "./objects.js"

export function scoreMonitor() {
	if (ball.ball.position.x > config.board.width/2 +20 || ball.ball.position.x < -config.board.width/2 -20) {
		ball.reset()
		ball.direction = Math.random() > 0.5 ? new Vector3(-1, 0, 0) : new Vector3(1, 0, 0)
	}
} 