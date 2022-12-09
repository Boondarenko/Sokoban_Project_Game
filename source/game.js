import Router from "./router.js";
import { start } from "./gameStarter.js";

export default class Game {
   gameContainer;
   constructor(gameContainer) {
      this.gameContainer = gameContainer;
   }

   startGame() {
      Router.loadPage(Router.pages.mainGamePage)
      .then((page) => {
         gameContainer.innerHTML = page;
         start();
      });
   }
}