import * as THREE from "three"

export const defaultConfig = {
	board: {
		height: 50,
		width: 100,
		depth: 3,
		wallWidth: 1,
	},
	ball: {
		debugRayCaster: false,
		speed: 1,
		radius: 1,
		color: 0x00ff00,
		paddleBoncingSpeedMultiplicator: 1.05,
		maxSpeed: 2,
		x: 0,
		y: 0
	},
	paddles: {
		length: 10,
		depth: 3,
		width: 1,
		maxBounceAngle: Math.PI / 3,
		speed: 0.8,
		controls: {
			speed: 0.5, // Vitesse relative à la balle
			leftBot: true,  // false = joueur humain, true = bot
			rightBot: true, // false = joueur humain, true = bot
			keys: {
				leftUp: 'w',
				leftDown: 's',
				rightUp: 'ArrowUp',
				rightDown: 'ArrowDown'
			},
			bots: {
				reactionDelay: 0,  // Délai de réaction (secondes)
				predictionError: 0, // Erreur de prédiction (0-1)
				randomness: 1,     // Facteur d'aléatoire dans les mouvements (0-1)
				anticipation: 1,    // Capacité à anticiper (0-1)
				aggressive: 0       // Tendance à être agressif (0-1)
			}
		}
	},
	camera: {
		polar: {
			"rotateX": 1.540000000000001,
			"rotateY": 1.5707963267948966,
			"rotateZ": 0,
			"phi": 0.2617993877991494,
			"theta": 0,
			"radius": 92,
			"useCalculatedRadius": false,
			"calculatedRadiusMargin": 1.5
		},
		controls: {
			enabled: true,
			rotationSpeed: 0.02,
			phiSpeed: 0.02,
			thetaSpeed: 0.02,
			radiusSpeed: 2,
			marginSpeed: 0.1,
			keys: {
				phiPos: '8',
				phiNeg: '2',
				thetaPos: '6',
				thetaNeg: '4',
				rotateXPos: '9',
				rotateXNeg: '7',
				rotateYPos: '3',
				rotateYNeg: '1',
				rotateZPos: '.',
				rotateZNeg: '0',
				logParams: '-',
				radiusIncrease: '*',
				radiusDecrease: '/',
				toggleCalculatedRadius: '5',
				marginIncrease: '*',
				marginDecrease: '/'
			}
		},
		fov: 70,
		lookAt: new THREE.Vector3(0, 0, 0)
	}
}
