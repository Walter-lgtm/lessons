// ==========================================
// 1. БАЗА ДАННЫХ ХИМИЧЕСКИХ ИОНОВ
// ==========================================
const IONS_POOL = {
    "H+":   { type: "cation", charge: 1,  html: "H<sup>+</sup>",   img: "" },
    "Na+":  { type: "cation", charge: 1,  html: "Na<sup>+</sup>",  img: "" },
    "K+":   { type: "cation", charge: 1,  html: "K<sup>+</sup>",   img: "" },
    "NH4+": { type: "cation", charge: 1,  html: "NH<sub>4</sub><sup>+</sup>", img: "" },
    "Ba2+": { type: "cation", charge: 2,  html: "Ba<sup>2+</sup>", img: "" },
    "Ca2+": { type: "cation", charge: 2,  html: "Ca<sup>2+</sup>", img: "" },
    "Cu2+": { type: "cation", charge: 2,  html: "Cu<sup>2+</sup>", img: "" },
    "Ag+":  { type: "cation", charge: 1,  html: "Ag<sup>+</sup>",  img: "" },
    "Al3+": { type: "cation", charge: 3,  html: "Al<sup>3+</sup>", img: "" },

    "OH-":  { type: "anion", charge: -1, html: "OH<sup>-</sup>",    img: "" },
    "Cl-":  { type: "anion", charge: -1, html: "Cl<sup>-</sup>",    img: "" },
    "NO3-": { type: "anion", charge: -1, html: "NO<sub>3</sub><sup>-</sup>", img: "" },
    "CO32-":{ type: "anion", charge: -2, html: "CO<sub>3</sub><sup>2-</sup>", img: "" },
    "SO42-":{ type: "anion", charge: -2, html: "SO<sub>4</sub><sup>2-</sup>", img: "" },
    "PO43-":{ type: "anion", charge: -3, html: "PO<sub>4</sub><sup>3-</sup>", img: "" }
};

// ==========================================
// 2. НАСТРОЙКИ ИГРОВОГО ДВИЖКА
// ==========================================
const COLS = 14;
const ROWS = 8;

let grid = [];
let currentPiece = null;
let nextPiece = null;
let gameInterval = null;
let isGameRunning = false;
let isPaused = false;
let score = 0;
let level = 1;
let dropSpeed = 600;
let soundEnabled = true;

// DOM
const glassEl = document.getElementById('chemistry-glass');
const formulaBoard = document.getElementById('formula-board');
const scoreEl = document.getElementById('score-val');
const levelEl = document.getElementById('level-val');
const nextPreview = document.getElementById('next-ion-preview');

const startBtn = document.getElementById('start-btn');
const rulesBtn = document.getElementById('rules-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const restartFromMenuBtn = document.getElementById('restart-from-menu-btn');
const pauseBtn = document.getElementById('btn-pause');
const toggleSoundBtn = document.getElementById('toggle-sound');

const bgMusic = document.getElementById('bg-music');
const reactionSound = document.getElementById('reaction-sound');

const startScreen = document.getElementById('start-screen');
const rulesScreen = document.getElementById('rules-screen');
const gameContainer = document.getElementById('game-container');
const gameoverScreen = document.getElementById('gameover-screen');
const rotateHint = document.getElementById('rotate-hint');

// ==========================================
// 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================
function initGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            row.push(null);
        }
        grid.push(row);
    }
}

function randomIon() {
    const keys = Object.keys(IONS_POOL);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return { id: key, ...IONS_POOL[key] };
}

function createPiece() {
    return {
        ion: randomIon(),
        x: Math.floor((COLS - 1) / 2),
        y: 0
    };
}

