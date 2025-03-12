import * as THREE from 'three'
import { gameRegistry } from './GameRegistry.js'
import { initConfig } from '../config/initConfig.js'
import { initScene } from './sceneUtils.js'
import { initObjects } from './initMeshes.js'
import { CameraManager } from './CameraManager.js'
import { RendererManager } from './RendererManager.js'

let currId = 1

export class Game {
    constructor(container, config_edits = {}) {
        if (!container)
            throw new Error(`Container not found`)
        this.gameId = currId++
        this.container = container
        this.isRunning = false
        gameRegistry.registerContext(this.gameId, this)
		gameRegistry.setCurrentContext(this.gameId)
        this.config = initConfig(config_edits)
		this.scene = initScene()
		this.boardGroup = new THREE.Group()
		this.scene.add(this.boardGroup)
		const objects = initObjects()
		this.paddleLeft = objects.paddleLeft
		this.paddleRight = objects.paddleRight
		this.ball = objects.ball
		this.wallTop = objects.wallTop
		this.wallBottom = objects.wallBottom
        this.cameraManager = new CameraManager()
        this.rendererManager = new RendererManager()
        this.handleResize()
        this.keyState = {}
        this.setupKeyBinds()

        this.container.style.backgroundColor = '#000'
        this.container.style.overflow = 'hidden'
    }
	handleResize() {
		this.rendererManager.handleResize()
		this.cameraManager.init()
	}
    animate() {
        if (!this.isRunning) return
        this.update()
        this.rendererManager.render()
        requestAnimationFrame(() => this.animate())
    }

    start() {
        if (this.isRunning) return
        this.isRunning = true
        this.animate()
    }

    stop() {
        this.isRunning = false
    }

    update() {
        this.handleKeyPress()
        this.updateBots()
        this.ball.move()
    }

    setupKeyBinds() {
        document.addEventListener('keydown', (event) => {
            this.keyState[event.key] = true
        })
        
        document.addEventListener('keyup', (event) => {
            this.keyState[event.key] = false
        })
    }
    
    handleKeyPress() {
        const maxPaddleY = this.config.board.height/2 - this.config.paddles.length/2 - this.config.board.wallWidth
        const minPaddleY = -this.config.board.height/2 + this.config.paddles.length/2 + this.config.board.wallWidth
        const paddleSpeed = this.ball.speed * this.config.paddles.controls.speed
        const { keys } = this.config.paddles.controls
    
        // Right paddle controls (if not bot)
        if (!this.config.paddles.controls.rightBot) {
            if (this.keyState[keys.rightUp] && this.paddleRight.mesh.position.y < maxPaddleY) {
                this.paddleRight.mesh.position.y += paddleSpeed
            }
            if (this.keyState[keys.rightDown] && this.paddleRight.mesh.position.y > minPaddleY) {
                this.paddleRight.mesh.position.y -= paddleSpeed
            }
        }
    
        // Left paddle controls (if not bot)
        if (!this.config.paddles.controls.leftBot) {
            if (this.keyState[keys.leftUp] && this.paddleLeft.mesh.position.y < maxPaddleY) {
                this.paddleLeft.mesh.position.y += paddleSpeed
            }
            if (this.keyState[keys.leftDown] && this.paddleLeft.mesh.position.y > minPaddleY) {
                this.paddleLeft.mesh.position.y -= paddleSpeed
            }
        }
    
        // Camera controls
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
            this.handleResize()
        }
        if (this.keyState[cameraKeys.rotateXNeg]) {
            this.config.camera.polar.rotateX -= rotationSpeed
            this.handleResize()
        }
        
        // Rotation Y controls
        if (this.keyState[cameraKeys.rotateYPos]) {
            this.config.camera.polar.rotateY += rotationSpeed
            this.handleResize()
        }
        if (this.keyState[cameraKeys.rotateYNeg]) {
            this.config.camera.polar.rotateY -= rotationSpeed
            this.handleResize()
        }
        
        // Rotation Z controls
        if (this.keyState[cameraKeys.rotateZPos]) {
            this.config.camera.polar.rotateZ += rotationSpeed
            this.handleResize()
        }
        if (this.keyState[cameraKeys.rotateZNeg]) {
            this.config.camera.polar.rotateZ -= rotationSpeed
            this.handleResize()
        }
        
        // Phi angle controls
        if (this.keyState[cameraKeys.phiPos]) {
            this.config.camera.polar.phi = Math.min(Math.PI/2, this.config.camera.polar.phi + phiSpeed)
            this.handleResize()
        }
        if (this.keyState[cameraKeys.phiNeg]) {
            this.config.camera.polar.phi = Math.max(-Math.PI/2, this.config.camera.polar.phi - phiSpeed)
            this.handleResize()
        }

