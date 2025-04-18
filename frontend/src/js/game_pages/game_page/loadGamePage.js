import { pushHistoryRequest } from "../../api/routes/pushHistoryRequest.js";
import { displayResults } from "../../layout.js";
import { Game } from "../../pong-game/src/core/Game.js";
import { load_page } from "../../router.js";
import { playersCount } from "../setting_page/util/playersCount.js";

export function loadGamePage({game, container, config, players=[], onEndMatch}) {
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
		game.cleanup();loadGamePage
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
		if (players.length > 1)
			pushHistory()
		game.cleanup()
		let winner = null
		if (winnerSide === "left")
			winner = leftPlayer
		else if (winnerSide === "right")
			winner = rightPlayer
		displayResults(resultMsg(winner));
		if (onEndMatch)
			onEndMatch(winner)
		else
			load_page("pong");
	}
	game.start();

	function pushHistory() {
		const body = {
			player_one: leftPlayer.id,
			player_two: rightPlayer.id,
			score_p1: game.scoreMonitor.scores.left,
			score_p2: game.scoreMonitor.scores.right
		}
		console.log(body)
		pushHistoryRequest(body)
	}

	function resultMsg(winner) {
		let name = "Marvin"
		if (winner)
			name = winner.displayName
		return `${name} wins !`;
	}
}

