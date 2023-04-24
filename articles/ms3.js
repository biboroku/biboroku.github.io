class Tile {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.isMine = false;
      this.isRevealed = false;
      this.isFlagged = false;
      this.adjacentMines = 0;
    }
  }
  
  function createBoard(rows, cols, mines) {
    const board = [];
    for (let row = 0; row < rows; row++) {
      const rowData = [];
      for (let col = 0; col < cols; col++) {
        rowData.push(new Tile(row, col));
      }
      board.push(rowData);
    }
  
    // Place mines
    let remainingMines = mines;
    while (remainingMines > 0) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        remainingMines--;
      }
    }
  
    // Calculate adjacent mines for each tile
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = board[row][col];
        if (tile.isMine) continue;
  
        directions.forEach(([dRow, dCol]) => {
          const newRow = row + dRow;
          const newCol = col + dCol;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (board[newRow][newCol].isMine) {
              tile.adjacentMines++;
            }
          }
        });
      }
    }
  
    return board;
  }
  
  function revealTile(tile, board) {
    if (tile.isRevealed || tile.isFlagged) return;
    tile.isRevealed = true;
  
    if (tile.adjacentMines === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
  
      directions.forEach(([dRow, dCol]) => {
        const newRow = tile.row + dRow;
        const newCol = tile.col + dCol;
        if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
          revealTile(board[newRow][newCol], board);
        }
      });
    }
  }
  
  function revealAdjacentTiles(tile, board) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
  
    let flaggedTiles = 0;
    directions.forEach(([dRow, dCol]) => {
      const newRow = tile.row + dRow;
      const newCol = tile.col + dCol;
      if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board [0].length) {
        const adjacentTile = board[newRow][newCol];
        if (adjacentTile.isFlagged) {
          flaggedTiles++;
        }
      }
    });
  
    if (flaggedTiles === tile.adjacentMines) {
      directions.forEach(([dRow, dCol]) => {
        const newRow = tile.row + dRow;
        const newCol = tile.col + dCol;
        if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
          revealTile(board[newRow][newCol], board);
        }
      });
    }
  }
  
  function renderBoard(board) {
    gameBoard.innerHTML = "";
    gameBoard.style.width = `${board[0].length * 30}px`;
  
    for (const row of board) {
      for (const tile of row) {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.addEventListener('click', (event) => {
          if (tile.isFlagged) return;
          revealTile(tile, board);
          if (tile.isMine) {
            alert('ゲームオーバー！');
            renderBoard(board);
          } else {
            renderBoard(board);
            if (isGameWon(board)) {
              alert('勝利！');
            }
          }
        });
  
        tileElement.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          if (tile.isRevealed) {
            revealAdjacentTiles(tile, board);
            renderBoard(board);
            if (isGameWon(board)) {
              alert('勝利！');
            }
          } else {
            tile.isFlagged = !tile.isFlagged;
            renderBoard(board);
          }
        });
  
        if (tile.isRevealed) {
          tileElement.classList.add('revealed');
          if (tile.adjacentMines > 0) {
            tileElement.textContent = tile.adjacentMines;
          }
        } else {
          if (tile.isFlagged) {
            tileElement.classList.add('flagged');
          }
        }
  
        gameBoard.appendChild(tileElement);
      }
    }
  }
  
  function isGameWon(board) {
    for (const row of board) {
      for (const tile of row) {
        if (!tile.isMine && !tile.isRevealed) {
          return false;
        }
      }
    }
    return true;
  }
  
  function startGame({ rows, cols, mines }) {
    const board = createBoard(rows, cols, mines);
    renderBoard(board);
  }
  
  