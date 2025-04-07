import * as THREE from "three"

export default {
	boundingBoxMargin: 20,
	polar: {
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		phi: 0,
		theta: 0,
		// radius: 92,
		useCalculatedRadius: true,
		calculatedRadiusMargin: 1,
	},
	controls: {
		enabled: false,
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
