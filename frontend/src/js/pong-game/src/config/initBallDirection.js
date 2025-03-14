import * as THREE from "three"
import { gameRegistry } from "../core/GameRegistry.js"

export function initBallDirection(config=undefined) {
	if (!config) {
		const context = gameRegistry.getCurrentContext()
		config = context.config
	}
	config.ball.direction = Math.random() > 0.5
		? new THREE.Vector3(-1, 0, 0)
		: new THREE.Vector3(1, 0, 0)
}