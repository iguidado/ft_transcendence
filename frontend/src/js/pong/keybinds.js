import { config } from "./config.js";
import { ball, paddleLeft, paddleRight } from "./objects.js";

const keyState = {}

document.addEventListener('keydown', (event) => {
    console.log("keydown:", event.key)
    keyState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    console.log("keyup:", event.key)
    keyState[event.key] = false;
});

const maxPaddleY = config.board.height/2 - config.paddles.length/2 - config.board.wallWidth
const minPaddleY = -config.board.height/2 + config.paddles.length/2 + config.board.wallWidth

export function handleKeyPress() {
    if (keyState['ArrowUp'] && paddleRight.mesh.position.y < maxPaddleY) {
        paddleRight.mesh.position.y += ball.speed;
    }
    if (keyState['ArrowDown'] && paddleRight.mesh.position.y > minPaddleY) {
        paddleRight.mesh.position.y -= ball.speed;
    }
	if (keyState['w'] && paddleLeft.mesh.position.y < maxPaddleY) {
        paddleLeft.mesh.position.y += ball.speed;
    }
    if (keyState['s'] && paddleLeft.mesh.position.y > minPaddleY) {
        paddleLeft.mesh.position.y -= ball.speed;
    }
}