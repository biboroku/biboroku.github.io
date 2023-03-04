const ROWS = 10;
const COLS = 10;
const MINES = 10;

let board = [];
let isGameOver = false;

function initBoard() {
  for (let row = 0; row < ROWS; row++) {
    let rowArray = [];
    for (let col = 0; col < COLS; col++) {
      rowArray.push({
        isMine: false,
        isRevealed: false,
        neighbors: 0
      });
    }
    board.push(rowArray);
  }

  placeMines();
  calculateNeighbors();
}

function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    let randomRow = Math.floor(Math.random() * ROWS);
    let randomCol = Math.floor(Math.random() * COLS);
    if (!board[randomRow][randomCol].isMine) {
      board[randomRow][randomCol].isMine = true;
      minesPlaced++;
    }
  }
}

function calculateNeighbors() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let cell = board[row][col];
      if (!cell.isMine) {
        cell.neighbors = countNeighbors(row, col);
      }
    }
  }
}

function countNeighbors(row, col) {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        if (board[r][c].isMine) {
          count++;
        }
      }
    }
  }
  return count;
}

function revealCell(row, col) {
  let cell = board[row][col];
  if (cell.isRevealed || isGameOver) {
    return;
  }

  cell.isRevealed = true;
  if (cell.isMine) {
    isGameOver = true;
    alert("Game over!");
  } else if (cell.neighbors === 0) {
    revealNeighbors(row, col);
  }

  updateBoard();
}

function revealNeighbors(row, col) {
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        let cell = board[r][c];
        if (!cell.isMine && !cell.isRevealed) {
          cell.isRevealed = true;
          if (cell.neighbors === 0) {
            revealNeighbors(r, c);
          }
        }
      }
    }
  }
}

function updateBoard() {
  let table = document.getElementById("board");
  table.innerHTML = "";
  for (let row = 0; row < ROWS; row++) {
    let rowElement = document.createElement("tr");
    for (let col = 0; col < COLS; col++) {
      let cell = board[row][col];
      let cellElement = document.createElement("td");
      cellElement.classList.add("cell");
      if (cell.isRevealed) {
        if (cell.isMine) {
          cellElement.textContent = "*";
        } else if (cell.neighbors > 0) {
          cellElement.textContent = cell.neighbors;
        }
      }
      cellElement.addEventListener("click", function() {
        revealCell(row, col);
      });
      rowElement.appendChild(cellElement);
    }
    table.appendChild(rowElement);
  }
}

initBoard();