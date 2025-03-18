import * as THREE from "three"

export default {
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