function renderGlass() {
    glassEl.innerHTML = '';

    // Сетка
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            const w = 100 / COLS;
            const h = 100 / ROWS;
            cell.style.left = c * w + '%';
            cell.style.top = r * h + '%';
            cell.style.width = w + '%';
            cell.style.height = h + '%';
            glassEl.appendChild(cell);
        }
    }

    // Зафиксированные плашки
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const block = grid[r][c];
            if (block) {
                createBlockDOM(c, r, block.ion, false);
            }
        }
    }

    // Текущая падающая плашка
    if (currentPiece) {
        createBlockDOM(currentPiece.x, currentPiece.y, currentPiece.ion, true);
    }
}

function createBlockDOM(x, y, ion, isFalling) {
    const el = document.createElement('div');
    el.className = 'ion-block';
    const w = 100 / COLS;
    const h = 100 / ROWS;
    el.style.left = x * w + '%';
    el.style.top = y * h + '%';
    el.style.width = w + '%';
    el.style.height = h + '%';

    if (ion.type === 'cation') {
        el.style.background = isFalling ? '#86efac' : '#4ade80';
        el.style.color = '#000';
    } else {
        el.style.background = isFalling ? '#fca5a5' : '#ef4444';
        el.style.color = isFalling ? '#000' : '#fff';
    }

    if (ion.img) {
        const img = document.createElement('img');
        img.src = ion.img;
        img.style.width = '80%';
        img.style.height = '80%';
        img.style.objectFit = 'contain';
        el.appendChild(img);
    } else {
        el.innerHTML = ion.html;
    }

    glassEl.appendChild(el);
}

function updateStats() {
    scoreEl.textContent = score.toString().padStart(5, '0');
    levelEl.textContent = level.toString().padStart(2, '0');
}

function showFormula(formula) {
    formulaBoard.textContent = formula;
}

function updateNextPreview() {
    if (!nextPiece) return;
    nextPreview.innerHTML = nextPiece.ion.html;
    nextPreview.style.color = nextPiece.ion.type === 'cation' ? '#ef4444' : '#3b82f6';
}

// ==========================================
// 4. ЛОГИКА ДВИЖЕНИЯ И СТОЛКНОВЕНИЙ
// ==========================================
function collides(piece, dx, dy) {
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    if (newX < 0 || newX >= COLS) return true;
    if (newY >= ROWS) return true;
    if (grid[newY][newX] !== null) return true;
    return false;
}

function movePiece(dx, dy) {
    if (!currentPiece || isPaused || !isGameRunning) return false;

    if (!collides(currentPiece, dx, dy)) {
        currentPiece.x += dx;
        currentPiece.y += dy;
        renderGlass();
        return true;
    }

    if (dy > 0) {
        lockPiece();
    }
    return false;
}

function dropPieceFast() {
    while (movePiece(0, 1)) {}
}

function lockPiece() {
    const { ion, x, y } = currentPiece;
    grid[y][x] = { ion };
    currentPiece = null;

    if (y === 0) {
        gameOver();
        return;
    }

    checkChemicalReactions();
}

// ==========================================
// 5. УМНАЯ ХИМИЧЕСКАЯ ЛОГИКА (КЛАСТЕРЫ)
// ==========================================
function findCluster(startR, startC, visited, cluster) {
    let queue = [{ r: startR, c: startC }];
    visited[startR][startC] = true;

    while (queue.length > 0) {
        let curr = queue.shift();
        cluster.push(curr);

        const directions = [[0,1], [0,-1], [1,0], [-1,0]];
        for (let [dr, dc] of directions) {
            let nr = curr.r + dr;
            let nc = curr.c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                if (grid[nr][nc] !== null && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.push({ r: nr, c: nc });
                }
            }
        }
    }
}

function isClusterBalanced(cluster) {
    for (const cell of cluster) {
        const block = grid[cell.r][cell.c];
        const needed = Math.abs(block.ion.charge);
        let sumOpposite = 0;

        const directions = [[-1,0], [1,0], [0,-1], [0,1]];
        for (const [dr, dc] of directions) {
            const nr = cell.r + dr;
            const nc = cell.c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const neighbor = grid[nr][nc];
                if (neighbor && neighbor.ion.type !== block.ion.type) {
                    sumOpposite += Math.abs(neighbor.ion.charge);
                }
            }
        }

        if (sumOpposite < needed) return false;
    }
    return true;
}

