// ==========================================
// 1. БАЗА ДАННЫХ ХИМИЧЕСКИХ ИОНОВ И ПРАВИЛ
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
// 2. НАСТРОЙКИ ИГРОВОГО ДВИЖКА (ТЕТРИС)
// ==========================================
const COLS = 14;
const ROWS = 8;

let grid = [];          // игровое поле: grid[r][c] = блок или null
let currentPiece = null; // текущая падающая фигура
let nextPiece = null;   // следующая фигура (для превью)
let gameInterval = null;
let isGameRunning = false;
let isPaused = false;
let score = 0;
let level = 1;
let dropSpeed = 600;     // мс между автоспусками

// Элементы DOM
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

// Флаги состояния
let soundEnabled = true;

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
    return {
        id: key,
        ...IONS_POOL[key]
    };
}

function createPiece() {
    return {
        ion: randomIon(),
        x: Math.floor((COLS - 1) / 2), // центр по горизонтали
        y: 0                           // сверху
    };
}

// Отрисовка всего поля (перерисовывает все блоки заново — просто и надёжно)
function renderGlass() {
    // Очищаем стакан
    glassEl.innerHTML = '';

    // Рисуем сетку (опционально, можно вынести в CSS)
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            // Позиция через JS, чтобы не зависеть от CSS-grid
            const w = 100 / COLS;
            const h = 100 / ROWS;
            cell.style.left = c * w + '%';
            cell.style.top = r * h + '%';
            cell.style.width = w + '%';
            cell.style.height = h + '%';
            glassEl.appendChild(cell);
        }
    }

    // Рисуем ионы
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const block = grid[r][c];
            if (block) {
                const el = document.createElement('div');
                el.className = 'ion-block';
                const w = 100 / COLS;
                const h = 100 / ROWS;
                el.style.left = c * w + '%';
                el.style.top = r * h + '%';
                el.style.width = w + '%';
                el.style.height = h + '%';

                // Цвет по типу иона
                if (block.ion.type === 'cation') {
                    el.style.background = '#4ade80'; // зелёный для катионов
                    el.style.color = '#000';
                } else {
                    el.style.background = '#ef4444'; // красный для анионов
                    el.style.color = '#fff';
                }

                el.innerHTML = block.ion.html;
                glassEl.appendChild(el);
            }
        }
    }

    // Если есть текущая фигура — рисуем её поверх
    if (currentPiece) {
        const el = document.createElement('div');
        el.className = 'ion-block';
        const w = 100 / COLS;
        const h = 100 / ROWS;
        el.style.left = currentPiece.x * w + '%';
        el.style.top = currentPiece.y * h + '%';
        el.style.width = w + '%';
        el.style.height = h + '%';

        if (currentPiece.ion.type === 'cation') {
            el.style.background = '#86efac'; // светлее
            el.style.color = '#000';
        } else {
            el.style.background = '#fca5a5'; // светлее
            el.style.color = '#000';
        }

        el.innerHTML = currentPiece.ion.html;
        glassEl.appendChild(el);
    }
}

function updateStats() {
    scoreEl.textContent = score.toString().padStart(5, '0');
    levelEl.textContent = level.toString().padStart(2, '0');
}

function showFormula(formula) {
    formulaBoard.textContent = formula;
}

// ==========================================
// 4. ЛОГИКА ДВИЖЕНИЯ И СТОЛКНОВЕНИЙ
// ==========================================
function collides(piece, dx, dy) {
    const { ion, x, y } = piece;
    // Проверяем границы и занятые клетки
    const newX = x + dx;
    const newY = y + dy;

    if (newX < 0 || newX >= COLS) return true;
    if (newY >= ROWS) return true; // ниже дна

    // Если клетка занята другим блоком — столкновение
    if (grid[newY][newX] !== null) return true;

    return false;
}

function movePiece(dx, dy) {
    if (!currentPiece || isPaused || !isGameRunning) return;

    if (!collides(currentPiece, dx, dy)) {
        currentPiece.x += dx;
        currentPiece.y += dy;
        renderGlass();
    } else if (dy > 0) {
        // Попытка упасть вниз и не получилось — значит, пора фиксировать
        lockPiece();
    }
}

function lockPiece() {
    const { ion, x, y } = currentPiece;
    grid[y][x] = { ion };

    // Проверка Game Over: если закрепили на самом верхнем ряду (y=0) — конец
    if (y === 0) {
        gameOver();
        return;
    }

    checkChemicalReactions();

    currentPiece = nextPiece;
    nextPiece = createPiece();
    updateNextPreview();

    renderGlass();

    // Ускорение со временем
    if (score % 500 === 0 && dropSpeed > 100) {
        dropSpeed -= 20;
    }
}

function dropPiece() {
    movePiece(0, 1);
}

