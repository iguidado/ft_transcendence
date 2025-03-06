import { Game } from "./src/core/Game.js";
const doc = document.body
const game1 = new Game(doc, {
    ball: { speed: 1.5 }
});

// const game2 = new Game('container2', {
//     ball: { speed: 2 }
// });

// Les deux instances démarrent de manière non-bloquante
game1.start();
// game2.start();

// On peut les arrêter individuellement
// game1.stop();
// game2.stop();