function checkSubstanceProperty(cations, anions) {
    const catName = Object.keys(cations)[0];
    const anName = Object.keys(anions)[0];

    // Газы
    if (catName === "H+" && anName === "CO32-") return { status: "GAS", label: "CO2 \u2191 + H2O", color: "#e2e8f0" };

    // Осадки
    if (catName === "Ba2+" && anName === "SO42-") return { status: "PRECIPITATE", label: "BaSO4 \u2193", color: "#ffffff" };
    if (catName === "Ag+" && anName === "Cl-") return { status: "PRECIPITATE", label: "AgCl \u2193", color: "#f8fafc" };
    if (catName === "Cu2+" && anName === "OH-") return { status: "PRECIPITATE", label: "Cu(OH)2 \u2193", color: "#38bdf8" };

    const isActiveBase = ["Na+", "K+", "NH4+"].includes(catName);
    if (!isActiveBase && ["CO32-", "PO43-"].includes(anName)) {
        return { status: "PRECIPITATE", label: "\u041e\u0441\u0430\u0434\u043e\u043a \u2193", color: "#e2e8f0" };
    }
    if (!isActiveBase && anName === "OH-" && catName !== "Ca2+" && catName !== "H+") {
        return { status: "PRECIPITATE", label: "\u0413\u0438\u0434\u0440\u043e\u043a\u0441\u0438\u0434 \u2193", color: "#f1f5f9" };
    }

    return { status: "DISSOLVE", label: "\u0420\u0430\u0441\u0442\u0432\u043e\u0440\u0438\u043c\u043e", color: "#4ade80" };
}

function checkChemicalReactions() {
    let visited = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    let reactionOccurred = false;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== null && !visited[r][c]) {
                let cluster = [];
                findCluster(r, c, visited, cluster);

                let totalCharge = 0;
                let cations = {};
                let anions = {};

                cluster.forEach(cell => {
                    const block = grid[cell.r][cell.c];
                    totalCharge += block.ion.charge;
                    if (block.ion.type === "cation") cations[block.ion.id] = (cations[block.ion.id] || 0) + 1;
                    if (block.ion.type === "anion") anions[block.ion.id] = (anions[block.ion.id] || 0) + 1;
                });

                if (totalCharge === 0
                    && Object.keys(cations).length > 0
                    && Object.keys(anions).length > 0
                    && isClusterBalanced(cluster)) {

                    const result = checkSubstanceProperty(cations, anions);

                    // Вывод формулы
                    formulaBoard.innerHTML = result.label;
                    formulaBoard.style.color = result.color;

                    // Очки
                    let points = cluster.length * 15;
                    if (result.status === "PRECIPITATE") points += 50;
                    if (result.status === "GAS") points += 70;
                    score += points;

                    // Уровень
                    if (score > level * 300) {
                        level++;
                        dropSpeed = Math.max(200, dropSpeed - 150);
                        resetTimer();
                    }
                    updateStats();

                    // Звук
                    playReactionSound();

                    // Анимация удаления
                    cluster.forEach(cell => {
                        const domEl = document.querySelector('.ion-block[style*="left: ' + (cell.c * (100/COLS)) + '%"][style*="top: ' + (cell.r * (100/ROWS)) + '%"]');
                        if (domEl) {
                            domEl.classList.add('reaction-bounce');
                        }
                        grid[cell.r][cell.c] = null;
                    });

                    reactionOccurred = true;
                }
            }
        }
    }

    if (reactionOccurred) {
        setTimeout(() => {
            applyGravity();
            renderGlass();
            checkChemicalReactions();
        }, 400);
    } else {
        spawnPiece();
    }
}

