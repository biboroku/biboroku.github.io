const levels = [
    { rows: 9, cols: 9, mines: 10 },
    { rows: 16, cols: 16, mines: 40 },
    { rows: 30, cols: 16, mines: 99 },
    { rows: 50, cols: 50, mines: 500 }
  ];
  
  document.querySelector("#start").addEventListener("click", () => {
    const level = levels[document.querySelector("#difficulty").value];
    startGame(level.rows, level.cols, level.mines);
  });
  
  function startGame(rows, cols, mines) {
    const board = document.querySelector("#board");
    const message = document.querySelector("h2");
    message.textContent = "";
  
<<<<<<< HEAD
    function startGame({ rows: r, cols: c, mines }) {
      showMessage("");
      rows = r;
      cols = c;
      cells = createCells(rows, cols, mines);
      renderBoard(board, cells, rows, cols);
      document.documentElement.style.setProperty("--board-width", width);
    }
  
    function createCells(rows, cols, mines) {
      const cells = new Array(rows * cols).fill(null).map((_, i) => ({
        index: i,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
      }));
  
      let placedMines = 0;
      while (placedMines < mines) {
        const index = Math.floor(Math.random() * cells.length);
        if (!cells[index].isMine) {
          cells[index].isMine = true;
          placedMines++;
        }
      }
      return cells;
    }
  
    function renderBoard() {
        board.innerHTML = "";
        for (let index = 0; index < cells.length; index++) {
          const el = document.createElement("div");
          el.className = "cell";
          el.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            toggleFlag(index);
          });
          el.addEventListener("click", () => revealCell(index));
          board.appendChild(el);
        }
      }      
=======
    board.innerHTML = "";
    board.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  
    const cells = [];
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => revealCell(i));
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleFlag(i);
      });
      board.appendChild(cell);
      cells.push({ isMine: false, isRevealed: false, isFlagged: false });
    }
  
    for (let i = 0; i < mines; i++) {
      let index;
      do {
        index = Math.floor(Math.random() * cells.length);
      } while (cells[index].isMine);
      cells[index].isMine = true;
    }
>>>>>>> parent of 6f1d076 (Update ms.js)
  
    function getCellIndex(row, col) {
      return row * cols + col;
    }
  
    function getCellRowCol(index) {
      return { row: Math.floor(index / cols), col: index % cols };
    }
  
    function getNeighbors(index) {
<<<<<<< HEAD
      const { row, col } = getCellRowCol(index);
      const neighbors = [];
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r === row && c === col) continue;
          if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
          neighbors.push(getCellIndex(r, c));
        }
      }
      return neighbors;
    }
  
    function countMinesAround(index) {
      return getNeighbors(index).reduce((count, neighbor) => count + (cells[neighbor].isMine ? 1 : 0), 0);
    }
  
    function revealCell(index, isChained) {
        if (cells[index].isRevealed || cells[index].isFlagged) return;
        cells[index].isRevealed = true;
        const cell = board.children[index];
        cell.classList.add("uncovered");
      
        if (cells[index].isMine) {
          if (!isChained) {
            cell.classList.add("mine");
            gameOver();
          }
          return;
        }
      
        const minesAround = countMinesAround(index);
        if (minesAround > 0) {
          cell.classList.add(`cell-${minesAround}`);
          cell.textContent = minesAround;
        } else {
          getNeighbors(index).forEach((neighbor) => revealCell(neighbor, true));
        }
      
        if (checkVictory()) {
          showMessage("勝利！おめでとうございます！");
        }
      }                       
  
    function toggleFlag(index) {
        if (cells[index].isRevealed) return;
        cells[index].isFlagged = !cells[index].isFlagged;
        const cell = board.children[index];
        cell.classList.toggle("flag");
        cell.textContent = cells[index].isFlagged ? "F" : "";
      }      
  
    function checkVictory() {
      return cells.every((cell) => (cell.isMine && cell.isFlagged) || (!cell.isMine && cell.isRevealed));
    }
  
    function gameOver() {
      cells.forEach((cell, index) => {
        if (cell.isMine) {
          board.children[index].classList.add("mine");
          if (cell.isFlagged) {
            board.children[index].classList.add("correct-flag");
=======
        const { row, col } = getCellRowCol(index);
        const neighbors = [];
        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue;
            if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
            neighbors.push(getCellIndex(r, c));
>>>>>>> parent of 6f1d076 (Update ms.js)
          }
        }
        return neighbors;
      }
    
      function countMinesAround(index) {
        return getNeighbors(index).reduce((count, neighbor) => count + (cells[neighbor].isMine ? 1 : 0), 0);
      }
    
      function revealCell(index) {
        if (cells[index].isRevealed || cells[index].isFlagged) return;
        cells[index].isRevealed = true;
        const cell = board.children[index];
        cell.classList.add("uncovered");
    
        if (cells[index].isMine) {
          cell.classList.add("mine");
          gameOver();
          return;
        }
    
        const minesAround = countMinesAround(index);
        if (minesAround > 0) {
          cell.classList.add(`cell-${minesAround}`);
          cell.textContent = minesAround;
        } else {
          getNeighbors(index).forEach(revealCell);
        }
    
        if (checkVictory()) {
          showMessage("勝利！おめでとうございます！");
        }
      }
    
      function toggleFlag(index) {
        if (cells[index].isRevealed) return;
        cells[index].isFlagged = !cells[index].isFlagged;
        const cell = board.children[index];
        cell.classList.toggle("flagged");
        cell.textContent = cells[index].isFlagged ? "F" : "";
      }
    
      function checkVictory() {
        return cells.every(
          (cell, index) =>
            (cell.isFlagged && cell.isMine) || (!cell.isMine && cell.isRevealed)
        );
      }
    
      function gameOver() {
        cells.forEach((cell, index) => {
          if (cell.isMine) {
            const el = board.children[index];
            el.textContent = "●";
          } else if (cell.isFlagged) {
            const el = board.children[index];
            el.classList.remove("flagged");
            el.classList.add("false-flag");
            el.textContent = "F";
          }
        });
        showMessage("ゲームオーバー");
      }
    
      function showMessage(msg) {
        const message = document.querySelector("h2");
        message.textContent = msg;
      }
    }
      