import { Game } from "../../pong-game/src/core/Game.js";
import { load_page } from "../../router.js";
import { playersCount } from "../setting_page/util/playersCount.js";

//TODO playerVSAI renvoie au login et ne lance plus de jeu vs AI
//TODO playerVSplayer BUG TOUT puisque le site ne sait plus sur quel profile se connecter
//TODO apres un match 1v1, dashboard vide
//TODO add bouton retour pour quitter la partie ?
//TODO ouvrir modale pour connecter nouveau player plutot que l apage login
//TODO verifier qu'on a une route pour le 2eme joueur connecte sinon ca bouffe l'user principal
//TODO ajouter road api 'opponent' pour le 2eme joueur ou un truc comme ca, qui connecterq opponent au stats de l'user MAIS qui ne deconnectera pas USER (exemple = lsouquie user principal lance un match, ouvre modal de login, pop se connecte et devient OPPONENT qui recupere les stqts de user de pop MAIS ne connecte pas pop) CA FAIT SENS ?? opponent = copie de user

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
