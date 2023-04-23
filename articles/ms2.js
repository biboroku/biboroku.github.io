document.addEventListener('DOMContentLoaded', () => {
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('start');
    const grid = document.querySelector('.grid');

    // 難易度に応じた設定
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
        // ゲームのロジック
    }
});
