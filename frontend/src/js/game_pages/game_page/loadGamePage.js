import { Game } from "../../pong-game/src/core/Game.js";
import { load_page } from "../../router.js";
import { playersCount } from "../setting_page/util/playersCount.js";

export function loadGamePage({game, container, config, players=[]}) {
	console.log("Players : ", players)
	let leftPlayer = null
	let rightPlayer = null
	if (players.length)
		leftPlayer = players[0]
	if (players.length == 2)
		rightPlayer = players[1]
	let containerSetup = document.getElementById("pong-setup");
	if (!containerSetup) {
		const app = document.getElementById("main_container");
		app.innerHTML = "";
		containerSetup = document.createElement("div");
		containerSetup.id = "pong-setup";
		app.appendChild(containerSetup);
	}
	if (game)
		game.cleanup();
	containerSetup.innerHTML = "";
	containerSetup.id = "game-container";
	const score = document.createElement("div");
	score.id = "score-container";
	const scoreText = document.createElement("p");
	scoreText.id = "score-text";
	score.appendChild(scoreText);
	containerSetup.appendChild(score);
	container = document.createElement("div");
	container.id = "pong-game";
	containerSetup.appendChild(container);
	game = new Game(container, config, scoreText, leftPlayer, rightPlayer);
	// game.scoreMonitor.onScore = (scores) => {
	// 	console.log("scores", scores)
	// }
	game.scoreMonitor.onEndMatch = (winnerSide) => {
		// TODO END MATCH PAGE
		console.log(winnerSide);
		game.cleanup();
		load_page("pong");
	}
	game.start();
}
