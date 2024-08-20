let rows, cols;

function updateGridSize() {
    const cellSize = 25;
    rows = Math.floor(window.innerHeight / cellSize) - 10;
    cols = Math.floor(window.innerWidth / cellSize) - 5;

    document.documentElement.style.setProperty('--rows', rows);
    document.documentElement.style.setProperty('--cols', cols);

    grid = createGrid(rows, cols);
    nextGrid = createGrid(rows, cols);
    drawGrid();
}

window.addEventListener('resize', updateGridSize);
updateGridSize(); 

function createGrid(rows, cols) {
    const arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols).fill(false);
    }
    return arr;
}

function drawGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (grid[row][col]) {
                cell.classList.add('alive');
            }
            cell.addEventListener('click', () => {
                grid[row][col] = !grid[row][col];
                drawGrid();
            });
            container.appendChild(cell);
        }
    }
}

drawGrid();

function updateGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const aliveNeighbors = countAliveNeighbors(row, col);
            if (grid[row][col]) {
                nextGrid[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3;
            } else {
                nextGrid[row][col] = aliveNeighbors === 3;
            }
        }
    }
    [grid, nextGrid] = [nextGrid, grid];
}

function countAliveNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const x = row + i;
            const y = col + j;
            if (x >= 0 && x < rows && y >= 0 && y < cols) {
                count += grid[x][y] ? 1 : 0;
            }
        }
    }
    return count;
}

let isRunning = false;
let intervalId;

function startGame() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(() => {
            updateGrid();
            drawGrid();
        }, 10);
    }
}

function pauseGame() {
    isRunning = false;
    clearInterval(intervalId);
}

function resetGame() {
    isRunning = false;
    clearInterval(intervalId);
    grid = createGrid(rows, cols);
    drawGrid();
}

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('pause').addEventListener('click', pauseGame);
document.getElementById('reset').addEventListener('click', resetGame);
