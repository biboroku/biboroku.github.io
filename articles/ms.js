document.addEventListener("DOMContentLoaded", () => {
    const difficulties = [
      { rows: 9, cols: 9, mines: 10 },
      { rows: 16, cols: 16, mines: 40 },
      { rows: 30, cols: 16, mines: 99 },
      { rows: 50, cols: 50, mines: 500 },
    ];
  
    const board = document.getElementById("board");
    let cells;
    let rows;
    let cols;
  
    document.getElementById("start").addEventListener("click", () => {
      const diff = document.getElementById("difficulty").value;
      startGame(difficulties[diff]);
    });
  
    function startGame({ rows: r, cols: c, mines }) {
      showMessage("");
      rows = r;
      cols = c;
      cells = createCells(rows, cols, mines);
      renderBoard(board, cells, rows, cols);
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
  
    function renderBoard(board, cells, rows, cols) {
      board.innerHTML = "";
      board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      cells.forEach((cell, index) => {
        const el = document.createElement("div");
        el.classList.add("cell");
        el.addEventListener("click", () => revealCell(index));
        el.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          toggleFlag(index);
        });
        board.appendChild(el);
      });
    }
  
    function getCellIndex(row, col) {
      return row * cols + col;
    }
  
    function getCellRowCol(index) {
      return { row: Math.floor(index / cols), col: index % cols };
    }
  
    function getNeighbors(index) {
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
          cell.classList.add        ("mine");
          gameOver();
        }
        return;
      }
  
      const minesAround = countMinesAround(index);
      if (minesAround > 0) {
        cell.classList.add(`cell-${minesAround}`);
        cell.textContent = minesAround;
        if (!isChained) {
          checkForAutoReveal(index, minesAround);
        }
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
          }
        } else if (cell.isFlagged) {
          board.children[index].classList.add("incorrect-flag");
        }
      });
      showMessage("ゲームオーバー");
    }
  
    function showMessage(message) {
      const messageEl = document.querySelector("h2");
      messageEl.textContent = message;
    }
  
    function checkForAutoReveal(index, minesAround) {
      const neighbors = getNeighbors(index);
      const flaggedNeighbors = neighbors.filter((neighbor) => cells[neighbor].isFlagged);
      if (minesAround === flaggedNeighbors.length) {
        const unflaggedNeighbors = neighbors.filter((neighbor) => !cells[neighbor].isFlagged);
        unflaggedNeighbors.forEach((neighbor) => revealCell(neighbor, true));
      }
    }
  });
    