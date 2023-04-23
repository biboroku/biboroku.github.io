document.addEventListener('DOMContentLoaded', () => {
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('start');
    const grid = document.querySelector('.grid');
    const messageElement = document.getElementById('message');
    const timerElement = document.getElementById('timer');

    let firstClick = true;
    let revealedCells = 0;
    let mines;
    let timerInterval;
    let startTime;

    const difficulties = {
        beginner: {rows: 9, cols: 9, mines: 10},
        intermediate: {rows: 16, cols: 16, mines: 40},
        advanced: {rows: 30, cols: 16, mines: 99},
        superhuman: {rows: 50, cols: 50, mines: 500},
    };

    startButton.addEventListener('click', () => {
        const difficulty = difficulties[difficultySelect.value];
        startGame(difficulty);
    });

    function startGame(difficulty) {
        clearInterval(timerInterval);

        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${difficulty.cols}, 30px)`;
        grid.style.gridTemplateRows = `repeat(${difficulty.rows}, 30px)`;

        firstClick = true;
        revealedCells = 0;
        mines = new Set();

        for (let i = 0; i < difficulty.rows * difficulty.cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('mousedown', (event) => handleClick(event, i, difficulty));
            grid.appendChild(cell);
        }
    }

    function handleClick(event, index, difficulty) {
        if (firstClick) {
            messageElement.textContent = '';
            placeMines(index, difficulty);
            revealAdjacent(index, difficulty);
            firstClick = false;

            startTime = performance.now();
            timerInterval = setInterval(updateTimer, 10);
            timerElement.textContent = '00:00.00';
        } else {
            const cell = grid.children[index];
            if (event.button === 0 && !cell.classList.contains('flagged') && !cell.classList.contains('revealed')) {
                if (mines.has(index)) {
                    cell.style.backgroundColor = 'red';
                    revealMines(difficulty);
                    messageElement.textContent = 'GAME OVER!!!';
                    clearInterval(timerInterval);
                    startGame(difficulty);
                } else {
                    revealAdjacent(index, difficulty);
                }
            } else if (event.button === 2 && !cell.classList.contains('revealed')) {
                toggleFlag(cell);
            }
        }

        checkWin(difficulty);
    }

    function updateTimer() {
        const elapsed = performance.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const centiseconds = Math.floor((elapsed % 1000) / 10);

        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
    }

    function placeMines(clickedIndex, difficulty) {
        while (mines.size < difficulty.mines) {
            const index = Math.floor(Math.random() * difficulty.rows * difficulty.cols);
            const isAdjacent = getAdjacentIndexes(clickedIndex, difficulty).some((adjacentIndex) => adjacentIndex === index);
            if (index !== clickedIndex && !isAdjacent) {
                mines.add(index);
            }
        }
    }

    function toggleFlag(cell) {
        if (cell.classList.contains('flagged')) {
            cell.classList.remove('flagged');
            cell.textContent = '';
        } else {
            cell.classList.add('flagged');
            cell.textContent = 'F';
        }
    }

    function revealMines(difficulty) {
        for (let i = 0; i < difficulty.rows * difficulty.cols; i++) {
            const cell = grid.children[i];
            if (mines.has(i)) {
                cell.textContent = '●';
                cell.style.color = 'red';
            } else if (cell.classList.contains('flagged')) {
                cell.style.textDecoration = 'line-through';
            }
        }
    }

    function revealAdjacent(index, difficulty) {
        const cell = grid.children[index];
        if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) return;

        const adjacentMineCount = getAdjacentIndexes(index, difficulty).filter((adjacentIndex) => mines.has(adjacentIndex)).length;

        cell.classList.add('revealed');
        revealedCells++;

        if (adjacentMineCount > 0) {
            cell.textContent = adjacentMineCount;
            cell.dataset.number = adjacentMineCount;
            cell.addEventListener('mousedown', (event) => {
                if (event.button === 0) {
                    checkAutoReveal(index, difficulty);
                }
            });
        } else {
            getAdjacentIndexes(index, difficulty).forEach((adjacentIndex) => revealAdjacent(adjacentIndex, difficulty));
        }

        checkWin(difficulty);
    }

    function checkAutoReveal(index, difficulty) {
        const adjacentIndexes = getAdjacentIndexes(index, difficulty);
        const flaggedCount = adjacentIndexes.filter((adjacentIndex) => grid.children[adjacentIndex].classList.contains('flagged')).length;
        const mineCount = adjacentIndexes.filter((adjacentIndex) => mines.has(adjacentIndex)).length;

        if (flaggedCount === mineCount) {
            adjacentIndexes.forEach((adjacentIndex) => revealAdjacent(adjacentIndex, difficulty));
        }
    }

    function checkWin(difficulty) {
        if (revealedCells === difficulty.rows * difficulty.cols - difficulty.mines) {
            messageElement.innerHTML = 'GAME CLEAR!!!<br>STARTボタンで再プレイ';
            startGame(difficulty);
        }
    }

    function getAdjacentIndexes(index, difficulty) {
        const row = Math.floor(index / difficulty.cols);
        const col = index % difficulty.cols;
        const adjacentIndexes = [];

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < difficulty.rows && c >= 0 && c < difficulty.cols && !(r === row && c === col)) {
                    adjacentIndexes.push(r * difficulty.cols + c);
                }
            }
        }

        return adjacentIndexes;
    }

    // Prevent the context menu from appearing on right-click
    grid.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
});

const toggleInstructionsButton = document.getElementById('toggleInstructions');
const instructions = document.getElementById('instructions');

toggleInstructionsButton.addEventListener('click', () => {
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
    } else {
        instructions.style.display = 'none';
    }
});