        // Theta angle controls
        if (this.keyState[cameraKeys.thetaPos]) {
            this.config.camera.polar.theta = (this.config.camera.polar.theta + thetaSpeed) % (2 * Math.PI)
            this.handleResize()
        }
        if (this.keyState[cameraKeys.thetaNeg]) {
            this.config.camera.polar.theta = (this.config.camera.polar.theta - thetaSpeed) % (2 * Math.PI)
            this.handleResize()
        }

        // Radius controls (only when not using calculated radius)
        if (!this.config.camera.polar.useCalculatedRadius) {
            if (this.keyState[cameraKeys.radiusIncrease]) {
                this.config.camera.polar.radius += radiusSpeed
                this.handleResize()
            }
            if (this.keyState[cameraKeys.radiusDecrease]) {
                this.config.camera.polar.radius = Math.max(10, this.config.camera.polar.radius - radiusSpeed)
                this.handleResize()
            }
        }

        // Toggle calculated radius
        if (this.keyState[cameraKeys.toggleCalculatedRadius]) {
            this.config.camera.polar.useCalculatedRadius = !this.config.camera.polar.useCalculatedRadius
            this.handleResize()
            this.keyState[cameraKeys.toggleCalculatedRadius] = false // Prevent toggle spam
        }

        // Calculated radius margin controls
        if (this.config.camera.polar.useCalculatedRadius) {
            if (this.keyState[cameraKeys.marginIncrease]) {
                this.config.camera.polar.calculatedRadiusMargin += marginSpeed
                this.handleResize()
            }
            if (this.keyState[cameraKeys.marginDecrease]) {
                this.config.camera.polar.calculatedRadiusMargin = Math.max(1, 
                    this.config.camera.polar.calculatedRadiusMargin - marginSpeed)
                this.handleResize()
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

    // Cleanup method to remove listeners
    cleanup() {
        window.removeEventListener('resize', this.resizeDebounce)
        window.removeEventListener('orientationchange', this.resizeDebounce)
        this.resizeObserver.disconnect()
    }

    updateBots() {
        const maxPaddleY = this.config.board.height/2 - this.config.paddles.length/2 - this.config.board.wallWidth
        const minPaddleY = -this.config.board.height/2 + this.config.paddles.length/2 - this.config.board.wallWidth
        const paddleSpeed = this.ball.speed * this.config.paddles.controls.speed
        const botConfig = this.config.paddles.controls.bots

        // Fonction helper pour le mouvement du bot avec interpolation
        const movePaddleBot = (paddle, isLeft) => {
            // Prédiction de la position future de la balle
            const ballDirection = this.ball.direction
            const ballSpeed = this.ball.speed
            
            // Calculer le temps jusqu'à l'impact avec plus de précision
            const distanceX = isLeft ? 
                (paddle.mesh.position.x - this.ball.mesh.position.x) : 
                (this.ball.mesh.position.x - paddle.mesh.position.x)
            const timeToImpact = Math.abs(distanceX / (ballSpeed * ballDirection.x))

            // Si la balle se dirige vers le paddle
            if ((isLeft && ballDirection.x < 0) || (!isLeft && ballDirection.x > 0)) {
                // Calculer la position prédite avec erreur
                const predictionError = (Math.random() - 0.5) * 2 * botConfig.predictionError
                
                // Utiliser une interpolation pour un mouvement plus fluide
                const predictedY = this.ball.mesh.position.y + 
                                 ballDirection.y * ballSpeed * timeToImpact * 
                                 (1 + predictionError)

                // Position cible avec interpolation
                const targetY = THREE.MathUtils.lerp(
                    paddle.mesh.position.y,
                    predictedY,
                    0.1 // Facteur de lissage
                )

                // Appliquer un délai de réaction
                if (Math.random() > botConfig.reactionDelay) {
                    // Calculer le nouveau déplacement avec limite de vitesse
                    const movement = Math.min(
                        paddleSpeed,
                        Math.abs(targetY - paddle.mesh.position.y)
                    ) * Math.sign(targetY - paddle.mesh.position.y)

                    // Appliquer le mouvement avec les limites
                    const newY = paddle.mesh.position.y + movement
                    paddle.mesh.position.y = THREE.MathUtils.clamp(
                        newY,
                        minPaddleY,
                        maxPaddleY
                    )
                }
            } else {
                // Retour au centre plus fluide
                const centerY = 0
                const movement = THREE.MathUtils.lerp(
                    paddle.mesh.position.y,
                    centerY,
                    0.05 // Facteur de lissage pour le retour au centre
                )
                
                paddle.mesh.position.y = movement
            }
        }

        // Mise à jour des paddles bots
        if (this.config.paddles.controls.leftBot) {
            movePaddleBot(this.paddleLeft, true)
        }
        if (this.config.paddles.controls.rightBot) {
            movePaddleBot(this.paddleRight, false)
        }
    }
}