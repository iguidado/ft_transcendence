import * as THREE from "three"

export const config = {
	board: {
		height: 40,
		width: 80,
		depth: 1,
		wallWidth: 1
	},
	ball: {
		debugRayCaster: false,
		speed: 1,
		radius: 1,
		color: 0x00ff00,
		paddleBoncingSpeedMultiplicator: 1.05,
		maxSpeed: 4,
		x: 0,
		y: 0
	},
	paddles: {
		length: 10,
		depth: 1,
		width: 1,
		maxBounceAngle: Math.PI / 3,
		speed: 0.7
	},
	camera: {
		z: 40,
		y: 0,
		x: 0
	}
}