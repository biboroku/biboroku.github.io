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

// ...（前のコードと同じ）

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
  
    // 盤面のレイアウトを調整する
    renderBoard(rows, cols);
  }
  
  // ...（前のコードと同じ）
  
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
  
    // 背景色を変更
    cell.style.backgroundColor = "#ddd";
  
    if (revealedCount === rows * cols - mines) {
      showMessage("勝利！おめでとうございます！");
      return;
    }
  
    if (board[index] === 0) {
      getSurroundingIndexes(index, rows, cols).forEach(revealCell);
    }
  }
  
  // ...（残りのコードと同じ）
  

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
