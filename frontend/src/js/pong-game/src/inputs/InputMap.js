import { gameRegistry } from "../core/GameRegistry"

export class InputMap {
	constructor() {
		this.context = gameRegistry.getCurrentContext()
		this.config = this.context.config
		this.map = new Map()
		this.initPaddleInputs()
		this.initCameraInputs()
	}
	
	initPaddleInputs() {
		const { paddleLeft, paddleRight } = this.context.boardManager
		if (!paddleRight.isBot) {
            this.map.set(
				this.config.paddles.controls.keys.rightUp,
				paddleRight.moveUp.bind(paddleRight)
			)
            this.map.set(
				this.config.paddles.controls.keys.rightDown,
				paddleRight.moveDown.bind(paddleRight)
			)
        }
        if (!paddleLeft.isBot) {
            this.map.set(
				this.config.paddles.controls.keys.leftUp,
				paddleLeft.moveUp.bind(paddleLeft)
			)
            this.map.set(
				this.config.paddles.controls.keys.leftDown,
				paddleLeft.moveDown.bind(paddleLeft)
			)
        }
	}

	initCameraInputs() {
		const { cameraManager } = this.context;
		const { keys } = this.config.camera.controls;
	
		if (!this.config.camera.controls.enabled) return;
		console.log(keys.phiPos)
	
		this.map.set(keys.phiPos,
			cameraManager.phiUp.bind(cameraManager));
		this.map.set(keys.phiNeg,
			cameraManager.phiDown.bind(cameraManager));
		this.map.set(keys.thetaPos,
			cameraManager.thetaUp.bind(cameraManager));
		this.map.set(keys.thetaNeg,
			cameraManager.thetaDown.bind(cameraManager));
		
		this.map.set(keys.rotateXPos,
			cameraManager.rotateUpX.bind(cameraManager));
		this.map.set(keys.rotateXNeg,
			cameraManager.rotateDownX.bind(cameraManager));
		this.map.set(keys.rotateYPos,
			cameraManager.rotateUpY.bind(cameraManager));
		this.map.set(keys.rotateYNeg,
			cameraManager.rotateDownY.bind(cameraManager));
		this.map.set(keys.rotateZPos,
			cameraManager.rotateUpZ.bind(cameraManager));
		this.map.set(keys.rotateZNeg,
			cameraManager.rotateDownZ.bind(cameraManager));
	
		this.map.set(keys.toggleCalculatedRadius, 
			cameraManager.toggleCalculatedRadius.bind(cameraManager));
		this.map.set(keys.marginIncrease, 
			cameraManager.calculatedRadiusMarginUp.bind(cameraManager));
		this.map.set(keys.marginDecrease, 
			cameraManager.calculatedRadiusMarginDown.bind(cameraManager));
		this.map.set(keys.logParams, 
			cameraManager.logCameraConfig.bind(cameraManager));
	}
}