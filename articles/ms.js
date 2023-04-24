class Minesweeper {
    constructor() {
        this.difficulties = [
            { rows: 9, cols: 9, mines: 10 },
            { rows: 16, cols: 16, mines: 40 },
            { rows: 16, cols: 30, mines: 99 },
            { rows: 50, cols: 50, mines: 500 },
            { rows: 100, cols: 100, mines: 2000 },
        ];
        this.board = document.getElementById("gameBoard");
        this.startButton = document.getElementById("start");
        this.difficultySelector = document.getElementById("difficulty");

        this.startButton.addEventListener("click", () => {
            this.startGame();
        });
        this.message = document.getElementById('message');
        this.timer = document.getElementById('timer');
        this.remainingMines = document.getElementById('remaining-mines');
    }

    startGame() {
        this.board.innerHTML = '';
        this.board.style.width = `${this.difficulties[this.difficultySelector.value].cols * 32}px`;
        this.generateEmptyBoard();
        this.firstClick = true;
        this.message.textContent = '';
        this.remainingMines.textContent = this.mines;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.timer.textContent = '0:00.00';
    }

    generateEmptyBoard() {
        let difficulty = this.difficulties[this.difficultySelector.value];
        this.rows = difficulty.rows;
        this.cols = difficulty.cols;
        this.mines = difficulty.mines;
        this.revealedCells = 0;
        this.cells = [];

        for (let i = 0; i < this.rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.cols; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.addEventListener('click', () => this.revealCell(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.toggleFlag(i, j);
                });

                this.board.appendChild(cell);
                this.cells[i][j] = {
                    element: cell,
                    mined: false,
                    flagged: false,
                    revealed: false,
                    adjacentMines: 0,
                };
            }
        }
    }

    generateBoard(row, col) {
        let placedMines = 0;
        while (placedMines < this.mines) {
            let r = Math.floor(Math.random() * this.rows);
            let c = Math.floor(Math.random() * this.cols);

            if (
                !this.cells[r][c].mined &&
                !(row === r && col === c) &&
                Math.abs(row - r) > 1 &&
                Math.abs(col - c) > 1
            ) {
                this.cells[r][c].mined = true;
                this.updateAdjacentMineCounts(r, c);
                placedMines++;
            }
        }
    }

    updateAdjacentMineCounts(row, col) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newRow = row + i;
                let newCol = col + j;

                if (
                    newRow >= 0 &&
                    newRow < this.rows &&
                    newCol >= 0 &&
                    newCol < this.cols
                ) {
                    this.cells[newRow][newCol].adjacentMines++;
                }
            }
        }
    }

    revealCell(row, col) {
        if (!this.timerInterval) {
            this.startTime = Date.now();
            this.timerInterval = setInterval(() => {
                let elapsedTime = Date.now() - this.startTime;
                let minutes = Math.floor(elapsedTime / 60000);
                let seconds = ((elapsedTime % 60000) / 1000).toFixed(2);
                this.timer.textContent = `${minutes}:${seconds}`;
            }, 10);
        }

        if (this.firstClick) {
            this.generateBoard(row, col);
            this.firstClick = false;
        }

        let cell = this.cells[row][col];

        if (cell.revealed || cell.flagged) {
            return;
        }

        cell.revealed = true;
        cell.element.classList.add('revealed');
        this.revealedCells++;

        if (cell.mined) {
            cell.element.textContent = '💣';
            this.gameOver(false);
            return;
        }

        if (cell.adjacentMines > 0) {
            cell.element.textContent = cell.adjacentMines;
            cell.element.classList.add(`adjacent-${cell.adjacentMines}`);
            cell.element.addEventListener('click', () => {
                if (cell.adjacentMines === this.getAdjacentFlags(row, col)) {
                    this.revealAdjacentCells(row, col);
                }
            });
        } else {
            this.revealAdjacentCells(row, col);
        }

        if (this.revealedCells === this.rows * this.cols - this.mines) {
            this.gameOver(true);
        }
    }

    getAdjacentFlags(row, col) {
        let flags = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newRow = row + i;
                let newCol = col + j;

                if (
                    newRow >= 0 &&
                    newRow < this.rows &&
                    newCol >= 0 &&
                    newCol < this.cols &&
                    this.cells[newRow][newCol].flagged
                ) {
                    flags++;
                }
            }
        }
        return flags;
    }

    revealAdjacentCells(row, col) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newRow = row + i;
                let newCol = col + j;

                if (
                    newRow >= 0 &&
                    newRow < this.rows &&
                    newCol >= 0 &&
                    newCol < this.cols
                ) {
                    this.revealCell(newRow, newCol);
                }
            }
        }
    }

    toggleFlag(row, col) {
        let cell = this.cells[row][col];

        if (cell.revealed) {
            return;
        }

        cell.flagged = !cell.flagged;
        cell.element.innerHTML = cell.flagged ? '<strong>F</strong>' : '';

        if (cell.flagged) {
            this.remainingMines.textContent--;
        } else {
            this.remainingMines.textContent++;
        }
    }

    gameOver(win) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let cell = this.cells[i][j];

                if (cell.mined && !cell.flagged) {
                    cell.element.textContent = '💣';
                }

                if (!cell.mined && cell.flagged) {
                    cell.element.textContent = '×';
                }

                cell.element.classList.add('revealed');
                cell.revealed = true;
            }
        }

        clearInterval(this.timerInterval);
        this.message.innerHTML = win ? '<font color="blue">GAME CLEAR!!!<font>' : '<font color="red">GAME OVER!!!<font>';
        /*自動ゲームリセット
        setTimeout(() => {
            this.startGame();
        }, 2000);
        */
    }
}

window.onload = () => {
    let game = new Minesweeper();
};

const toggleInstructionsButton = document.getElementById('toggleInstructions');
const instructions = document.getElementById('instructions');

toggleInstructionsButton.addEventListener('click', () => {
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
    } else {
        instructions.style.display = 'none';
    }
});
