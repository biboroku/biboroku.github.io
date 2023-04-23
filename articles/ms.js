const difficulties = [
    { rows: 9, cols: 9, mines: 10 },
    { rows: 16, cols: 16, mines: 40 },
    { rows: 30, cols: 16, mines: 99 },
    { rows: 50, cols: 50, mines: 500 },
  ];
  
  const settings = document.querySelector("#settings");
  const board = document.querySelector("#board");
  
  settings.addEventListener("click", (e) => {
    if (e.target.id === "start") {
      const difficulty = parseInt(document.querySelector("#difficulty").value);
      startGame(difficulties[difficulty].rows, difficulties[difficulty].cols, difficulties[difficulty].mines);
    }
  });
  
  let timerId = null;
  let startTime = null;
  
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
    if (timerId !== null) clearInterval(timerId);
  }
  
  function resetTimer() {
    stopTimer();
    startTime = null;
    document.querySelector("#timer").textContent = "00:00.00";
  }
  
  function startGame(rows, cols, mines) {
    const mineIndexes = generateMineIndexes(rows, cols, mines);
    const mineCounts = calculateMineCounts(rows, cols, mineIndexes);
    initBoard(rows, cols, mineCounts);
    resetTimer();
  }
  
  function generateMineIndexes(rows, cols, mines) {
    const cellCount = rows * cols;
    const mineIndexes = new Set();
  
    while (mineIndexes.size < mines) {
      const index = Math.floor(Math.random() * cellCount);
      mineIndexes.add(index);
    }
  
    return mineIndexes;
  }
  
  function calculateMineCounts(rows, cols, mineIndexes) {
    const mineCounts = new Array(rows * cols).fill(0);
  
    mineIndexes.forEach((mineIndex) => {
      const row = Math.floor(mineIndex / cols);
      const col = mineIndex % cols;
  
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
  
          const newRow = row + dr;
          const newCol = col + dc;
  
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const adjacentIndex = newRow * cols + newCol;
            mineCounts[adjacentIndex]++;
          }
        }
      }
    });
  
    return mineCounts;
  }
  
  function initBoard(rows, cols, mineCounts) {
    board.innerHTML = "";
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.id = `cell-${i}`;
      cell.classList.add("cell");
  
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        setFlag(i);
      });
  
      cell.addEventListener("click", () => revealCell(i));
  
      // Add event listeners for double tap and long press
      let touchStartTime = 0;
      let longPressTimeout = null;
  
      cell.addEventListener("touchstart", (e) => {
        e.preventDefault();
        touchStartTime = Date.now();
        longPressTimeout = setTimeout(() => setFlag(i), 500);
      });
  
      cell.addEventListener("touchend", (e) => {
        e.preventDefault();
        if (Date.now() - touchStartTime < 500) {
          clearTimeout(longPressTimeout);
          if (e.targetTouches.length === 0) setFlag(i);
        }
      });
  
      cell.addEventListener("touchmove", (e) => {
        e.preventDefault();
        clearTimeout(longPressTimeout);
      });
  
      board.appendChild(cell);
    }
  }
  
  function setFlag(index) {
    const cell = document.querySelector(`#cell-${index}`);
    if (cell.classList.contains("revealed")) return;
  
    if (cell.textContent === "F") {
      cell.textContent = "";
    } else {
      cell.textContent = "F";
    }
  }
  
  function revealCell(index) {
    const cell = document.querySelector(`#cell-${index}`);
    if (cell.classList.contains("revealed") || cell.textContent === "F") return;
  
    const mineCount = mineCounts[index];
    cell.textContent = mineCount === 0 ? "" : mineCount;
    cell.classList.add("revealed");
  
    if (isMine(index)) {
      cell.textContent = "●";
      cell.classList.add("mine");
      revealAllMines();
      showMessage("ゲームオーバー");
      return;
    }
  
    if (mineCount === 0) {
      revealAdjacentCells(index);
    }
  
    if (isVictory()) {
      showMessage("勝利！おめでとうございます！");
    }
  }
  
  function revealAdjacentCells(index) {
    // ...
  }
  
  function revealAllMines() {
    // ...
  }
  
  function isVictory() {
    // ...
  }
  
  function isMine(index) {
    // ...
  }
  
  function showMessage(msg) {
    stopTimer();
    const message = document.querySelector("h2");
    message.textContent = msg + (msg === "勝利！おめでとうございます！" ? ` 経過時間: ${document.querySelector("#timer").textContent}` : "");
  }
    