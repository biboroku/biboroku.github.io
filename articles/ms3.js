class Minesweeper {
    constructor() {
        this.difficulties = [
            { rows: 9, cols: 9, mines: 10 },
            { rows: 16, cols: 16, mines: 40 },
            { rows: 30, cols: 16, mines: 99 },
            { rows: 50, cols: 50, mines: 500 },
            { rows: 100, cols: 100, mines: 2000 },
        ];
        this.board = document.getElementById("gameBoard");
        this.startButton = document.getElementById("start");
        this.difficultySelector = document.getElementById("difficulty");

        this.startButton.addEventListener("click", () => {
            this.startGame();
        });
    }

    startGame() {
        this.board.innerHTML = '';
        this.board.style.width = `${this.difficulties[this.difficultySelector.value].cols * 32}px`;
        this.generateEmptyBoard();
        this.firstClick = true;
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
        // ここにセルを開く処理を書く
    }

    toggleFlag(row, col) {
        // ここにフラグを立てる処理を書く
    }
}

window.onload = () => {
    let game = new Minesweeper();
};