const cells = document.querySelectorAll('[data-cell]');
const turnXBox = document.getElementById('turnX');
const turnOBox = document.getElementById('turnO');
const resetButton = document.getElementById('reset');
const backToMenuButton = document.getElementById('backToMenu');
const winnerDisplay = document.getElementById('winnerDisplay');
const winnerSpan = document.getElementById('winner');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const timerElement = document.getElementById('timer');
const gridContainer = document.querySelector('.grid-container');

let turn = 'X';  // Player 1 is 'X', Player 2 is 'O'
let gameActive = true;
let board = Array(9).fill(null);
let score = { X: 0, O: 0 };
let timerInterval;
let timeLeft = 10;
const gameMode = localStorage.getItem('gameMode');  // Retrieve game mode

function handleClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (board[index] !== null || !gameActive) return;

    board[index] = turn;
    cell.textContent = turn;
    clickSound.play();

    if (checkWin()) {
        gameActive = false;
        winSound.play();
        updateScore(turn);
        displayWinner(turn);
        highlightWinningCells();
        resetButton.style.display = 'block';
        clearInterval(timerInterval);
    } else if (board.every(cell => cell !== null)) {
        gameActive = false;
        drawSound.play();
        displayWinner('تعادل');
        resetButton.style.display = 'block';
        clearInterval(timerInterval);
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        updateTurnDisplay();
        startTimer();
        if (gameMode === 'ai' && turn === 'O') {
            setTimeout(aiMove, 500);  // AI move after a short delay
        }
    }
}

function aiMove() {
    const availableCells = Array.from(cells).filter(cell => cell.textContent === '');
    if (availableCells.length === 0) return;

    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const index = Array.from(cells).indexOf(randomCell);

    board[index] = turn;
    randomCell.textContent = turn;
    clickSound.play();

    if (checkWin()) {
        gameActive = false;
        winSound.play();
        updateScore(turn);
        displayWinner(turn);
        highlightWinningCells();
        resetButton.style.display = 'block';
        clearInterval(timerInterval);
    } else if (board.every(cell => cell !== null)) {
        gameActive = false;
        drawSound.play();
        displayWinner('تعادل');
        resetButton.style.display = 'block';
        clearInterval(timerInterval);
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        updateTurnDisplay();
        startTimer();
    }
}

function updateTurnDisplay() {
    if (turn === 'X') {
        turnXBox.classList.add('active');
        turnOBox.classList.remove('active');
    } else {
        turnXBox.classList.remove('active');
        turnOBox.classList.add('active');
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        if (pattern.every(index => board[index] === turn)) {
            return pattern;
        }
    }
    return false;
}

function highlightWinningCells() {
    const pattern = checkWin();
    if (!pattern) return;

    cells.forEach((cell, index) => {
        if (pattern.includes(index)) {
            cell.classList.add('winning-cell');
        }
    });
}

function displayWinner(player) {
    winnerSpan.textContent = player === 'X' ? 'Player 1' : player === 'O' ? 'Player 2' : 'تعادل';
    winnerDisplay.style.display = 'block';
    winnerDisplay.style.opacity = 1;

    setTimeout(resetGame, 5000);
}

function resetGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    gameActive = true;
    turn = 'X';  // Reset to player 1
    resetButton.style.display = 'none';  // Hide reset button
    winnerDisplay.style.opacity = 0;  // Hide winner display
    winnerDisplay.style.display = 'none';
    updateTurnDisplay();  // Update turn display
    startTimer();  // Start timer again
}

function updateScore(player) {
    score[player]++;
    scoreX.textContent = score.X;
    scoreO.textContent = score.O;
}

function startTimer() {
    timeLeft = 10;
    timerElement.textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            turn = turn === 'X' ? 'O' : 'X';  // Switch automatically
            updateTurnDisplay();
            startTimer();  // Restart timer for the next turn
            if (gameMode === 'ai' && turn === 'O') {
                setTimeout(aiMove, 500);  // AI move after a short delay
            }
        }
    }, 1000);
}

// إضافة المستمعين للأحداث
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
backToMenuButton.addEventListener('click', () => {
    localStorage.removeItem('gameMode');  // Remove game mode
    window.location.href = 'index.html';  // العودة إلى الصفحة الرئيسية
});
startTimer();  // Start timer when the game loads
updateTurnDisplay();  // Initialize turn display