class Minesweeper {
    constructor(rows, cols, mines) {
      this.rows = rows;
      this.cols = cols;
      this.mines = mines;
      this.flags = 0;
      this.board = [];
      this.createBoard();
    }
  
    createBoard() {
      // Initialize cells
      for (let i = 0; i < this.rows; i++) {
        const row = [];
        for (let j = 0; j < this.cols; j++) {
          row.push({ mine: false, adjacent: 0, open: false, flag: false });
        }
        this.board.push(row);
      }
  
      // Place mines
      let placedMines = 0;
      while (placedMines < this.mines) {
        const x = Math.floor(Math.random() * this.rows);
        const y = Math.floor(Math.random() * this.cols);
  
        if (!this.board[x][y].mine) {
          this.board[x][y].mine = true;
          placedMines++;
        }
      }
  
      // Calculate adjacent mine counts
      for (let x = 0; x < this.rows; x++) {
        for (let y = 0; y < this.cols; y++) {
          if (!this.board[x][y].mine) {
            const adjacentMines = this.getAdjacentCells(x, y).filter((cell) => cell.mine).length;
            this.board[x][y].adjacent = adjacentMines;
          }
        }
      }
    }
  
    getAdjacentCells(x, y) {
      const adjacentCells = [];
  
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          if (xOffset === 0 && yOffset === 0) continue;
          const newX = x + xOffset;
          const newY = y + yOffset;
  
          if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.cols) {
            adjacentCells.push(this.board[newX][newY]);
          }
        }
      }
  
      return adjacentCells;
    }
  
    openCell(x, y) {
      const cell = this.board[x][y];
  
      if (cell.open || cell.flag) return false;
  
      cell.open = true;
  
      if (cell.mine) {
        return true;
      }
  
      if (cell.adjacent === 0) {
        this.getAdjacentCells(x, y).forEach((adjacentCell) => {
          const newX = adjacentCell.x;
          const newY = adjacentCell.y;
          this.openCell(newX, newY);
        });
      }
  
      return false;
    }
  
    toggleFlag(x, y) {
      const cell = this.board[x][y];
  
      if (cell.open) return;
  
      cell.flag = !cell.flag;
      if (cell.flag) {
        this.flags++;
      } else {
        this.flags--;
      }
    }
  
    isGameOver() {
      for (let x = 0; x < this.rows; x++) {
        for (let y = 0; y < this.cols; y++) {
          const cell = this.board[x][y];
          if (cell.mine && cell.open) return true;
        }
      }
      return false;
    }
  
    isGameWon() {
      let unopenedCells = 0;
      for (let x = 0; x < this.rows; x++) {
        for (let y = 0; y < this.cols; y++) {
            const cell = this.board[x][y];
            if (!cell.open) unopenedCells++;
          }
        }
        return unopenedCells === this.mines;
      }
    }
    
    const gameContainer = document.getElementById("game-container");
    const startButton = document.getElementById("start");
    const difficultySelect = document.getElementById("difficulty");
    
    const difficulties = [
      { rows: 9, cols: 9, mines: 10 },
      { rows: 16, cols: 16, mines: 40 },
      { rows: 30, cols: 16, mines: 99 },
      { rows: 50, cols: 50, mines: 500 },
      { rows: 100, cols: 100, mines: 2000 },
    ];
    
    let game;
    
    function createGame(difficulty) {
      game = new Minesweeper(difficulty.rows, difficulty.cols, difficulty.mines);
      renderGame();
    }
    
    function renderGame() {
      gameContainer.innerHTML = "";
      const table = document.createElement("table");
      table.classList.add("game-board");
    
      for (let x = 0; x < game.rows; x++) {
        const row = document.createElement("tr");
        for (let y = 0; y < game.cols; y++) {
          const cell = game.board[x][y];
          const cellElement = document.createElement("td");
          cellElement.classList.add("cell");
          cellElement.dataset.open = cell.open;
          cellElement.dataset.mine = cell.mine;
          cellElement.dataset.adjacent = cell.adjacent;
          cellElement.dataset.flag = cell.flag;
    
          cellElement.addEventListener("click", () => {
            game.openCell(x, y);
            if (game.isGameOver()) {
              alert("ゲームオーバー");
            } else if (game.isGameWon()) {
              alert("おめでとう！勝利です！");
            }
            renderGame();
          });
    
          cellElement.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            game.toggleFlag(x, y);
            renderGame();
          });
    
          row.appendChild(cellElement);
        }
        table.appendChild(row);
      }
    
      gameContainer.appendChild(table);
    }
    
    startButton.addEventListener("click", () => {
      const difficulty = difficulties[difficultySelect.value];
      createGame(difficulty);
    });
    
    createGame(difficulties[0]);
    