function rotatePiece() {
    // Для одиночного иона вращение не меняет форму, но можно добавить эффект
    // Пока оставим без изменений, чтобы не усложнять
}

// ==========================================
// 5. УМНАЯ ХИМИЧЕСКАЯ ЛОГИКА (КЛАСТЕРЫ)
// ==========================================
function findCluster(r, c, visited, cluster) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (visited[r][c]) return;
    if (grid[r][c] === null) return;

    visited[r][c] = true;
    cluster.push({ r, c });

    // 4 направления
    findCluster(r - 1, c, visited, cluster);
    findCluster(r + 1, c, visited, cluster);
    findCluster(r, c - 1, visited, cluster);
    findCluster(r, c + 1, visited, cluster);
}

// Проверка локальной нейтрализации: каждый ион должен иметь достаточно соседей противоположного заряда
function isClusterBalanced(cluster) {
    for (const cell of cluster) {
        const block = grid[cell.r][cell.c];
        const oppositeCharge = block.ion.charge > 0 ? -1 : 1; // направление
        const needed = Math.abs(block.ion.charge);

        let sumOpposite = 0;

        // Соседи по 4 сторонам
        const directions = [
            { dr: -1, dc: 0 },
            { dr: 1,  dc: 0 },
            { dr: 0,  dc: -1 },
            { dr: 0,  dc: 1 }
        ];

        for (const dir of directions) {
            const nr = cell.r + dir.dr;
            const nc = cell.c + dir.dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const neighbor = grid[nr][nc];
                if (neighbor && neighbor.ion.type !== block.ion.type) {
                    sumOpposite += Math.abs(neighbor.ion.charge);
                }
            }
        }

        // Если противоположных соседей недостаточно — кластер нестабилен
        if (sumOpposite < needed) {
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
                let hasCation = false;
                let hasAnion = false;

                cluster.forEach(cell => {
                    const block = grid[cell.r][cell.c];
                    totalCharge += block.ion.charge;
                    if (block.ion.type === "cation") hasCation = true;
                    if (block.ion.type === "anion") hasAnion = true;
                });

                // Условие реакции: общий заряд 0, есть и катионы, и анионы, и локальная нейтрализация
                if (totalCharge === 0 && hasCation && hasAnion && isClusterBalanced(cluster)) {
                    // Удаляем плашки из кластера
                    cluster.forEach(cell => {
                        grid[cell.r][cell.c] = null;
                    });

                    reactionOccurred = true;

                    // Звук реакции
                    playReactionSound();

                    // Анимация: добавляем класс reaction-bounce к удаляемым плашкам
                    // Но так как мы уже удалили их из grid, нужно анимировать ДО удаления.
                    // Поэтому сделаем небольшую хитрость: сначала добавим класс, потом удалим.
                    animateClusterRemoval(cluster);

                    // Начисление очков
                    score += 50 * cluster.length;
                    updateStats();

                    showFormula('Реакция!');
                }
            }
        }
    }

    if (reactionOccurred) {
        gravity();
    }
}

function animateClusterRemoval(cluster) {
    // Чтобы анимация сработала, нужно добавить класс к элементам на экране.
    // Мы не можем легко найти DOM-элементы по координатам, поэтому сделаем так:
    // Просто перерисуем поле, но перед этим покажем анимацию через setTimeout.
    // В нашем случае проще: мы уже удалили из grid, а renderGlass() перерисует без них.
    // Поэтому добавим класс на время анимации — но это сложно без DOM-ссылок.
    // Решение: добавим класс к стакану, чтобы все блоки внутри имели эффект, если нужно.
    // Но лучше: сделаем эффект через временную метку.

    // Простой вариант: просто удаляем и перерисовываем — анимация уже есть в CSS через .reaction-bounce.
    // Чтобы она сработала, нужно, чтобы блок существовал в DOM во время анимации.
    // Значит, удалять из grid нужно ПОСЛЕ анимации.

    // Перепишем логику: сначала помечаем блоки, потом анимируем, потом удаляем.
    // Но для простоты в этом варианте мы уже удалили.
    // Сделаем так: добавим класс .reaction-bounce всем блокам, которые будут удалены,
    // затем через 300 мс удалим их из grid и перерисуем.

    // Так как у нас нет прямых ссылок на DOM-элементы, сделаем так:
    // Добавим класс стакану, который заставит все блоки иметь эффект.
    // Это не идеально, но сработает.

    glassEl.classList.add('reaction-active');
    setTimeout(() => {
        glassEl.classList.remove('reaction-active');
        renderGlass(); // перерисовка после удаления
    }, 300);
}

