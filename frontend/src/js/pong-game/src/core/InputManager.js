import { gameRegistry } from "./GameRegistry";

export class InputManager {
    constructor() {
        this.context = gameRegistry.getCurrentContext()
		this.config = this.context.config
        this.keyState = {};
        this.contextpadState = {};
        this.mouseState = {};
        this.setupKeyBinds();
        this.setupGamepadBinds();
        this.setupMouseBinds();
    }

    setupKeyBinds() {
        document.addEventListener('keydown', (event) => {
            this.keyState[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            this.keyState[event.key] = false;
        });
    }

    setupGamepadBinds() {
        window.addEventListener("gamepadconnected", (event) => {
            console.log("Gamepad connected:", event.gamepad);
        });

        window.addEventListener("gamepaddisconnected", (event) => {
            console.log("Gamepad disconnected:", event.gamepad);
        });
    }

    setupMouseBinds() {
        // Pour une future implémentation du contrôle à la souris
    }

    update() {
        this.updatePaddleControls();
        this.updateCameraControls();
        // this.updateGamepadState();
    }

    updatePaddleControls() {
        const { paddleLeft, paddleRight, ball } = this.context.boardManager;
        const paddleSpeed = ball.speed * this.config.paddles.controls.speed;
        const { keys } = this.config.paddles.controls;

        // Right paddle controls
        if (!paddleRight.isBot) {
            if (this.keyState[keys.rightUp]) {
                paddleRight.moveUp(paddleSpeed);
            }
            if (this.keyState[keys.rightDown]) {
                paddleRight.moveDown(paddleSpeed);
            }
        }

        // Left paddle controls
        if (!paddleLeft.isBot) {
            if (this.keyState[keys.leftUp]) {
                paddleLeft.moveUp(paddleSpeed);
            }
            if (this.keyState[keys.leftDown]) {
                paddleLeft.moveDown(paddleSpeed);
            }
        }
    }

    updateCameraControls() {
        if (!this.config.camera.controls.enabled) return

        const {
            rotationSpeed,
            phiSpeed,
            thetaSpeed,
            radiusSpeed,
            marginSpeed,
            keys: cameraKeys
        } = this.config.camera.controls
        
        // Rotation X controls
        if (this.keyState[cameraKeys.rotateXPos]) {
            this.config.camera.polar.rotateX += rotationSpeed
            this.context.handleResize()
        }
        if (this.keyState[cameraKeys.rotateXNeg]) {
            this.config.camera.polar.rotateX -= rotationSpeed
            this.context.handleResize()
        }
        
        // Rotation Y controls
        if (this.keyState[cameraKeys.rotateYPos]) {
            this.config.camera.polar.rotateY += rotationSpeed
            this.context.handleResize()
        }
        if (this.keyState[cameraKeys.rotateYNeg]) {
            this.config.camera.polar.rotateY -= rotationSpeed
            this.context.handleResize()
        }
        
        // Rotation Z controls
        if (this.keyState[cameraKeys.rotateZPos]) {
            this.config.camera.polar.rotateZ += rotationSpeed
            this.context.handleResize()
        }
        if (this.keyState[cameraKeys.rotateZNeg]) {
            this.config.camera.polar.rotateZ -= rotationSpeed
            this.context.handleResize()
        }
        
        // Phi angle controls
        if (this.keyState[cameraKeys.phiPos]) {
            this.config.camera.polar.phi = Math.min(Math.PI/2, this.config.camera.polar.phi + phiSpeed)
            this.context.handleResize()
        }
        if (this.keyState[cameraKeys.phiNeg]) {
            this.config.camera.polar.phi = Math.max(-Math.PI/2, this.config.camera.polar.phi - phiSpeed)
            this.context.handleResize()
        }

        // Theta angle controls
        if (this.keyState[cameraKeys.thetaPos]) {
            this.config.camera.polar.theta = (this.config.camera.polar.theta + thetaSpeed) % (2 * Math.PI)
            this.context.handleResize()
        }
        if (this.keyState[cameraKeys.thetaNeg]) {
            this.config.camera.polar.theta = (this.config.camera.polar.theta - thetaSpeed) % (2 * Math.PI)
            this.context.handleResize()
        }

        // Radius controls (only when not using calculated radius)
        if (!this.config.camera.polar.useCalculatedRadius) {
            if (this.keyState[cameraKeys.radiusIncrease]) {
                this.config.camera.polar.radius += radiusSpeed
                this.context.handleResize()
            }
            if (this.keyState[cameraKeys.radiusDecrease]) {
                this.config.camera.polar.radius = Math.max(10, this.config.camera.polar.radius - radiusSpeed)
                this.context.handleResize()
            }
        }

        // Toggle calculated radius
        if (this.keyState[cameraKeys.toggleCalculatedRadius]) {
            this.config.camera.polar.useCalculatedRadius = !this.config.camera.polar.useCalculatedRadius
            this.context.handleResize()
            this.keyState[cameraKeys.toggleCalculatedRadius] = false // Prevent toggle spam
        }

        // Calculated radius margin controls
        if (this.config.camera.polar.useCalculatedRadius) {
            if (this.keyState[cameraKeys.marginIncrease]) {
                this.config.camera.polar.calculatedRadiusMargin += marginSpeed
                this.context.handleResize()
            }
            if (this.keyState[cameraKeys.marginDecrease]) {
                this.config.camera.polar.calculatedRadiusMargin = Math.max(1, 
                    this.config.camera.polar.calculatedRadiusMargin - marginSpeed)
                this.context.handleResize()
            }
        }

        // Log camera parameters
        if (this.keyState[cameraKeys.logParams]) {
            console.log('Camera parameters:', {
                rotateX: this.config.camera.polar.rotateX,
                rotateY: this.config.camera.polar.rotateY,
                rotateZ: this.config.camera.polar.rotateZ,
                phi: this.config.camera.polar.phi,
                theta: this.config.camera.polar.theta,
                radius: this.config.camera.polar.radius,
                useCalculatedRadius: this.config.camera.polar.useCalculatedRadius,
                calculatedRadiusMargin: this.config.camera.polar.calculatedRadiusMargin
            })
            this.keyState[cameraKeys.logParams] = false
        }
    }

    // updateGamepadState() {
    //     const gamepads = navigator.getGamepads();
    // }

    cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        // Nettoyage des autres événements
    }
}