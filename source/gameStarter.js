import Router from "./router.js";

export function start() {
   const context = canvas.getContext('2d');
   // audio
   const audioOnOff = document.getElementById('switchAudio');
   const backAudio = document.getElementById('audio');
   const audioIcon = document.getElementById('audioIcon');
   // info field
   const undoMove = document.getElementById('spanBack');
   const registerSteps = document.getElementById('spanStep');
   const registerBoxs = document.getElementById('spanBox');
   const registerLevel = document.getElementById('spanLevel');
   const windowOfVictory = document.getElementById('win');
   // image
   const manImage = document.getElementById('player');
   const boxImage = document.getElementById('box');
   const placeBoxImage = document.getElementById('boxPlace');
   const wallImage = document.getElementById('wall');
   // man state
   const MOVE_DOWN = 0;
   const MOVE_RIGHT = 1;
   const MOVE_UP = 2;
   const MOVE_LEFT = 3;
   let initialState = MOVE_DOWN;
   // for step back
   const lastStep = [];
   // current level
   let countSteps = 0;
   let currentLevel = 0;
   // current level XY
   const currentLevelXY = {
      row:0,
      col:0,
   };
   // sizes
   const CANVAS_WIDTH = 600;
   const CANVAS_HEIGHT = 600;
   const sizeField = {
      size: 0,
      biasX: 0,
   }
   // man animate
   const stateLoop = [0, 1, 0, 2];
   let stateIndex = 0;
   let animation;
   let manFrameCount = 0; 
   // levels
   let level = [];
   const allLevels = [
   
         /*
         0 - empty 
         1 - wall 
         2 - box 
         4 - place for box 
         8 - man 
         */
   
      // level 1
      [
         [1,1,1,1,1,1,1,1,1,1,1],
         [1,0,0,0,0,0,0,0,0,0,1],
         [1,0,2,0,0,0,0,0,2,0,1],
         [1,0,0,0,0,0,0,0,0,0,1],
         [1,0,0,0,0,0,0,0,0,0,1],
         [1,1,1,1,0,8,0,1,1,1,1],
         [1,0,0,0,0,0,0,0,0,0,1],
         [1,0,0,0,0,0,0,0,0,0,1],
         [1,0,4,0,0,0,0,0,4,0,1],
         [1,0,0,0,0,0,0,0,0,0,1],
         [1,1,1,1,1,1,1,1,1,1,1],
      ],
   
      // level 2
      [
         [1,1,1,1,1,1,1,1,1,1,1],
         [1,4,0,0,0,1,0,0,0,0,1],
         [1,4,0,0,0,1,2,0,2,0,1],
         [1,4,0,0,0,1,0,1,1,0,1],
         [1,4,0,0,0,0,0,8,1,0,1],
         [1,1,1,0,0,1,0,2,0,0,1],
         [1,1,1,1,0,1,2,0,0,0,1],
         [1,1,1,1,0,0,0,0,0,0,1],
         [1,1,1,1,0,0,0,0,0,0,1],
         [1,1,1,1,0,0,0,0,0,0,1],
         [1,1,1,1,1,1,1,1,1,1,1],
      ],
   
      // level 3
      [
         [1,1,1,1,1,1,1,1,1,1,1],
         [1,1,1,1,1,1,1,1,8,1,1],
         [1,4,0,0,1,0,1,0,0,0,1],
         [1,4,0,0,0,0,0,2,0,0,1],
         [1,4,0,0,1,0,1,0,2,0,1],
         [1,4,0,0,1,0,1,0,0,0,1],
         [1,1,1,0,0,0,1,2,0,0,1],
         [1,1,1,0,0,2,1,0,0,0,1],
         [1,1,1,0,0,0,0,0,0,0,1],
         [1,1,1,0,0,1,1,0,0,0,1],
         [1,1,1,1,1,1,1,1,1,1,1],
      ],
   
      // level 4
      [
         [1,1,1,1,1,1,1,1,1,1,1],
         [1,1,1,1,1,1,0,0,0,1,1],
         [1,0,1,8,1,1,0,2,0,0,1],
         [1,0,0,0,0,0,0,0,0,0,1],
         [1,0,2,0,0,2,0,0,0,0,1],
         [1,0,2,0,0,0,0,1,0,0,1],
         [1,1,1,0,1,1,1,1,0,1,1],
         [1,0,0,0,1,1,0,0,4,4,1],
         [1,0,2,0,0,0,2,0,4,4,1],
         [1,1,1,0,1,1,0,0,4,4,1],
         [1,1,1,1,1,1,1,1,1,1,1],
      ],
   
      // level 5
      [
         [1,1,1,1,1,1,1,1,1,1,1],
         [1,1,1,0,0,1,1,0,1,1,1],
         [1,1,1,4,0,0,8,0,1,1,1],
         [1,1,1,4,0,0,0,0,0,0,1],
         [1,0,1,1,4,4,0,1,0,0,1],
         [1,0,4,0,0,0,2,1,0,0,1],
         [1,1,1,2,0,0,0,1,0,1,1],
         [1,0,0,0,0,1,0,0,2,1,1],
         [1,0,2,0,0,0,2,0,0,1,1],
         [1,1,0,0,1,1,1,0,0,1,1],
         [1,1,1,1,1,1,1,1,1,1,1],
      ],
      // разобраться с концом игры
   ];
   
   function resize() {
      sizeField.size = CANVAS_HEIGHT / level.length;
      sizeField.biasX = (CANVAS_WIDTH - sizeField.size * level[0].length) / 2;
      drawCanvas();
   }
   
   function drawCanvas() {
      context.beginPath();
      context.canvas.width = CANVAS_WIDTH;
      context.canvas.height = CANVAS_HEIGHT;
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.stroke();
   
      // info box
      let boxFrom = 0;
      let avaibleBox = 0;
   
      for (let y = 0; y < level.length; y++) {
         for (let x = 0; x < level[y].length; x++) {
            // wall
            if (level[y][x] & 1) {
               drawWall(x, y);
            }
            // box
            if (level[y][x] & 2) {
               avaibleBox++;
               drawBox(x, y);
            }
            // place for box
            if (level[y][x] & 4) {
               if (level[y][x] & 2) {
                  boxFrom++;
               }
               drawPlaceBox(x, y);
            }
            // man
            if (level[y][x] & 8) {
               drawMan(x, y, 0);
               currentLevelXY.row = y;
               currentLevelXY.col = x;
            }
         }
      }
   
      setTimeout(stopMoving, 250);
      registerBoxs.innerHTML = boxFrom + '/' + avaibleBox;
   
      if (boxFrom == avaibleBox) {
         victory();
      }
   }
   
   function drawMan(x, y, frame) {
      x =  sizeField.biasX + x * sizeField.size;
      y =  y * sizeField.size;
      context.clearRect(x, y, sizeField.size, sizeField.size);
      context.drawImage(manImage, 64 * frame, 66 * initialState, 64, 66, x, y, sizeField.size, sizeField.size);
   }
   
   function drawWall(x, y) {
      x =  sizeField.biasX + x * sizeField.size;
      y =  y * sizeField.size;
      context.drawImage(wallImage, 0, 0, 65, 65, x, y, sizeField.size, sizeField.size);
   }
   
   function drawBox(x, y) {
      x =  sizeField.biasX + x * sizeField.size;
      y =  y * sizeField.size;
      context.drawImage(boxImage, 0, 0, 64, 64, x, y, sizeField.size, sizeField.size);
   }
   
   function drawPlaceBox(x, y) {
      x =  sizeField.biasX + x * sizeField.size;
      y =  y * sizeField.size;
      context.drawImage(placeBoxImage, 0, 0, 62, 64, x, y, sizeField.size, sizeField.size);
   }
   
   function state() {
      animation = null;
   
      manFrameCount++;
      if (manFrameCount < 5) {
         startMoving();
         return;
      }
   
      manFrameCount = 0;
      drawMan(currentLevelXY.col, currentLevelXY.row, stateLoop[stateIndex]);
   
      stateIndex++;
      if (stateIndex >= stateLoop.length) {
         stateIndex = 0;
      }
      startMoving();
   }
   
   function startMoving() {
      if (!animation) {
         animation = window.requestAnimationFrame(state);
      }
   }
   
   function stopMoving() {
      if (animation) {
         animation = window.cancelAnimationFrame(animation);
         animation = null;
      }
   }
   
   function collision(row1, col1, row2, col2) {
      startMoving();
   
      if (  row1 < 0 || 
            row1 > level.length || 
            col1 < 0 ||
            col1 >= level[currentLevelXY.row].length
         )
         return;
   
      if (level[row1][col1] === 1) return;
      
      // for level storage
      const returnStep = {
         col0: currentLevelXY.col,
         row0: currentLevelXY.row,
         before0: level[currentLevelXY.row][currentLevelXY.col],
         col1: col1,
         row1: row1,
         before1: level[row1][col1],
         col2: col2,
         row2: row2,
         before2: level[row2][col2],
      }
   
      lastStep.push(JSON.stringify(returnStep));
   
      if ((level[row1][col1] & 2) === 2) {
         if ((level[row2][col2] & 3) > 0) {
            lastStep.pop();
            return;
         }
         level[row2][col2] |= 2;
         level[row1][col1] ^= 2;
      }
   
      // man movement
      level[currentLevelXY.row][currentLevelXY.col] ^= 8;
      level[row1][col1] |= 8;
   
      // count steps
      countSteps++;
      registerSteps.innerHTML = lastStep.length;
   
      drawCanvas();
   }
   
   function victory() {
      windowOfVictory.style.display = 'block';
      currentLevel++;
      setTimeout(() => {
         windowOfVictory.style.display = 'none';
         lastStep.length = 0;
         countSteps = 0;
         if (currentLevel >= 5) {
            currentLevel = 0;
            Router.loadPage(Router.pages.leaderboardPage)
               .then((page) => 
               {
                  gameContainer.innerHTML = page;
               });
         }
         localStorage.setItem('currentLevel', currentLevel);
         startGame();
         drawCanvas();
      }, 1000);
   }
   
   function startGame() {
      const localLevel = localStorage.getItem('currentLevel');
      
      if (localLevel) {
         currentLevel = +localLevel;
      }
      
      registerLevel.innerHTML = currentLevel + 1;
      level = JSON.parse(JSON.stringify(allLevels[currentLevel]));
      
      manImage.onload = () => {
         resize();
      }
   
      boxImage.onload = () => {
         resize();
      }
   
      placeBoxImage.onload = () => {
         resize();
      }
   
      wallImage.onload = () => {
         resize();
      }
   }

   undoMove.addEventListener('click', () => {
      if (lastStep.length > 0) {
         const returnStep = JSON.parse(lastStep.pop());
         level[returnStep.row0][returnStep.col0] = returnStep.before0;
         level[returnStep.row1][returnStep.col1] = returnStep.before1;
         level[returnStep.row2][returnStep.col2] = returnStep.before2;
      }
      registerSteps.innerHTML = lastStep.length;
      drawCanvas();
   });

   audioOnOff.onclick = () => {
      if (!backAudio) return;
      if (backAudio.paused) {
         audioIcon.classList.remove('fa-volume-xmark');
         audioIcon.classList.add('fa-volume-high');
         backAudio.play();
      } else {
         audioIcon.classList.remove('fa-volume-high');
         audioIcon.classList.add('fa-volume-xmark');
         backAudio.pause();
      }
   }

   window.addEventListener('beforeunload', (event) => {
      event.returnValue = 'If you leave before saving, your changes will be lost';
   });

   window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') {
         initialState = MOVE_UP;
         collision(currentLevelXY.row - 1, currentLevelXY.col, currentLevelXY.row - 2, currentLevelXY.col);
      }
      
      if (event.key === 'ArrowLeft') {
         initialState = MOVE_LEFT;
         collision(currentLevelXY.row, currentLevelXY.col - 1, currentLevelXY.row, currentLevelXY.col - 2);
      }
   
      if (event.key === 'ArrowDown') {
         initialState = MOVE_DOWN;
         collision(currentLevelXY.row + 1, currentLevelXY.col, currentLevelXY.row + 2, currentLevelXY.col);
      }
   
      if (event.key === 'ArrowRight') {
         initialState = MOVE_RIGHT;
         collision(currentLevelXY.row, currentLevelXY.col + 1, currentLevelXY.row, currentLevelXY.col + 2);
      }
   });

   startGame();
}