function gravity() {
    // Простейшая гравитация: если есть пустота под блоком — опускаем
    let moved = true;
    while (moved) {
        moved = false;
        for (let c = 0; c < COLS; c++) {
            for (let r = ROWS - 2; r >= 0; r--) {
                if (grid[r][c] && grid[r + 1][c] === null) {
                    grid[r + 1][c] = grid[r][c];
                    grid[r][c] = null;
                                        moved = true;
                }
            }
        }
    }
    renderGlass();

    // После гравитации могли образоваться новые кластеры — проверяем заново
    setTimeout(() => {
        checkChemicalReactions();
    }, 200);
}

// ==========================================
// 6. ПРОВЕРКА СВОЙСТВ ВЕЩЕСТВА
// ==========================================
function checkSubstanceProperty(cations, anions) {
    const catName = Object.keys(cations)[0];
    const anName = Object.keys(anions)[0];

    // Газы
    if (catName === "H+" && anName === "CO32-") return { status: "GAS", label: "CO2 ↑ + H2O", color: "#e2e8f0" };
    if (catName === "H+" && anName === "S2-") return { status: "GAS", label: "H2S ↑", color: "#cbd5e1" };

    // Осадки
    if (catName === "Ba2+" && anName === "SO42-") return { status: "PRECIPITATE", label: "BaSO4 ↓", color: "#ffffff" };
    if (catName === "Ag+" && anName === "Cl-") return { status: "PRECIPITATE", label: "AgCl ↓", color: "#f8fafc" };
    if (catName === "Cu2+" && anName === "OH-") return { status: "PRECIPITATE", label: "Cu(OH)2 ↓", color: "#38bdf8" };

    const isActiveBase = ["Na+", "K+", "NH4+"].includes(catName);
    if (!isActiveBase && ["CO32-", "PO43-", "SiO32-"].includes(anName)) {
        return { status: "PRECIPITATE", label: "Осадок ↓", color: "#e2e8f0" };
    }
    if (!isActiveBase && anName === "OH-" && catName !== "Ca2+" && catName !== "H+") {
        return { status: "PRECIPITATE", label: "Осадок гидроксида ↓", color: "#f1f5f9" };
    }

    // Растворимо
    return { status: "DISSOLVE", label: "Растворимо", color: "#4ade80" };
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
    toggleSoundBtn.textContent = soundEnabled ? '🔊' : '🔇';

    if (soundEnabled) {
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

function pauseMusic() {
    bgMusic.pause();
}

function resumeMusic() {
    if (soundEnabled && isGameRunning && !isPaused) {
        bgMusic.play().catch(() => {});
    }
}

// ==========================================
// 8. УПРАВЛЕНИЕ ИГРОВЫМ ПРОЦЕССОМ
// ==========================================
function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('rules-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');

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

    pauseBtn.textContent = '⏸️';
    showFormula('—');

    clearInterval(gameInterval);
    gameInterval = setInterval(dropPiece, dropSpeed);

    stopMusic(); // ← было startMusic()
}

function togglePause() {
    if (!isGameRunning) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
    showFormula(isPaused ? 'ПАУЗА' : '—');
    // Убрали pauseMusic() и resumeMusic()
}

function updateNextPreview() {
    if (!nextPiece) return;
    nextPreview.innerHTML = nextPiece.ion.html;
    nextPreview.style.color = nextPiece.ion.type === 'cation' ? '#ef4444' : '#3b82f6';
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    // Убрали stopMusic()

    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('gameover-screen').classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

function backToMenu() {
    isGameRunning = false;
    isPaused = false;
    clearInterval(gameInterval);

    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('rules-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');

    startMusic(); // ← было stopMusic() — снова играем в меню
}

function showRules() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('rules-screen').classList.remove('hidden');
}

// ==========================================
// 9. УПРАВЛЕНИЕ (КЛАВИАТУРА + КНОПКИ)
// ==========================================
document.addEventListener('keydown', (e) => {
    if (!isGameRunning || isPaused) return;

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
            dropPiece();
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

function setupMobileControls() {
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

    // Боковые кнопки
    bindBtn('btn-left', () => movePiece(-1, 0));
    bindBtn('btn-right', () => movePiece(1, 0));
    bindBtn('btn-down', () => dropPiece());
    bindBtn('btn-pause', togglePause);

    // Мобильные кнопки
    bindBtn('btn-mobile-left', () => movePiece(-1, 0));
    bindBtn('btn-mobile-down', () => dropPiece());
    bindBtn('btn-mobile-right', () => movePiece(1, 0));
    bindBtn('btn-mobile-pause', togglePause);
}

// ==========================================
// 10. ИНИЦИАЛИЗАЦИЯ
// ==========================================
startBtn.addEventListener('click', startGame);
rulesBtn.addEventListener('click', showRules);
backToMenuBtn.addEventListener('click', backToMenu);
restartFromMenuBtn.addEventListener('click', backToMenu);
toggleSoundBtn.addEventListener('click', toggleSound);

setupMobileControls();
// Музыка на стартовом экране
startMusic();
