export default class Router {
   static pages = {
      'startPage': './source/pages/startPage.html',
      'leaderboardPage': './source/pages/leaderboard.html',
      'mainGamePage': './source/pages/mainGame.html',
      // 'playerNamePage': './source/pages/playerName.html',
   }

   static async loadPage(page) {
      const response = await fetch(page);
      return response.text();
   }
}