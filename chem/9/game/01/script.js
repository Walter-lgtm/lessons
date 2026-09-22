// ==========================================
// 1. БАЗА ДАННЫХ ХИМИЧЕСКИХ ИОНОВ И ПРАВИЛ
// ==========================================
const IONS_POOL = {
    "H+":   { type: "cation", charge: 1,  html: "H<sup>+</sup>" },
    "Na+":  { type: "cation", charge: 1,  html: "Na<sup>+</sup>" },
    "K+":   { type: "cation", charge: 1,  html: "K<sup>+</sup>" },
    "NH4+": { type: "cation", charge: 1,  html: "NH<sub>4</sub><sup>+</sup>" },
    "Ba2+": { type: "cation", charge: 2,  html: "Ba<sup>2+</sup>" },
    "Ca2+": { type: "cation", charge: 2,  html: "Ca<sup>2+</sup>" },
    "Cu2+": { type: "cation", charge: 2,  html: "Cu<sup>2+</sup>" },
    "Ag+":  { type: "cation", charge: 1,  html: "Ag<sup>+</sup>" },
    "Al3+": { type: "cation", charge: 3,  html: "Al<sup>3+</sup>" },

    "OH-":   { type: "anion", charge: -1, html: "OH<sup>-</sup>" },
    "Cl-":   { type: "anion", charge: -1, html: "Cl<sup>-</sup>" },
    "NO3-":  { type: "anion", charge: -1, html: "NO<sub>3</sub><sup>-</sup>" },
    "CO32-": { type: "anion", charge: -2, html: "CO<sub>3</sub><sup>2-</sup>" },
    "SO42-": { type: "anion", charge: -2, html: "SO<sub>4</sub><sup>2-</sup>" },
    "PO43-": { type: "anion", charge: -3, html: "PO<sub>4</sub><sup>3-</sup>" }
};

// ==========================================
// 2. НАСТРОЙКИ ИГРОВОГО ДВИЖКА
// ==========================================
const COLS = 14;
const ROWS = 8;

let grid = [];
let currentPiece = null;
let nextPieceId = "";
let score = 0;
let level = 1;
let gameActive = false;
let isPaused = false;
let gameTimerId = null;
let fallSpeed = 1000;
let soundEnabled = true;

// DOM Элементы
const glass = document.getElementById("chemistry-glass");
const formulaBoard = document.getElementById("formula-board");
const levelVal = document.getElementById("level-val");
const scoreVal = document.getElementById("score-val");
const nextPreview = document.getElementById("next-ion-preview");
const startScreen = document.getElementById("start-screen");
const rulesScreen = document.getElementById("rules-screen");
const gameoverScreen = document.getElementById("gameover-screen");
const gameContainer = document.getElementById("game-container");
const finalScore = document.getElementById("final-score");
const bgMusic = document.getElementById("bg-music");
const reactionSound = document.getElementById("reaction-sound");
const toggleSoundBtn = document.getElementById("toggle-sound");

// ==========================================
// 3. УПРАВЛЕНИЕ ИГРОВЫМ ПРОЦЕССОМ
// ==========================================
function startGame() {
    startScreen.classList.add("hidden");
    rulesScreen.classList.add("hidden");
    gameoverScreen.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    score = 0;
    level = 1;
    fallSpeed = 1000;
    gameActive = true;
    isPaused = false;

    document.getElementById("btn-pause").textContent = "⏸️";

    updateCounters();
    renderGridStructure();

    nextPieceId = getRandomIonId();
    spawnPiece();

    resetTimer();
    stopMusic(); // Музыка играет только в меню
}

function resetTimer() {
    clearInterval(gameTimerId);
    gameTimerId = setInterval(() => {
        if (gameActive && !isPaused) {
            movePiece(0, 1);
        }
    }, fallSpeed);
}

function togglePause() {
    if (!gameActive) return;
    isPaused = !isPaused;
    document.getElementById("btn-pause").textContent = isPaused ? "▶️" : "⏸️";
    formulaBoard.textContent = isPaused ? "ПАУЗА" : "—";
}

function getRandomIonId() {
    const keys = Object.keys(IONS_POOL);
    return keys[Math.floor(Math.random() * keys.length)];
}

function spawnPiece() {
    const id = nextPieceId;
    nextPieceId = getRandomIonId();
    updateNextPreview();

    currentPiece = {
        id: id,
        x: Math.floor(COLS / 2),
        y: 0,
        data: IONS_POOL[id]
    };

    if (grid[currentPiece.y][currentPiece.x] !== null) {
        gameOver();
    } else {
        renderGrid();
    }
}

function updateNextPreview() {
    const ion = IONS_POOL[nextPieceId];
    nextPreview.innerHTML = ion.html;
    nextPreview.style.color = ion.type === "cation" ? "#ef4444" : "#3b82f6";
}