function applyGravity() {
    for (let c = 0; c < COLS; c++) {
        let emptyRow = ROWS - 1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][c] !== null) {
                if (r !== emptyRow) {
                    grid[emptyRow][c] = grid[r][c];
                    grid[r][c] = null;
                }
                emptyRow--;
            }
        }
    }
}

// ==========================================
// 6. УПРАВЛЕНИЕ ИГРОВЫМ ПРОЦЕССОМ
// ==========================================
function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece();
    updateNextPreview();

    if (grid[currentPiece.y][currentPiece.x] !== null) {
        gameOver();
    } else {
        renderGlass();
    }
}

function startGame() {
    startScreen.classList.add('hidden');
    rulesScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    initGrid();
    score = 0;
    level = 1;
    dropSpeed = 600;
    isGameRunning = true;
    isPaused = false;

    currentPiece = createPiece();
    nextPiece = createPiece();
    updateNextPreview();

    updateStats();
    renderGlass();

    pauseBtn.textContent = '\u23f8\ufe0f';
    showFormula('\u2014');

    resetTimer();
    stopMusic();
}

function resetTimer() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (isGameRunning && !isPaused) {
            movePiece(0, 1);
        }
    }, dropSpeed);
}

function togglePause() {
    if (!isGameRunning) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '\u25b6\ufe0f' : '\u23f8\ufe0f';
    formulaBoard.textContent = isPaused ? '\u041f\u0410\u0423\u0417\u0410' : '\u2014';
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    stopMusic();

    gameContainer.classList.add('hidden');
    gameoverScreen.classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

function backToMenu() {
    isGameRunning = false;
    isPaused = false;
    clearInterval(gameInterval);
    stopMusic();

    gameContainer.classList.add('hidden');
    rulesScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');

    startMusic();
}

function showRules() {
    startScreen.classList.add('hidden');
    rulesScreen.classList.remove('hidden');
}

// ==========================================
// 7. ЗВУК И МУЗЫКА
// ==========================================
function playReactionSound() {
    if (!soundEnabled) return;
    reactionSound.currentTime = 0;
    reactionSound.play().catch(() => {});
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    toggleSoundBtn.textContent = soundEnabled ? '\ud83d\udd0a' : '\ud83d\udd07';

    if (soundEnabled) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => {});
    } else {
        bgMusic.pause();
    }
}

function startMusic() {
    if (soundEnabled) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => {});
    }
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

// ==========================================
// 8. УПРАВЛЕНИЕ (КЛАВИАТУРА + КНОПКИ)
// ==========================================
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            e.preventDefault();
            dropPieceFast();
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

function setupControls() {
    const bindBtn = (id, action) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            action();
        }, { passive: false });

        btn.addEventListener('mousedown', () => {
            action();
        });

        btn.addEventListener('click', () => {
            action();
        });
    };

    bindBtn('btn-left', () => movePiece(-1, 0));
    bindBtn('btn-right', () => movePiece(1, 0));
    bindBtn('btn-down', () => dropPieceFast());
    bindBtn('btn-pause', togglePause);
}

// ==========================================
// 9. ОПРЕДЕЛЕНИЕ ОРИЕНТАЦИИ ЭКРАНА
// ==========================================
function checkOrientation() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile && isPortrait) {
        rotateHint.classList.remove('hidden');
    } else {
        rotateHint.classList.add('hidden');
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// ==========================================
// 10. ИНИЦИАЛИЗАЦИЯ
// ==========================================
startBtn.addEventListener('click', startGame);
rulesBtn.addEventListener('click', showRules);
backToMenuBtn.addEventListener('click', backToMenu);
restartFromMenuBtn.addEventListener('click', backToMenu);
toggleSoundBtn.addEventListener('click', toggleSound);

setupControls();
checkOrientation();
startMusic();