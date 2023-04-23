const MINE = -1;
const FLAG = -2;

let rows, cols, mines;
let board;
let revealedCount = 0;
let flaggedCount = 0;

let timerId = null;
let startTime = null;

document.querySelector("#start").addEventListener("click", () => {
  const difficulty = document.querySelector("#difficulty").value;
  const config = [
    { rows: 9, cols: 9, mines: 10 },
    { rows: 16, cols: 16, mines: 40 },
    { rows: 30, cols: 16, mines: 99 },
    { rows: 50, cols: 50, mines: 500 },
  ][difficulty];

  startGame(config.rows, config.cols, config.mines);
});

function startGame(r, c, m) {
  rows = r;
  cols = c;
  mines = m;

  revealedCount = 0;
  flaggedCount = 0;

  resetTimer();

  document.querySelector("h2").textContent = "";
  document.querySelector("#board").innerHTML = "";
  document.querySelector("#board").addEventListener("contextmenu", (e) => e.preventDefault());

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => revealCell(i));
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      toggleFlag(i);
    });
    document.querySelector("#board").appendChild(cell);
  }
}

function createBoard(rows, cols, mines, safeIndex) {
  let minePositions = generateMinePositions(rows, cols, mines, safeIndex);
  board = new Array(rows * cols).fill(0);

  for (const pos of minePositions) {
    board[pos] = MINE;
  }

  for (let i = 0; i < rows * cols; i++) {
    if (board[i] === MINE) continue;
    board[i] = countSurroundingMines(i, rows, cols, board);
  }

  renderBoard(rows, cols);
}

function generateMinePositions(rows, cols, mines, safeIndex) {
  const positions = [];
  const safePositions = getSurroundingIndexes(safeIndex, rows, cols).concat([safeIndex]);

  while (positions.length < mines) {
    const randIndex = Math.floor(Math.random() * (rows * cols));
    if (!positions.includes(randIndex) && !safePositions.includes(randIndex)) {
      positions.push(randIndex);
    }
  }
  return positions;
}

function countSurroundingMines(index, rows, cols, board) {
  return getSurroundingIndexes(index, rows, cols)
    .map((i) => board[i])
    .filter((cell) => cell === MINE).length;
}

function getSurroundingIndexes(index, rows, cols) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /* 0, 0 */ [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  const x = index % cols;
  const y = Math.floor(index / cols);

  return directions
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(([newX, newY]) => newX >= 0 && newX < cols && newY >= 0 && newY < rows)
    .map(([newX, newY]) => newY * cols + newX);
}

function renderBoard(rows, cols) {
  const boardElement = document.querySelector("#board");
  boardElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  boardElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

function revealCell(index) {
  if (startTime === null) {
    startTimer();
    createBoard(rows, cols, mines, index);
  }

  const cell = document.querySelector(`#board > .cell:nth-child(${index + 1})`);
  if (cell.textContent === "F" || cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");
  revealedCount++;

  if (board[index] === MINE) {
    cell.textContent = "●";
    cell.style.color = "red";
    cell.style.textDecoration = "none";
    showMessage("ゲームオーバー");
    revealAllMines();
    return;
  }

  cell.textContent = board[index] || "";
  cell.style.color = ["", "blue", "green", "red", "purple", "maroon", "cyan", "black", "gray"][board[index]];

  if (revealedCount === rows * cols - mines) {
    showMessage("勝利！おめでとうございます！");
    return;
  }

  if (board[index] === 0) {
    getSurroundingIndexes(index, rows, cols).forEach(revealCell);
  }
}

function toggleFlag(index) {
  const cell = document.querySelector(`#board > .cell:nth-child(${index + 1})`);
  if (cell.classList.contains("revealed")) return;

  if (cell.textContent === "F") {
    cell.textContent = "";
    flaggedCount--;
  } else {
    cell.textContent = "F";
    flaggedCount++;
  }

  if (flaggedCount === mines && revealedCount === rows * cols - mines) {
    showMessage("勝利！おめでとうございます！");
  }
}

function revealAllMines() {
  for (let i = 0; i < rows * cols; i++) {
    if (board[i] === MINE) {
      const cell = document.querySelector(`#board > .cell:nth-child(${i + 1})`);
      if (cell.textContent !== "F") {
        cell.textContent = "●";
        cell.style.color = "red";
      }
    } else if (board[i] !== MINE && document.querySelector(`#board > .cell:nth-child(${i + 1})`).textContent === "F") {
      document.querySelector(`#board > .cell:nth-child(${i + 1})`).style.textDecoration = "line-through";
    }
  }
}

function showMessage(msg) {
  stopTimer();
  const message = document.querySelector("h2");
  message.textContent = msg + (msg === "勝利！おめでとうございます！" ? ` 経過時間: ${document.querySelector("#timer").textContent}` : "");
}

function startTimer() {
  if (timerId !== null) clearInterval(timerId);
  startTime = Date.now();
  timerId = setInterval(updateTimer, 10);
}

function formatTime(elapsedTime) {
  const minutes = Math.floor(elapsedTime / 6000);
  const seconds = Math.floor((elapsedTime % 6000) / 100);
  const centiseconds = elapsedTime % 100;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 10);
  document.querySelector("#timer").textContent = formatTime(elapsedTime);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function resetTimer() {
  if (timerId !== null) clearInterval(timerId);
  timerId = null;
  startTime = null;
  document.querySelector("#timer").textContent = "00:00.00";
}
