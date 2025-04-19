import * as THREE from "three";
import { gameRegistry } from "../core/GameRegistry.js";

export class Paddle {
	constructor({ color = 0xff0000, isLeft = false } = {}) {
		this.context = gameRegistry.getCurrentContext();
		this.config = this.context.config;
		this.isLeft = isLeft;
		this.isBot = isLeft
			? this.config.paddles.controls.leftBot
			: this.config.paddles.controls.rightBot;

		const height = this.config.paddles.length;
		const width = this.config.paddles.width;
		const depth = this.config.paddles.depth;
		const geometry = new THREE.BoxGeometry(width, height, depth);
		const material = new THREE.MeshBasicMaterial({ color: color });
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.x =
			(this.config.board.width / 2 - width / 2) * (isLeft ? -1 : 1);
		this.mesh.position.y = 0;
		this.context.scene.add(this.mesh);
	}

	get maxY() {
		return (
			this.config.board.height / 2 -
			this.config.paddles.length / 2 -
			this.config.board.wallWidth / 2
		);
	}

	get minY() {
		return (
			-this.config.board.height / 2 +
			this.config.paddles.length / 2 +
			this.config.board.wallWidth / 2
		);
	}

	get speed() {
		const { ball } = this.context.boardManager;
		return ball.speed * this.config.paddles.controls.speed;
	}

	moveUp() {
		if (this.mesh.position.y < this.maxY) {
			this.mesh.position.y += this.speed;
		}
	}

	moveDown() {
		if (this.mesh.position.y > this.minY) {
			this.mesh.position.y -= this.speed;
		}
	}

	updateBot(ball, botConfig) {
		const ballDirection = ball.direction;
		const ballSpeed = ball.speed;
		const paddleSpeed = ballSpeed * this.config.paddles.controls.speed;
		const reactionDelay = botConfig.reactionDelay;

		// Introduire un délai de réaction pour la mise à jour de la direction
		if (!this.lastReactionTime) {
			this.lastReactionTime = performance.now();
		}

		const currentTime = performance.now();
		if (currentTime - this.lastReactionTime >= reactionDelay) {
			// Mettre à jour la direction prédite uniquement après le délai
			this.lastReactionTime = currentTime;

			const distanceX = this.isLeft
				? this.mesh.position.x - ball.mesh.position.x
				: ball.mesh.position.x - this.mesh.position.x;
			const timeToImpact = Math.abs(distanceX / (ballSpeed * ballDirection.x));

			if (
				(this.isLeft && ballDirection.x < 0) ||
				(!this.isLeft && ballDirection.x > 0)
			) {
				const predictionError =
					(Math.random() - 0.5) * 2 * botConfig.predictionError;

				const paddleRandomOffset =
					(Math.random() - 0.5) * this.config.paddles.length * 0.5;

				this.predictedY =
					ball.mesh.position.y +
					ballDirection.y * ballSpeed * timeToImpact * (1 + predictionError) +
					paddleRandomOffset;
			} else {
				this.predictedY = 0; // Retourner au centre si la balle ne se dirige pas vers le paddle
			}
		}

		// Effectuer le mouvement vers la position prédite
		const targetY = THREE.MathUtils.lerp(
			this.mesh.position.y,
			this.predictedY || 0,
			0.1
		);

		const movement =
			Math.min(paddleSpeed, Math.abs(targetY - this.mesh.position.y)) *
			Math.sign(targetY - this.mesh.position.y);

		const newY = this.mesh.position.y + movement;
		this.mesh.position.y = THREE.MathUtils.clamp(newY, this.minY, this.maxY);
	}
}
