import * as THREE from 'three'
import { gameRegistry } from './GameRegistry';
import { Wall } from '../Objects/Wall';
import { Paddle } from '../Objects/Paddle';
import { Ball } from '../Objects/Ball';

export function initObjects() {
	const context = gameRegistry.getCurrentContext();
	const config = context.config
	const objects = {}

	objects.wallTop = new Wall({
		height: config.board.wallWidth,
		width: config.board.width + config.board.wallWidth,
		depth: config.board.depth,
		y: config.board.height/2
	})

	objects.wallBottom = new Wall({
		height: config.board.wallWidth,
		width: config.board.width + config.board.wallWidth,
		depth: config.board.depth,
		y: -config.board.height/2
	})

	objects.paddleLeft = new Paddle({ isLeft: true, color: 0x0000ff })
	objects.paddleRight = new Paddle({ isLeft: false })
	objects.ball = new Ball()

	context.boardGroup.add(objects.wallTop.mesh)
	context.boardGroup.add(objects.wallBottom.mesh)
	context.boardGroup.add(objects.paddleLeft.mesh)
	context.boardGroup.add(objects.paddleRight.mesh)
	context.boardGroup.add(objects.ball.mesh)
	return objects
}