document.getElementById('startBtn').addEventListener('click', startGame);

const beginner = { rows: 9, cols: 9, mines: 10 };
const intermediate = { rows: 16, cols: 16, mines: 40 };
const advanced = { rows: 30, cols: 16, mines: 99 };
const expert = { rows: 50, cols: 50, mines: 500 };

let gameData = {};
let timer = null;

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    const config = getDifficultyConfig(difficulty);
    initGame(config);
}

function getDifficultyConfig(difficulty) {
    switch (difficulty) {
        case 'beginner':
            return beginner;
        case 'intermediate':
            return intermediate;
        case 'advanced':
            return advanced;
        case 'expert':
            return expert;
        default:
            return beginner;
    }
}

function initGame(config) {
    // ここにゲーム
    // ゲームの初期化とロジックを実装します
    gameData = {
        rows: config.rows,
        cols: config.cols,
        mines: config.mines,
        flagCount: 0,
        openCount: 0,
        firstClick: true,
        gameOver: false,
        startTime: null,
        elapsedTime: 0,
    };

    createBoard();
    setEventListeners();
    updateTimerDisplay(0);
    document.getElementById('message').innerText = '';
}

function createBoard() {
    const gameElement = document.getElementById('game');
    gameElement.innerHTML = '';

    for (let row = 0; row < gameData.rows; row++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');

        for (let col = 0; col < gameData.cols; col++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = row;
            cellElement.dataset.col = col;
            cellElement.dataset.open = 'false';
            cellElement.dataset.flag = 'false';
            cellElement.dataset.mine = 'false';
            cellElement.dataset.count = '0';
            rowElement.appendChild(cellElement);
        }

        gameElement.appendChild(rowElement);
    }
}

function setEventListeners() {
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells) {
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('contextmenu', handleCellRightClick);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (gameData.firstClick) {
        gameData.firstClick = false;
        placeMines(row, col);
        startTimer();
    }

    openCell(row, col);
}

function handleCellRightClick(event) {
    event.preventDefault();
    const cell = event.target;

    if (cell.dataset.open === 'true') return;

    cell.dataset.flag = cell.dataset.flag === 'true' ? 'false' : 'true';
}

function placeMines(excludeRow, excludeCol) {
    let placedMines = 0;
    while (placedMines < gameData.mines) {
        const row = Math.floor(Math.random() * gameData.rows);
        const col = Math.floor(Math.random() * gameData.cols);

        if (
            (row === excludeRow && col === excludeCol) ||
            isMine(row, col)
        ) {
            continue;
        }

        const cell = getCell(row, col);
        cell.dataset.mine = 'true';
        placedMines++;

        const neighbors = getNeighbors(row, col);
        for (const neighbor of neighbors) {
            if (!isMine(neighbor.row, neighbor.col)) {
                const neighborCell = getCell(
                    neighbor.row,
                    neighbor.col
                );
                neighborCell.dataset.count =
                    parseInt(neighborCell.dataset.count) + 1;
            }
        }
    }
}

function openCell(row, col) {
    if (gameData.gameOver) return;

    const cell = getCell(row, col);

    if (cell.dataset.open === 'true' || cell.dataset.flag === 'true') return;

    cell.dataset.open = 'true';

    if (cell.dataset.mine === 'true') {
        cell.dataset.wrong = 'true';
        gameOver(false);
        return;
    }

    gameData.openCount++;

    if (cell.dataset.count === '0') {
        const neighbors = getNeighbors(row, col);
        for (const neighbor of neighbors) {
            openCell(neighbor.row, neighbor.col);
        }
    }

    if (gameData.openCount === (gameData.rows * gameData.cols) - gameData.mines) {
        gameOver(true);
    }
}

function startTimer() {
    gameData.startTime = performance.now();
    timer = setInterval(updateTimer, 10);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function updateTimer() {
    const currentTime = performance.now();
    gameData.elapsedTime = currentTime - gameData.startTime;
    updateTimerDisplay(gameData.elapsedTime);
}

function updateTimerDisplay(timeInMilliseconds) {
    const timeInSeconds = timeInMilliseconds / 1000;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const centiseconds = Math.floor((timeInSeconds * 100) % 100);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').innerText = formattedTime;
}

// ユーティリティ関数
function getCell(row, col) {
    return document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
}

function getNeighbors(row, col) {
    const neighbors = [];

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (
                r >= 0 &&
                r < gameData.rows &&
                c >= 0 &&
                c < gameData.cols &&
                !(r === row && c === col)
            ) {
                neighbors.push({ row: r, col: c });
            }
        }
    }

    return neighbors;
}

function isMine(row, col) {
    const cell = getCell(row, col);
    return cell.dataset.mine === 'true';
}

function gameOver(win) {
    gameData.gameOver = true;
    stopTimer();
    revealMines(win);

    if (win) {
        document.getElementById('message').innerText = '勝利！おめでとうございます！';
    } else {
        document.getElementById('message').innerText = 'ゲームオーバー';
    }
}

function revealMines(win) {
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells) {
        if (cell.dataset.mine === 'true') {
            if (win) {
                cell.dataset.flag = 'true';
            } else {
                cell.dataset.open = 'true';
            }
        }
    }
}
