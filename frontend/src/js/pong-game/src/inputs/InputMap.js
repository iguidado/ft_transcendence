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
		const { keys } = this.config.camera.controls;
		if (!this.config.camera.controls.enabled) return;
	
		// Map keys to operations on all cameras
		this.map.set(keys.phiPos, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.phiUp()));
		this.map.set(keys.phiNeg, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.phiDown()));
		this.map.set(keys.thetaPos, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaUp()));
		this.map.set(keys.thetaNeg, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaDown()));
		
		this.map.set(keys.rotateXPos, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpX()));
		this.map.set(keys.rotateXNeg, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownX()));
		this.map.set(keys.rotateYPos, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpY()));
		this.map.set(keys.rotateYNeg, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownY()));
		this.map.set(keys.rotateZPos, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpZ()));
		this.map.set(keys.rotateZNeg, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownZ()));
	
		this.map.set(keys.toggleCalculatedRadius, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.toggleCalculatedRadius()));
		this.map.set(keys.marginIncrease, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.calculatedRadiusMarginUp()));
		this.map.set(keys.marginDecrease, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.calculatedRadiusMarginDown()));
		this.map.set(keys.logParams, 
			() => this.context.viewManager.views.forEach(({cameraManager}) => cameraManager.logCameraConfig()));
	}
}