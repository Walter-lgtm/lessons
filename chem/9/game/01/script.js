// ==========================================
// 1. БАЗА ДАННЫХ ХИМИЧЕСКИХ ИОНОВ И ПРАВИЛ
// ==========================================

const IONS_POOL = {
    // Катионы (+)
    "H+":   { type: "cation", charge: 1,  html: "H<sup>+</sup>",   img: "" },
    "Na+":  { type: "cation", charge: 1,  html: "Na<sup>+</sup>",  img: "" },
    "K+":   { type: "cation", charge: 1,  html: "K<sup>+</sup>",   img: "" },
    "NH4+": { type: "cation", charge: 1,  html: "NH<sub>4</sub><sup>+</sup>", img: "" },
    "Ba2+": { type: "cation", charge: 2,  html: "Ba<sup>2+</sup>", img: "" },
    "Ca2+": { type: "cation", charge: 2,  html: "Ca<sup>2+</sup>", img: "" },
    "Cu2+": { type: "cation", charge: 2,  html: "Cu<sup>2+</sup>", img: "" },
    "Ag+":  { type: "cation", charge: 1,  html: "Ag<sup>+</sup>",  img: "" },
    "Al3+": { type: "cation", charge: 3,  html: "Al<sup>3+</sup>", img: "" },

    // Анионы (-)
    "OH-":   { type: "anion", charge: -1, html: "OH<sup>-</sup>",  img: "" },
    "Cl-":   { type: "anion", charge: -1, html: "Cl<sup>-</sup>",  img: "" },
    "S2-":   { type: "anion", charge: -2, html: "S<sup>2-</sup>",   img: "" },
    "SO42-": { type: "anion", charge: -2, html: "SO<sub>4</sub><sup>2-</sup>", img: "" },
    "CO32-": { type: "anion", charge: -2, html: "CO<sub>3</sub><sup>2-</sup>", img: "" },
    "PO43-": { type: "anion", charge: -3, html: "PO<sub>4</sub><sup>3-</sup>", img: "" },
    "SiO32-":{ type: "anion", charge: -2, html: "SiO<sub>3</sub><sup>2-</sup>", img: "" }
};

// ==========================================
// ПРАВИЛА РАСТВОРИМОСТИ
// ==========================================

function checkSubstanceProperty(cations, anions) {
    const catName = Object.keys(cations)[0];
    const anName = Object.keys(anions)[0];
    
    // 1. ГАЗЫ
    if (catName === "H+" && anName === "CO32-") return { status: "GAS", label: "CO2 ↑ + H2O", color: "#e2e8f0" };
    if (catName === "H+" && anName === "S2-") return { status: "GAS", label: "H2S ↑", color: "#cbd5e1" };
    
    // 2. ОСАДКИ
    if (catName === "Ba2+" && anName === "SO42-") return { status: "PRECIPITATE", label: "BaSO4 ↓", color: "#ffffff" };
    if (catName === "Ag+" && anName === "Cl-") return { status: "PRECIPITATE", label: "AgCl ↓", color: "#f8fafc" };
    if (catName === "Cu2+" && anName === "OH-") return { status: "PRECIPITATE", label: "Cu(OH)2 ↓", color: "#38bdf8" };
    
    const isActiveBase = ["Na+", "K+", "NH4+"].includes(catName);
    if (!isActiveBase && ["CO32-", "PO43-", "SiO32-"].includes(anName)) {
        return { status: "PRECIPITATE", label: "ОСАДОК ↓", color: "#e2e8f0" };
    }
    if (!isActiveBase && anName === "OH-" && catName !== "Ca2+" && catName !== "H+") {
        return { status: "PRECIPITATE", label: "ОСАДОК ↓", color: "#f1f5f9" };
    }

    // 3. РАСТВОРИМО
    return { status: "DISSOLVE", label: "РАСТВОР", color: "#4ade80" };
}

// ==========================================
// 2. НАСТРОЙКИ ИГРОВОГО ДВИЖКА
// ==========================================
const COLS = 14;
const ROWS = 8;

let grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
let currentPiece = null;
let nextPieceId = "";
let score = 0;
let level = 1;
let gameActive = false;
let isPaused = false;
let gameTimerId = null;
let fallSpeed = 1000;

// DOM
const glass = document.getElementById("chemistry-glass");
const formulaBoard = document.getElementById("formula-board");
const levelVal = document.getElementById("level-val");
const scoreVal = document.getElementById("score-val");
const nextPreview = document.getElementById("next-ion-preview");
const startScreen = document.getElementById("start-screen");
const gameoverScreen = document.getElementById("gameover-screen");
const finalScore = document.getElementById("final-score");

// Кнопки
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);

setupMobileControls();

