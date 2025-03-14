import { gameRegistry } from "./GameRegistry";
import * as THREE from "three"

export class ScoreMonitor {
    constructor() {
        this.context = gameRegistry.getCurrentContext();
        this.scores = {
            left: 0,
            right: 0
        };
    }

    update() {
        const ball = this.context.boardManager.ball;
        const config = this.context.config;
        const boundaryX = config.board.width/2 + 20;

        // Check if ball is out of bounds
        if (ball.mesh.position.x > boundaryX || ball.mesh.position.x < -boundaryX) {
            const scoringSide = ball.mesh.position.x > boundaryX ? 'left' : 'right';
            this.handleScore(scoringSide);
        }
    }

    handleScore(scoringSide) {
        // Increment score
        this.scores[scoringSide]++;

        // Reset ball with random direction
        this.context.boardManager.ball.reset();
        const randomY = (Math.random() - 0.5) * 0.5; // Random Y component between -0.25 and 0.25
        this.context.boardManager.ball.direction = new THREE.Vector3(
            scoringSide === 'left' ? 1 : -1,
            randomY,
            0
        ).normalize();

        // Trigger any score-related events or callbacks here
        if (typeof this.onScore === 'function') {
            this.onScore(this.scores);
        }
    }

    reset() {
        this.scores = {
            left: 0,
            right: 0
        };
    }

    // Optional: add callback for score updates
    setScoreCallback(callback) {
        this.onScore = callback;
    }
}