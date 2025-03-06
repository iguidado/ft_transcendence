import * as THREE from 'three';
import { Ball } from "./Ball.js"
import { CollitionBox } from './CollitionBox.js';
import { config } from './config.js';
import { Paddle } from './Paddle.js';


export const walls = [
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
]

export const paddleRight = new Paddle()
export const paddleLeft = new Paddle({isLeft:true, color: 0x0000ff})

export const ball = new Ball()