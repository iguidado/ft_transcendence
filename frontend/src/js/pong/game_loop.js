import * as THREE from 'three';
import { Ball } from "./Ball.js"
import { CollitionBox } from "./CollitionBox.js"
import { scene } from './scene.js';
import { config } from './config.js';
import { Paddle } from './Paddle.js';

const ball = new Ball({speed: 0.5, direction: new THREE.Vector3(1, 0, 0)})

let walls = [
	new CollitionBox({
		height: config.board.wallWidth,
		width: config.board.width+config.board.wallWidth,
		depth: config.board.depth,
		y: config.board.height/2
	}), // top
	new CollitionBox({
		height: config.board.wallWidth,
		width: config.board.width+config.board.wallWidth,
		depth: config.board.depth,
		y: -config.board.height/2
	}), // bottom
	// new CollitionBox({
	// 	height: config.board.height-config.board.wallWidth,
	// 	width: config.board.wallWidth,
	// 	depth: config.board.depth,
	// 	x: config.board.width/2,
	// 	color: 0xff0000
	// }), // right
	// new CollitionBox({
	// 	height: config.board.height-config.board.wallWidth,
	// 	width: config.board.wallWidth,
	// 	depth: config.board.depth,
	// 	x: -config.board.width/2
	// }) // left
]

let paddles = [
	new Paddle(),
	new Paddle({isRight:true, color: 0x0000ff})
]

export function game_loop() {
	ball.move()
}