function setupMobileControls() {
    const bindBtn = (id, action) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener("touchstart", (e) => { e.preventDefault(); action(); }, { passive: false });
        btn.addEventListener("mousedown", () => { action(); });
        btn.addEventListener("click", () => { action(); });
    };
    bindBtn("btn-left", () => movePiece(-1, 0));
    bindBtn("btn-right", () => movePiece(1, 0));
    bindBtn("btn-down", () => dropPieceFast());
    bindBtn("btn-pause", togglePause);
}

// ==========================================
// 3. УПРАВЛЕНИЕ ИГРОВЫМ ПРОЦЕССОМ
// ==========================================
function startGame() {
    startScreen.style.display = "none";
    gameoverScreen.style.display = "none";
    grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    score = 0;
    level = 1;
    fallSpeed = 1000;
    gameActive = true;
    isPaused = false;
    document.getElementById("btn-pause").textContent = "\u23F8\uFE0F";
    
    updateCounters();
    renderGridStructure();
    
    nextPieceId = getRandomIonId();
    spawnPiece();
    resetTimer();
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
    document.getElementById("btn-pause").textContent = isPaused ? "\u25B6\uFE0F" : "\u23F8\uFE0F";
    formulaBoard.textContent = isPaused ? "\u041F\u0410\u0423\u0417\u0410" : "\u2014";
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
    checkChemicalReactions();
}

// ==========================================
// 5. УМНАЯ ХИМИЧЕСКАЯ ЛОГИКА (КЛАСТЕРЫ)
// ==========================================

// === НОВАЯ ФУНКЦИЯ: проверка локального баланса каждого иона ===
// Для каждого иона в кластере считает сумму зарядов ПРОТИВОПОЛОЖНЫХ
// прямых соседей (4 направления). Если хотя бы у одного иона
// сумма < модуля его заряда — кластер не сбалансирован.
function isClusterBalanced(cluster) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let cell of cluster) {
        const block = grid[cell.r][cell.c];
        const myCharge = Math.abs(block.data.charge);
        let oppositeSum = 0;

        for (let [dr, dc] of directions) {
            const nr = cell.r + dr;
            const nc = cell.c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const neighbor = grid[nr][nc];
                if (neighbor !== null && neighbor.data.type !== block.data.type) {
                    oppositeSum += Math.abs(neighbor.data.charge);
                }
            }
        }

        // Если у иона не хватает противоположных соседей для нейтрализации
        if (oppositeSum < myCharge) {
            return false;
        }
    }
    return true;
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
                    totalCharge += block.data.charge;
                    if (block.data.type === "cation") cations[block.id] = (cations[block.id] || 0) + 1;
                    if (block.data.type === "anion") anions[block.id] = (anions[block.id] || 0) + 1;
                });

                // УСЛОВИЕ РЕАКЦИИ:
                // 1. Суммарный заряд = 0 (общий баланс)
                // 2. Есть и катионы, и анионы
                // 3. Каждый ион "нейтрализован" соседями (локальный баланс)
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

    cluster.forEach(cell => {
        const domEl = document.querySelector(`[data-r="${cell.r}"][data-c="${cell.c}"]`);
        if (domEl) {
            if (result.status === "PRECIPITATE") {
                domEl.style.backgroundColor = result.color;
                domEl.classList.add("effect-precipitate");
            } else if (result.status === "GAS") {
                domEl.classList.add("effect-gas");
            } else {
                domEl.style.transform = "scale(0)";
                domEl.style.opacity = "0";
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
// 6. ОТРИСОВКА И РЕНДЕРИНГ
// ==========================================
function renderGridStructure() {
    glass.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            glass.appendChild(cell);
        }
    }
}

function renderGrid() {
    document.querySelectorAll(".ion-block").forEach(el => el.remove());

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== null) {
                createBlockDOM(c, r, grid[r][c].id, grid[r][c].data);
            }
        }
    }

    if (currentPiece) {
        createBlockDOM(currentPiece.x, currentPiece.y, currentPiece.id, currentPiece.data);
    }
}

function createBlockDOM(x, y, id, data) {
    const block = document.createElement("div");
    block.className = "ion-block";
    block.setAttribute("data-r", y);
    block.setAttribute("data-c", x);
    
    block.style.left = `calc((100% / ${COLS}) * ${x})`;
    block.style.top = `calc((100% / ${ROWS}) * ${y})`;
    
    block.style.color = data.type === "cation" ? "#ef4444" : "#3b82f6";
    block.style.borderColor = data.type === "cation" ? "#fca5a5" : "#93c5fd";

    if (data.img) {
        const img = document.createElement("img");
        img.src = data.img;
        block.appendChild(img);
    } else {
        block.innerHTML = data.html; 
    }

    glass.appendChild(block);
}

function updateCounters() {
    levelVal.textContent = String(level).padStart(2, "0");
    scoreVal.textContent = String(score).padStart(5, "0");
}

function gameOver() {
    gameActive = false;
    clearInterval(gameTimerId);
    finalScore.textContent = score;
    gameoverScreen.style.display = "flex";
}
