'use strict';

import Game from "./game.js";
import Router from "./router.js";

const gameContainer = document.getElementById('gameContainer');

window.addEventListener('load', () => {
   Router.loadPage(Router.pages.startPage).then(page => {
      gameContainer.innerHTML = page;
   });
});

window.addEventListener('keydown', (event) => {
   if (event.key !== 'Enter') return;

   const game = new Game(gameContainer);
   game.startGame();
});