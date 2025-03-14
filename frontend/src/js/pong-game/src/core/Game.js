import * as THREE from 'three'
import { gameRegistry } from './GameRegistry.js'
import { initConfig } from '../config/initConfig.js'
import { initScene } from './sceneUtils.js'
import { BoardManager } from './BoardManager.js'
import { CameraManager } from './CameraManager.js'
import { RendererManager } from './RendererManager.js'
import { InputManager } from './InputManager.js'

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

        // Initialize board and get game objects
        this.boardManager = new BoardManager()
        this.cameraManager = new CameraManager()
        this.rendererManager = new RendererManager()
        this.handleResize()
        this.inputManager = new InputManager(this)

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
        this.inputManager.update();
        this.updateBots()
        this.boardManager.ball.move()
    }

    // Cleanup method to remove listeners
    cleanup() {
        window.removeEventListener('resize', this.resizeDebounce)
        window.removeEventListener('orientationchange', this.resizeDebounce)
        this.resizeObserver.disconnect()
    }

    updateBots() {
        const botConfig = this.config.paddles.controls.bots;

        if (this.boardManager.paddleLeft.isBot) {
            this.boardManager.paddleLeft.updateBot(this.boardManager.ball, botConfig);
        }
        if (this.boardManager.paddleRight.isBot) {
            this.boardManager.paddleRight.updateBot(this.boardManager.ball, botConfig);
        }
    }
}