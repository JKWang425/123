const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const GRID_SIZE = 30;
const CELL_SIZE = 20;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let speed = 200;
let gameLoopInterval;
let isPaused = false;
let isGameOver = true;

function initGame() {
    snake = [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    speed = 200;
    isPaused = false;
    isGameOver = false;
    
    scoreElement.textContent = score;
    pauseBtn.textContent = 'Pause';
    
    spawnFood();
    
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, speed);
}

function spawnFood() {
    let valid = false;
    while (!valid) {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

function gameLoop() {
    if (isPaused || isGameOver) return;
    update();
    draw();
}

function update() {
    direction = nextDirection;
    
    let head = { 
        x: snake[0].x + direction.x, 
        y: snake[0].y + direction.y 
    };

    head.x = (head.x + GRID_SIZE) % GRID_SIZE;
    head.y = (head.y + GRID_SIZE) % GRID_SIZE;

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        speed = Math.max(10, speed - 5);
        spawnFood();
        
        clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(gameLoop, speed);
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = '#fff';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
    }
});

startBtn.addEventListener('click', () => {
    initGame();
    canvas.focus();
});

pauseBtn.addEventListener('click', () => {
    togglePause();
    canvas.focus();
});

ctx.fillStyle = '#161616';
ctx.fillRect(0, 0, canvas.width, canvas.height);