// ==========================================
// 4. ДВИЖЕНИЕ ПЛАШЕК И СТОЛКНОВЕНИЯ
// ==========================================
function movePiece(dx, dy) {
    if (!gameActive || isPaused || !currentPiece) return false;

    const newX = currentPiece.x + dx;
    const newY = currentPiece.y + dy;

    if (isValidMove(newX, newY)) {
        currentPiece.x = newX;
        currentPiece.y = newY;
        renderGrid();
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

function isValidMove(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
    return grid[y][x] === null;
}

function lockPiece() {
    grid[currentPiece.y][currentPiece.x] = {
        id: currentPiece.id,
        data: currentPiece.data
    };
    currentPiece = null;

    // Game Over: если плашка зафиксировалась на самом верхнем ряду
    if (grid[0][currentPiece ? currentPiece.x : 0] !== null) {
        // Проверяем — есть ли что-то в ряду 0
        let topRowFilled = false;
        for (let c = 0; c < COLS; c++) {
            if (grid[0][c] !== null) {
                topRowFilled = true;
                break;
            }
        }
        if (topRowFilled) {
            gameOver();
            return;
        }
    }

    checkChemicalReactions();
}

// ==========================================
// 5. УМНАЯ ХИМИЧЕСКАЯ ЛОГИКА (КЛАСТЕРЫ)
// ==========================================
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
                    totalCharge += block.data.charge;
                    if (block.data.type === "cation") cations[block.id] = (cations[block.id] || 0) + 1;
                    if (block.data.type === "anion") anions[block.id] = (anions[block.id] || 0) + 1;
                });

                if (totalCharge === 0
                    && Object.keys(cations).length > 0
                    && Object.keys(anions).length > 0
                    && isClusterBalanced(cluster)) {

                    processReaction(cluster, cations, anions);
                    reactionOccurred = true;
                }
            }
        }
    }

    if (reactionOccurred) {
        setTimeout(() => {
            applyGravity();
            renderGrid();
            checkChemicalReactions();
        }, 500);
    } else {
        spawnPiece();
    }
}

// Поиск связных элементов BFS
function findCluster(startR, startC, visited, cluster) {
    let queue = [{ r: startR, c: startC }];
    visited[startR][startC] = true;

    while (queue.length > 0) {
        let curr = queue.shift();
        cluster.push(curr);

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
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

// Проверка локальной нейтрализации
function isClusterBalanced(cluster) {
    for (const cell of cluster) {
        const block = grid[cell.r][cell.c];
        const needed = Math.abs(block.data.charge);
        let sumOpposite = 0;

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dr, dc] of directions) {
            const nr = cell.r + dr;
            const nc = cell.c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const neighbor = grid[nr][nc];
                if (neighbor && neighbor.data.type !== block.data.type) {
                    sumOpposite += Math.abs(neighbor.data.charge);
                }
            }
        }

        if (sumOpposite < needed) {
            return false;
        }
    }
    return true;
}

function processReaction(cluster, cations, anions) {
    const result = checkSubstanceProperty(cations, anions);

    formulaBoard.innerHTML = result.label;
    formulaBoard.style.color = result.color;

    let points = cluster.length * 15;
    if (result.status === "PRECIPITATE") points += 50;
    if (result.status === "GAS") points += 70;
    score += points;

    if (score > level * 300) {
        level++;
        fallSpeed = Math.max(200, fallSpeed - 150);
        resetTimer();
    }
    updateCounters();

    // Звук реакции
    playReactionSound();

    // Визуальные эффекты
    cluster.forEach(cell => {
        const domEl = document.querySelector(`[data-r="${cell.r}"][data-c="${cell.c}"]`);
        if (domEl) {
            if (result.status === "PRECIPITATE") {
                domEl.style.backgroundColor = result.color;
                domEl.classList.add("reaction-bounce");
            } else if (result.status === "GAS") {
                domEl.classList.add("reaction-bounce");
            } else {
                domEl.classList.add("reaction-bounce");
            }
        }
        grid[cell.r][cell.c] = null;
    });
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
// 6. ПРОВЕРКА СВОЙСТВ ВЕЩЕСТВА
// ==========================================
function checkSubstanceProperty(cations, anions) {
    const catName = Object.keys(cations)[0];
    const anName = Object.keys(anions)[0];

    // Газы
    if (catName === "H+" && anName === "CO32-") return { status: "GAS", label: "CO<sub>2</sub> ↑ + H<sub>2</sub>O", color: "#e2e8f0" };
    if (catName === "H+" && anName === "S2-") return { status: "GAS", label: "H<sub>2</sub>S ↑", color: "#cbd5e1" };

    // Осадки
    if (catName === "Ba2+" && anName === "SO42-") return { status: "PRECIPITATE", label: "BaSO<sub>4</sub> ↓", color: "#ffffff" };
    if (catName === "Ag+" && anName === "Cl-") return { status: "PRECIPITATE", label: "AgCl ↓", color: "#f8fafc" };
    if (catName === "Cu2+" && anName === "OH-") return { status: "PRECIPITATE", label: "Cu(OH)<sub>2</sub> ↓", color: "#38bdf8" };
    if (catName === "Ca2+" && anName === "CO32-") return { status: "PRECIPITATE", label: "CaCO<sub>3</sub> ↓", color: "#e2e8f0" };
    if (catName === "Ba2+" && anName === "CO32-") return { status: "PRECIPITATE", label: "BaCO<sub>3</sub> ↓", color: "#e2e8f0" };

    const isActiveBase = ["Na+", "K+", "NH4+"].includes(catName);
    if (!isActiveBase && ["CO32-", "PO43-"].includes(anName)) {
        return { status: "PRECIPITATE", label: "Осадок ↓", color: "#e2e8f0" };
    }
    if (!isActiveBase && anName === "OH-" && catName !== "H+") {
        return { status: "PRECIPITATE", label: "Осадок гидроксида ↓", color: "#f1f5f9" };
    }

    return { status: "DISSOLVE", label: "Растворимо", color: "#4ade80" };
}

// ==========================================
// 7. ОТРИСОВКА И РЕНДЕРИНГ
// ==========================================
function renderGridStructure() {
    glass.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            const w = 100 / COLS;
            const h = 100 / ROWS;
            cell.style.left = (c * w) + "%";
            cell.style.top = (r * h) + "%";
            cell.style.width = w + "%";
            cell.style.height = h + "%";
            glass.appendChild(cell);
        }
    }
}

