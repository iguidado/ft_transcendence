import * as THREE from 'three'
import { gameRegistry } from './GameRegistry.js'
import { initConfig } from '../config/initConfig.js'
import { initScene } from './sceneUtils.js'
import { BoardManager } from './BoardManager.js'
import { ViewManager } from './ViewManager.js'
import { InputManager } from '../inputs/InputManager.js'
import { ScoreMonitor } from './ScoreMonitor.js'

let currId = 1

export class Game {
    constructor(container, config_custom = {}, scoreContainer) {
        this.gameId = currId++;
        this.isRunning = false;
        this.container = container || null; // Will be created by ViewManager if needed
        gameRegistry.registerContext(this.gameId, this);
        gameRegistry.setCurrentContext(this.gameId);

        this.config = initConfig(config_custom);
        this.scene = initScene();
        // Initialize board and game objects
        this.boardManager = new BoardManager();
        this.inputManager = new InputManager();
        this.viewManager = new ViewManager();
        
        // Set up resize handler with bound context
        this._handleResizeBound = this.handleResize.bind(this);
        window.addEventListener('resize', this._handleResizeBound);
        this.viewManager.render();
		this.scoreMonitor = new ScoreMonitor(scoreContainer);
    }

    addView(container, cameraConfig = {}) {
        return this.viewManager.createView(container, cameraConfig);
    }
    
    handleResize() {
        if (this.viewManager) {
            this.viewManager.handleResize();
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.viewManager.render();
        
        this._animationFrame = requestAnimationFrame(() => this.animate());
    }

    start() {
		if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
	
    stop() {
		this.isRunning = false;
        if (this._animationFrame) {
			cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
        }
    }
	
    update() {
        this.inputManager.update();
        this.updateBots();
        if (this.boardManager && this.boardManager.ball) {
            this.boardManager.ball.move();
			this.scoreMonitor.update();
        } else {
            console.warn("Ball not initialized in boardManager");
        }
    }

    cleanup() {
        this.stop();
        window.removeEventListener('resize', this._handleResizeBound);
        
        if (this.inputManager) {
            this.inputManager.cleanup();
        }
        
        if (this.viewManager) {
            this.viewManager.cleanup();
        }
        
        // Remove game from registry
        gameRegistry.contexts.delete(this.gameId);
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