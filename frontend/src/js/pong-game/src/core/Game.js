import * as THREE from 'three';
import { contextRegistry } from './ContextRegistry.js'
import { Paddle } from '../components/Paddle.js';
import { Ball } from '../components/Ball.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { CollitionBox } from '../components/CollitionBox.js';
import { scoreMonitor } from './scoreMonitor.js';

let currId = 1

export class Game {
    constructor(container, config_edits = {}) {
		if (!container)
			throw new Error(`Container not found`);
		this.container = container
        this.gameId = currId++
		contextRegistry.registerContext(this.gameId, this)
        this.isRunning = false

        const configManager = new ConfigManager(config_edits);
		this.config = configManager.getConfig()
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			this.container.clientWidth / this.container.clientHeight,
			0.1,
			1000
		);
		this.camera.position.z = this.config.camera.z;
		this.camera.position.x = this.config.camera.x;
		this.camera.position.y = this.config.camera.y;
		this.setupGame()
		this.setupKeyBinds()
		this.keyState = {}
    }

    animate() {
        if (!this.isRunning) return

        // Update game state
        this.update()

        // Render
        this.renderer.render(this.scene, this.camera)
        // Request next frame
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
        this.ball.move()
		scoreMonitor()
    }

	setupGame() {
		this.initSceneElements()

		// Initialiser le renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.container.appendChild(this.renderer.domElement);

		// Gestionnaire de redimensionnement
		window.addEventListener('resize', () => {
			this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		});
	}

	initSceneElements() {
		contextRegistry.setCurrentContext(this.gameId)

		this.walls = [
			new CollitionBox({
				height: this.config.board.wallWidth,
				width: this.config.board.width+this.config.board.wallWidth,
				depth: this.config.board.depth,
				y: this.config.board.height/2
			}), // top
			new CollitionBox({
				height: this.config.board.wallWidth,
				width: this.config.board.width+this.config.board.wallWidth,
				depth: this.config.board.depth,
				y: -this.config.board.height/2
			}), // bottom
		]

		// Créer les paddles
		this.paddleLeft = new Paddle({ isLeft: true });
		this.paddleRight = new Paddle({ isLeft: false });

		// Créer la balle
		this.ball = new Ball(this.context);

		// Initialiser les scores
		this.scoreLeft = 0;
		this.scoreRight = 0;
	}

	setupKeyBinds() {
		document.addEventListener('keydown', (event) => {
			this.keyState[event.key] = true;
		});
		
		document.addEventListener('keyup', (event) => {
			this.keyState[event.key] = false;
		});
	}
	
	handleKeyPress() {
		const maxPaddleY = this.config.board.height/2 - this.config.paddles.length/2 - this.config.board.wallWidth
		const minPaddleY = -this.config.board.height/2 + this.config.paddles.length/2 + this.config.board.wallWidth
		if (this.keyState['ArrowUp'] && this.paddleRight.mesh.position.y < maxPaddleY) {
			this.paddleRight.mesh.position.y += this.ball.speed / 2;
		}
		if (this.keyState['ArrowDown'] && this.paddleRight.mesh.position.y > minPaddleY) {
			this.paddleRight.mesh.position.y -= this.ball.speed / 2;
		}
		if (this.keyState['w'] && this.paddleLeft.mesh.position.y < maxPaddleY) {
			this.paddleLeft.mesh.position.y += this.ball.speed / 2;
		}
		if (this.keyState['s'] && this.paddleLeft.mesh.position.y > minPaddleY) {
			this.paddleLeft.mesh.position.y -= this.ball.speed / 2;
		}
	}
}