import { gameRegistry } from "./GameRegistry.js";
import * as THREE from "three";

export class ScoreMonitor {
	constructor(container, leftPlayer, rightPlayer) {
		this.leftPlayer = leftPlayer;
		this.rightPlayer = rightPlayer;
		this.leftPlayerName = leftPlayer?.displayName || "Marvin";
		this.rightPlayerName = rightPlayer?.displayName || "Marvin";
		this.context = gameRegistry.getCurrentContext();
		this.scores = {
			left: 0,
			right: 0,
		};
		this.container = container;
		if (this.container)
			this.container.innerText =
				this.leftPlayerName +
				" " +
				this.scores.left +
				" VS " +
				this.rightPlayerName +
				" " +
				this.scores.right;
	}

	update() {
		const ball = this.context.boardManager.ball;
		const config = this.context.config;
		const boundaryX = config.board.width / 2 + 20;

		if (ball.mesh.position.x > boundaryX || ball.mesh.position.x < -boundaryX) {
			const scoringSide = ball.mesh.position.x > boundaryX ? "left" : "right";
			return this.handleScore(scoringSide);
		}
	}

	handleScore(scoringSide) {
		this.scores[scoringSide]++;

		this.context.boardManager.ball.reset();
		const randomY = (Math.random() - 0.5) * 0.5;
		this.context.boardManager.ball.direction = new THREE.Vector3(
			scoringSide === "left" ? 1 : -1,
			randomY,
			0
		).normalize();

		if (typeof this.onScore === "function") {
			this.onScore(this.scores);
		}
		if (this.container)
			this.container.innerText =
				this.leftPlayerName +
				" " +
				this.scores.left +
				" VS " +
				this.rightPlayerName +
				" " +
				this.scores.right;
		if (this.scores[scoringSide] >= this.context.config.score.max) {
			this.onEndMatch(scoringSide, this);
			return 1;
		}
		return 0;
	}

	reset() {
		this.scores = {
			left: 0,
			right: 0,
		};
	}

	setScoreCallback(callback) {
		this.onScore = callback;
	}

	onEndMatch(winnerSide, instance) {}
}
