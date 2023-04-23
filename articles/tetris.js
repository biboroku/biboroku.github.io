// ここでは、簡略化のために、基本的なテトリス機能だけを実装します。

const board = document.getElementById('board');
const rows = 20;
const cols = 10;

// ボードを初期化
function createBoard() {
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
    }
}

createBoard();

// ここからゲームの詳細なロジックを実装することができます。
// 例えば、テトリミノの形状や動き、スコアの計算、レベルアップなどを追加できます。
const boardMatrix = new Array(rows).fill(null).map(() => new Array(cols).fill(0));

const shapes = [
    [
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 1],
        [1, 0],
        [1, 0]
    ],
    [
        [1, 1],
        [0, 1],
        [0, 1]
    ]
];

class Tetrimino {
    constructor(shape, x, y) {
        this.shape = shape;
        this.x = x;
        this.y = y;
    }
}

function createTetrimino() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return new Tetrimino(shape, Math.floor((cols - shape[0].length) / 2), 0);
}

function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function collide(matrix, tetrimino) {
    for (let y = 0; y < tetrimino.shape.length; y++) {
        for (let x = 0; x < tetrimino.shape[y].length; x++) {
            if (tetrimino.shape[y][x] &&
                (matrix[y + tetrimino.y] && matrix[y + tetrimino.y][x + tetrimino.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(matrix, tetrimino) {
    for (let y = 0; y < tetrimino.shape.length; y++) {
        for (let x = 0; x < tetrimino.shape[y].length; x++) {
            if (tetrimino.shape[y][x]) {
                matrix[y + tetrimino.y][x + tetrimino.x] = 1;
            }
        }
    }
}

function removeLine(matrix) {
    outer: for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (!matrix[y][x]) {
                continue outer;
            }
        }

        matrix.splice(y, 1);
        matrix.unshift(new Array(cols).fill(0));
    }
}

function draw(matrix, tetrimino) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const index = y * cols + x;
            board.children[index].classList.toggle('filled', matrix[y][x] || (tetrimino.shape[y - tetrimino.y] && tetrimino.shape[y - tetrimino.y][x - tetrimino.x]));
            }
        }
    }
    
    function moveDown() {
        currentTetrimino.y++;
        if (collide(boardMatrix, currentTetrimino)) {
            currentTetrimino.y--;
            merge(boardMatrix, currentTetrimino);
            removeLine(boardMatrix);
            currentTetrimino = createTetrimino();
            if (collide(boardMatrix, currentTetrimino)) {
                gameOver();
            }
        }
    }
    
    function moveLeft() {
        currentTetrimino.x--;
        if (collide(boardMatrix, currentTetrimino)) {
            currentTetrimino.x++;
        }
    }
    
    function moveRight() {
        currentTetrimino.x++;
        if (collide(boardMatrix, currentTetrimino)) {
            currentTetrimino.x--;
        }
    }
    
    function rotateTetrimino() {
        const prevShape = currentTetrimino.shape;
        currentTetrimino.shape = rotate(currentTetrimino.shape);
        if (collide(boardMatrix, currentTetrimino)) {
            currentTetrimino.shape = prevShape;
        }
    }
    
    function control(event) {
        switch (event.key) {
            case 'ArrowUp':
                rotateTetrimino();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                moveDown();
                break;
        }
    }
    
    function gameOver() {
        clearInterval(gameInterval);
        alert('ゲームオーバー');
        window.location.reload();
    }
    
    document.addEventListener('keydown', control);
    
    let currentTetrimino = createTetrimino();
    const gameInterval = setInterval(() => {
        moveDown();
        draw(boardMatrix, currentTetrimino);
    }, 500);
    
    function startGame() {
        createBoard();
    
        currentTetrimino = createTetrimino();
        gameInterval = setInterval(() => {
            moveDown();
            draw(boardMatrix, currentTetrimino);
        }, 500);
    }
    
    const startButton = document.getElementById('start-btn');
    startButton.addEventListener('click', startGame);
    