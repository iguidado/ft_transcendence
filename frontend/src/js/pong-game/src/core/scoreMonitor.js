import { gameRegistry } from "./GameRegistry";
import * as THREE from "three"
export function scoreMonitor() {
	const context = gameRegistry.getCurrentContext();
	const ball = context.ball
	const config = context.config
	if (ball.mesh.position.x > config.board.width/2 +20 || ball.mesh.position.x < -config.board.width/2 -20) {
		ball.reset()
		// ball.direction = Math.random() > 0.5 ? new THREE.Vector2(-1, 0) : new THREE.Vector2(1, 0)
		ball.direction = new THREE.Vector3(1, -1, 0)
	}
} 