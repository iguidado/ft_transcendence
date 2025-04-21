import { Game } from "./src/core/Game.js";
import {teteTete} from "./src/config/preset/teteTete.js";

const game = new Game(null, teteTete);

game.start();