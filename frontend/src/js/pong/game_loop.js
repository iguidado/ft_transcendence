import * as THREE from 'three';
import { config } from './config.js';
import { ball } from './objects.js';

export function game_loop() {
	ball.move()
	if (ball.ball.position.x > config.board.width/2 +20 || ball.ball.position.x < -config.board.width/2 -20) {
		ball.ball.position.set(0,0)
		ball.direction = new THREE.Vector3(1,0,0)
	}
}