function renderGrid() {
    document.querySelectorAll(".ion-block").forEach(el => el.remove());

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== null) {
                createBlockDOM(c, r, grid[r][c].id, grid[r][c].data, false);
            }
        }
    }

    if (currentPiece) {
        createBlockDOM(currentPiece.x, currentPiece.y, currentPiece.id, currentPiece.data, true);
    }
}

function createBlockDOM(x, y, id, data, isCurrent) {
    const block = document.createElement("div");
    block.className = "ion-block " + data.type;
    if (isCurrent) block.classList.add("current-piece");

    block.setAttribute("data-r", y);
    block.setAttribute("data-c", x);

    const w = 100 / COLS;
    const h = 100 / ROWS;
    block.style.left = (x * w) + "%";
    block.style.top = (y * h) + "%";
    block.style.width = w + "%";
    block.style.height = h + "%";

    block.innerHTML = data.html;
    glass.appendChild(block);
}

function updateCounters() {
    levelVal.textContent = String(level).padStart(2, "0");
    scoreVal.textContent = String(score).padStart(5, "0");
}

// ==========================================
// 8. ЗВУК И МУЗЫКА
// ==========================================
function playReactionSound() {
    if (!soundEnabled) return;
    reactionSound.currentTime = 0;
    reactionSound.play().catch(() => {});
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    toggleSoundBtn.textContent = soundEnabled ? "🔊" : "🔇";
    if (soundEnabled) {
        startMusic();
    } else {
        stopMusic();
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
// 9. GAME OVER И НАВИГАЦИЯ
// ==========================================
function gameOver() {
    gameActive = false;
    clearInterval(gameTimerId);
    stopMusic();
    gameContainer.classList.add("hidden");
    gameoverScreen.classList.remove("hidden");
    finalScore.textContent = score;
}

function backToMenu() {
    gameActive = false;
    isPaused = false;
    clearInterval(gameTimerId);
    stopMusic();

    gameContainer.classList.add("hidden");
    rulesScreen.classList.add("hidden");
    gameoverScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    startMusic(); // Музыка снова играет в меню
}

function showRules() {
    startScreen.classList.add("hidden");
    rulesScreen.classList.remove("hidden");
}

// ==========================================
// 10. УПРАВЛЕНИЕ (КЛАВИАТУРА + КНОПКИ)
// ==========================================
document.addEventListener("keydown", (e) => {
    if (!gameActive) return;
    if (isPaused && e.key !== " ") return;

    switch (e.key) {
        case "ArrowLeft":
            e.preventDefault();
            movePiece(-1, 0);
            break;
        case "ArrowRight":
            e.preventDefault();
            movePiece(1, 0);
            break;
        case "ArrowDown":
            e.preventDefault();
            dropPieceFast();
            break;
        case " ":
            e.preventDefault();
            togglePause();
            break;
    }
});

function setupMobileControls() {
    const bindBtn = (id, action) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            action();
        }, { passive: false });

        btn.addEventListener("mousedown", () => {
            action();
        });

        btn.addEventListener("click", () => {
            action();
        });
    };

    // Боковые кнопки (десктоп)
    bindBtn("btn-left", () => movePiece(-1, 0));
    bindBtn("btn-right", () => movePiece(1, 0));
    bindBtn("btn-down", () => dropPieceFast());
    bindBtn("btn-pause", togglePause);

    // Мобильные кнопки
    bindBtn("btn-mobile-left", () => movePiece(-1, 0));
    bindBtn("btn-mobile-down", () => dropPieceFast());
    bindBtn("btn-mobile-right", () => movePiece(1, 0));
    bindBtn("btn-mobile-pause", togglePause);
}

// ==========================================
// 11. ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("rules-btn").addEventListener("click", showRules);
document.getElementById("back-to-menu-btn").addEventListener("click", backToMenu);
document.getElementById("restart-from-menu-btn").addEventListener("click", backToMenu);
toggleSoundBtn.addEventListener("click", toggleSound);

setupMobileControls();

// Музыка на стартовом экране (потребует первого клика в некоторых браузерах)
startMusic();
