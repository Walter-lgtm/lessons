// --- ХИМИЧЕСКАЯ БАЗА ДАННЫХ ИГРЫ ---
const CATIONS = [
    { id: "H+",  name: "H⁺",  charge: 1,  type: "cation" },
    { id: "Na+", name: "Na⁺", charge: 1,  type: "cation" },
    { id: "K+",  name: "K⁺",  charge: 1,  type: "cation" },
    { id: "NH4+",name: "NH₄⁺",charge: 1,  type: "cation" },
    { id: "Ag+", name: "Ag⁺", charge: 1,  type: "cation" },
    { id: "Ba2+",name: "Ba²⁺",charge: 2,  type: "cation" },
    { id: "Ca2+",name: "Ca²⁺",charge: 2,  type: "cation" },
    { id: "Cu2+",name: "Cu²⁺",charge: 2,  type: "cation" },
    { id: "Fe3+",name: "Fe³⁺",charge: 3,  type: "cation" }
];

const ANIONS = [
    { id: "OH-",  name: "OH⁻",  charge: -1, type: "anion" },
    { id: "Cl-",  name: "Cl⁻",  charge: -1, type: "anion" },
    { id: "I-",   name: "I⁻",   charge: -1, type: "anion" },
    { id: "NO3-", name: "NO₃⁻", charge: -1, type: "anion" },
    { id: "CO32-",name: "CO₃²⁻",charge: -2, type: "anion" },
    { id: "SO42-",name: "SO₄²⁻",charge: -2, type: "anion" },
    { id: "PO43-",name: "PO₄³⁻",charge: -3, type: "anion" }
];

const SOLUBILITY_TABLE = {
    "H+_OH-": { state: "R" }, "H+_Cl-": { state: "R" }, "H+_I-": { state: "R" }, "H+_NO3-": { state: "R" }, "H+_SO42-": { state: "R" }, "H+_PO43-": { state: "R" },
    "H+_CO32-": { state: "G", gas: "CO2" }, "NH4+_OH-": { state: "G", gas: "NH3" },
    "NH4+_Cl-": { state: "R" }, "NH4+_I-": { state: "R" }, "NH4+_NO3-": { state: "R" }, "NH4+_CO32-": { state: "R" }, "NH4+_SO42-": { state: "R" }, "NH4+_PO43-": { state: "R" },
    "Ag+_OH-": { state: "I", color: "#8B4513" }, "Ag+_Cl-": { state: "I", color: "#FFFFFF" }, "Ag+_I-": { state: "I", color: "#FFFF00" }, "Ag+_NO3-": { state: "R" }, "Ag+_CO32-": { state: "I", color: "#FFFFE0" }, "Ag+_SO42-": { state: "M", color: "#FFFFFF" }, "Ag+_PO43-": { state: "I", color: "#FFD700" },
    "Ba2+_OH-": { state: "R" }, "Ba2+_Cl-": { state: "R" }, "Ba2+_I-": { state: "R" }, "Ba2+_NO3-": { state: "R" }, "Ba2+_CO32-": { state: "I", color: "#FFFFFF" }, "Ba2+_SO42-": { state: "I", color: "#FFFFFF" }, "Ba2+_PO43-": { state: "I", color: "#FFFFFF" },
    "Ca2+_OH-": { state: "M", color: "#FFFFFF" }, "Ca2+_Cl-": { state: "R" }, "Ca2+_I-": { state: "R" }, "Ca2+_NO3-": { state: "R" }, "Ca2+_CO32-": { state: "I", color: "#FFFFFF" }, "Ca2+_SO42-": { state: "M", color: "#FFFFFF" }, "Ca2+_PO43-": { state: "I", color: "#FFFFFF" },
    "Cu2+_OH-": { state: "I", color: "#0000FF" }, "Cu2+_Cl-": { state: "R" }, "Cu2+_I-": { state: "R" }, "Cu2+_NO3-": { state: "R" }, "Cu2+_CO32-": { state: "I", color: "#008080" }, "Cu2+_SO42-": { state: "R" }, "Cu2+_PO43-": { state: "I", color: "#00008B" },
    "Fe3+_OH-": { state: "I", color: "#A52A2A" }, "Fe3+_Cl-": { state: "R" }, "Fe3+_I-": { state: "R" }, "Fe3+_NO3-": { state: "R" }, "Fe3+_CO32-": { state: "I", color: "#A52A2A" }, "Fe3+_SO42-": { state: "R" }, "Fe3+_PO43-": { state: "I", color: "#FFFFE0" },
    "Na+_OH-":{state:"R"}, "Na+_Cl-":{state:"R"}, "Na+_I-":{state:"R"}, "Na+_NO3-":{state:"R"}, "Na+_CO32-":{state:"R"}, "Na+_SO42-":{state:"R"}, "Na+_PO43-":{state:"R"},
    "K+_OH-":{state:"R"},  "K+_Cl-":{state:"R"},  "K+_I-":{state:"R"},  "K+_NO3-":{state:"R"},  "K+_CO32-":{state:"R"},  "K+_SO42-":{state:"R"},  "K+_PO43-":{state:"R"}
};

const COLS = 10;
const ROWS = 20;
let canvas, ctx;
let grid = [];
let currentIon = null;
let score = 0;
let level = 1;
let baseSpeed = 1000; 
let dropCounter = 0;
let lastTime = 0;
let isGameOver = false;
let flyingGases = []; 

// --- ИНИЦИАЛИЗАЦИЯ С РАСЧЕТОМ ЭКРАНА ---
document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    
    // Функция фиксации пропорций холста
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    
    // Считаем размер при запуске и при перевороте смартфона
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    setupMenuListeners();
    setupControlListeners();
});

function setupMenuListeners() {
    const startScreen = document.getElementById("start-screen");
    const diffScreen = document.getElementById("difficulty-screen");
    const rulesScreen = document.getElementById("rules-screen");
    const playScreen = document.getElementById("play-screen");

    document.getElementById("btn-start").addEventListener("click", () => {
        startScreen.classList.add("hidden");
        playScreen.classList.remove("hidden");
        initGame();
    });

    document.getElementById("btn-difficulty").addEventListener("click", () => {
        startScreen.classList.add("hidden");
        diffScreen.classList.remove("hidden");
    });

    document.getElementById("btn-rules").addEventListener("click", () => {
        startScreen.classList.add("hidden");
        rulesScreen.classList.remove("hidden");
    });

    document.getElementById("btn-back-diff").addEventListener("click", () => {
        diffScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

    document.getElementById("btn-back-rules").addEventListener("click", () => {
        rulesScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

    // Выбор уровня сложности
    document.querySelectorAll(".btn-diff").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".btn-diff").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            level = parseInt(e.target.dataset.level);
            document.getElementById("level-val").innerText = level;
        });
    });
}

// --- УПРАВЛЕНИЕ ИГРОКОМ ---
function setupControlListeners() {
    // Наэкранные сенсорные кнопки
    document.getElementById("btn-left").addEventListener("pointerdown", () => moveIon(-1));
    document.getElementById("btn-right").addEventListener("pointerdown", () => moveIon(1));
    document.getElementById("btn-down").addEventListener("pointerdown", () => dropIon());

    // Дублирование кнопками клавиатуры (для тестов на ПК)
    document.addEventListener("keydown", (e) => {
        if (isGameOver || !currentIon) return;
        if (e.key === "ArrowLeft" || e.key === "a") moveIon(-1);
        if (e.key === "ArrowRight" || e.key === "d") moveIon(1);
        if (e.key === "ArrowDown" || e.key === "s") dropIon();
    });
}

// --- ГЕНЕРАЦИЯ И ДВИЖЕНИЕ ИОНОВ ---
function initGame() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    score = 0;
    isGameOver = false;
    flyingGases = [];
    document.getElementById("score-val").innerText = "0000";
    document.getElementById("current-formula").innerText = "-";
    spawnIon();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function spawnIon() {
    // Рандомно выбираем: катион или анион
    const pool = Math.random() < 0.5 ? CATIONS : ANIONS;
    const template = pool[Math.floor(Math.random() * pool.length)];
    
    currentIon = {
        ...template,
        x: Math.floor(COLS / 2) - 1,
        y: 0
    };

    // Если на стартовой позиции уже есть ион — геймовер
    if (grid[currentIon.y][currentIon.x] !== null) {
        isGameOver = true;
        alert(`Лаборатория закрыта! Игра окончена. Очки: ${score}`);
    }
}

function moveIon(dir) {
    if (!currentIon) return;
    const newX = currentIon.x + dir;
    if (newX >= 0 && newX < COLS && !grid[currentIon.y][newX]) {
        currentIon.x = newX;
    }
}

function dropIon() {
    if (!currentIon) return;
    if (!checkCollision(currentIon.x, currentIon.y + 1)) {
        currentIon.y++;
    } else {
        lockIon();
    }
}
function checkCollision(x, y) {
    if (y >= ROWS) return true;
    if (grid[y][x] !== null) return true;
    return false;
}

function lockIon() {
    grid[currentIon.y][currentIon.x] = {
        name: currentIon.name,
        id: currentIon.id,
        charge: currentIon.charge,
        type: currentIon.type,
        flashColor: null // Флаг для красивой анимации осадка
    };
    
    // После фиксации иона проверяем химические реакции в этом столбце
    checkChemicalReaction(currentIon.x);
    spawnIon();
}

// --- ХИМИЧЕСКИЙ АНАЛИЗ СТОЛБЦА ---
function checkChemicalReaction(colIndex) {
    // Собираем все ионы в текущем вертикальном столбце снизу вверх
    let ionsInCol = [];
    for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r][colIndex]) {
            ionsInCol.push({ row: r, data: grid[r][colIndex] });
        }
    }

    if (ionsInCol.length < 2) return; // Для реакции нужно как минимум 2 иона

    // Ищем комбинацию катионов и анионов, которая дает суммарный заряд = 0
    let totalCharge = 0;
    let cations = [];
    let anions = [];
    let reactionParticipants = [];

    // Идем снизу вверх по ионам в столбце
    for (let item of ionsInCol) {
        totalCharge += item.data.charge;
        reactionParticipants.push(item);

        if (item.data.type === "cation") {
            cations.push(item.data.id);
        } else {
            anions.push(item.data.id);
        }

        // Как только заряд уравновесился (стал равен 0) и у нас есть и катионы, и анионы
        if (totalCharge === 0 && cations.length > 0 && anions.length > 0) {
            executeReaction(colIndex, reactionParticipants, cations, anions);
            return; // За один ход обрабатываем одну реакцию в столбце
        }
    }
}

function executeReaction(colIndex, participants, catIds, anIds) {
    // Берем для теста первый найденный катион и анион, чтобы узнать тип связи по таблице
    const mainCation = catIds[0];
    const mainAnion = anIds[0];
    const reactionKey = `${mainCation}_${mainAnion}`;
    const reactionResult = SOLUBILITY_TABLE[reactionKey] || { state: "R" };

    // Генерируем красивую химическую формулу для вывода на экран HUD
    updateFormulaHUD(catIds, anIds, reactionResult.gas);

    // Подсчет очков: чем больше ионов участвовало в нейтрализации, тем выше награда
    const points = participants.length * 100 * level;
    score += points;
    document.getElementById("score-val").innerText = String(score).padStart(4, '0');
    
    // Проверяем повышение уровня (каждые 1000 очков)
    let newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) {
        level = newLevel;
        document.getElementById("level-val").innerText = level;
    }

    // ЛОГИКА РЕАКЦИЙ:
    if (reactionResult.state === "G") {
        // --- СЛУЧАЙ ГАЗА (CO2 или NH3) ---
        // Анимация: создаем летучую плашку, которая улетит вверх экрана
        flyingGases.push({
            name: reactionResult.gas,
            x: colIndex,
            y: participants[participants.length - 1].row, // Стартует от верхнего иона реакции
            alpha: 1.0
        });
        // Мгновенно удаляем ионы из сетки
        removeIonsFromGrid(participants, colIndex);

    } else if (reactionResult.state === "I" || reactionResult.state === "M") {
        // --- СЛУЧАЙ ОСАДКА ---
        // Окрашиваем участвующие плашки в цвет химического осадка
        participants.forEach(p => {
            grid[p.row][colIndex].flashColor = reactionResult.color || "#FFFFFF";
        });

        // Замораживаем поле на мгновение (250мс), чтобы ученик увидел монолитный осадок, затем удаляем
        setTimeout(() => {
            removeIonsFromGrid(participants, colIndex);
        }, 250);

    } else {
        // --- СЛУЧАЙ РАСТВОРЕНИЯ (Растворимые соли/кислоты) ---
        // Исчезают мгновенно, как стандартные линии в тетрисе
        removeIonsFromGrid(participants, colIndex);
    }
}

function removeIonsFromGrid(participants, colIndex) {
    // Помечаем ячейки как пустые
    participants.forEach(p => {
        grid[p.row][colIndex] = null;
    });

    // Сдвигаем оставшиеся сверху ионы вниз (гравитация для оставшихся элементов столбца)
    let tempCol = [];
    for (let r = 0; r < ROWS; r++) {
        if (grid[r][colIndex] !== null) {
            tempCol.push(grid[r][colIndex]);
        }
    }
    // Очищаем столбец полностью
    for (let r = 0; r < ROWS; r++) {
        grid[r][colIndex] = null;
    }
    // Заполняем нижнюю часть столбца сдвинутыми ионами
    let targetRow = ROWS - 1;
    for (let i = tempCol.length - 1; i >= 0; i--) {
        grid[targetRow][colIndex] = tempCol[i];
        targetRow--;
    }
}

// Функция для поиска Наименьшего Общего Кратного (НОК) для расчета индексов
function findLCM(a, b) {
    const absA = Math.abs(a);
    const absB = Math.abs(b);
    
    // Сначала ищем Наибольший Общий Делитель (НОД) алгоритмом Евклида
    let gcd = absA;
    let tempB = absB;
    while (tempB) {
        let t = tempB;
        tempB = gcd % tempB;
        gcd = t;
    }
    // Вычисляем НОК
    return (absA * absB) / gcd;
}

// Карта перевода обычных цифр в химические нижние индексы (Subscript)
const SUBSCRIPT_NUMBERS = {
    '0': '₀', '1': '',  // Если индекс 1, в химии он не пишется (пустая строка)
    '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
};

function updateFormulaHUD(catIds, anIds, gasName) {
    const formulaDisplay = document.getElementById("current-formula");
    
    // Если выделился газ, выводим его красивую заготовку
    if (gasName) {
        if (gasName === "CO2") formulaDisplay.innerHTML = "CO₂↑ <span style='color:#ff2a85; font-size:0.8rem;'>(Газ!)</span>";
        if (gasName === "NH3") formulaDisplay.innerHTML = "NH₃↑ <span style='color:#ff2a85; font-size:0.8rem;'>(Газ!)</span>";
        return;
    }
    
    // 1. Получаем чистые объекты ионов из базы, чтобы узнать их точные заряды
    const cationObj = CATIONS.find(c => c.id === catIds[0]); // Берем первый катион из массива
    const anionObj = ANIONS.find(a => a.id === anIds[0]);   // Берем первый анион из массива
    
    if (!cationObj || !anionObj) {
        formulaDisplay.innerText = "-";
        return;
    }

    // 2. Считаем индексы через НОК зарядов
    const chargeCat = Math.abs(cationObj.charge);
    const chargeAn = Math.abs(anionObj.charge);
    const lcm = findLCM(chargeCat, chargeAn);
    
    const indexCat = lcm / chargeCat; // Индекс для катиона
    const indexAn = lcm / chargeAn;   // Индекс для аниона

    // 3. Очищаем имена от знаков зарядов для сборки формулы (например, "Na+" -> "Na")
    let cleanCatName = cationObj.name.replace(/[⁺⁺²³\s]/g, '').replace(/\d/g, '');
    let cleanAnName = anionObj.name.replace(/[⁻⁻²³\s]/g, '').replace(/\d/g, '');
    
    // Специфический фикс для сложных ионов (NH4, NO3, SO4, PO4, CO3)
    // Если у сложного аниона индекс больше 1, его нужно взять в скобки, например: Ca(NO₃)₂
    if (indexCat > 1 && cleanCatName === "NH") cleanCatName = "NH₄"; // Для аммония индекс 4 всегда на месте
    if (cleanCatName === "NH") cleanCatName = "NH₄";
    
    // Восстанавливаем внутренние индексы сложных анионов (кислотных остатков)
    if (cleanAnName === "NO") cleanAnName = "NO₃";
    if (cleanAnName === "SO") cleanAnName = "SO₄";
    if (cleanAnName === "PO") cleanAnName = "PO₄";
    if (cleanAnName === "CO") cleanAnName = "CO₃";

    // Если индекс сложного аниона > 1, оборачиваем его в скобки. Пример: Ba(NO₃)₂
    const polyatomicAnions = ["NO₃", "SO₄", "PO₄", "CO₃"];
    let finalAnPart = cleanAnName;
    if (indexAn > 1 && polyatomicAnions.includes(cleanAnName)) {
        finalAnPart = `(${cleanAnName})`;
    }
    
    // Если индекс катиона NH4 > 1, тоже берем в скобки. Пример: (NH₄)₂SO₄
    let finalCatPart = cleanCatName;
    if (indexCat > 1 && cleanCatName === "NH₄") {
        finalCatPart = `(NH₄)`;
    }

    // 4. Переводим рассчитанные индексы в красивые подстрочные знаки
    const subCat = SUBSCRIPT_NUMBERS[String(indexCat)] || '';
    const subAn = SUBSCRIPT_NUMBERS[String(indexAn)] || '';

    // Склеиваем финальную формулу
    const finalFormula = `${finalCatPart}${subCat}${finalAnPart}${subAn}`;
    
    // Выводим в интерфейс терминала
    formulaDisplay.innerText = finalFormula;
}
// --- ИГРОВОЙ ЦИКЛ (ОБНОВЛЕНИЕ ФИЗИКИ) ---
function gameLoop(timestamp) {
    if (isGameOver) return;

    // Рассчитываем дельту времени
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    dropCounter += deltaTime;

    // Рассчитываем скорость падения: чем выше уровень, тем меньше задержка в мс
    // На 1 уровне = 1000мс, на 5 уровне = 500мс, на 10 уровне = ~280мс
    let currentSpeed = baseSpeed * Math.pow(0.85, level - 1);

    if (dropCounter > currentSpeed) {
        dropIon();
        dropCounter = 0;
    }

    // Обновляем анимацию газов
    updateGases();

    // Отрисовываем графику
    draw();

    requestAnimationFrame(gameLoop);
}

function updateGases() {
    for (let i = flyingGases.length - 1; i >= 0; i--) {
        let gas = flyingGases[i];
        gas.y -= 0.2;       // Скорость полета плашки газа вверх
        gas.alpha -= 0.02;  // Эффект плавного растворения/исчезновения в атмосфере
        
        if (gas.alpha <= 0 || gas.y < -1) {
            flyingGases.splice(i, 1);
        }
    }
}

// --- РЕНДЕРИНГ ГРАФИКИ (ОТРИСОВКА НА CANVAS) ---
function draw() {
    // Очищаем экран стакана
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / COLS;
    const cellHeight = canvas.height / ROWS;

    // 1. Отрисовываем зафиксированную сетку ионов на дне стакана
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] !== null) {
                drawIonBlock(ctx, grid[r][c], c, r, cellWidth, cellHeight);
            }
        }
    }

    // 2. Отрисовываем текущий падающий одиночный ион
    if (currentIon) {
        drawIonBlock(ctx, currentIon, currentIon.x, currentIon.y, cellWidth, cellHeight);
    }

    // 3. Отрисовываем летящие вверх газы
    flyingGases.forEach(gas => {
        ctx.save();
        ctx.globalAlpha = gas.alpha;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 15;
        
        const gx = gas.x * cellWidth;
        const gy = gas.y * cellHeight;
        
        // Рисуем рамку газа
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(gx + 2, gy + 2, cellWidth - 4, cellHeight - 4);
        
        // Подпись газа
        ctx.font = `bold ${cellHeight * 0.45}px 'Courier New'`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(gas.name + "↑", gx + cellWidth / 2, gy + cellHeight / 2);
        ctx.restore();
    });

    // 4. Отрисовываем легкую полупрозрачную сетку терминала (для удобства прицеливания)
    ctx.strokeStyle = "rgba(57, 255, 20, 0.04)"; // Тонкий зеленый неон
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellWidth, 0);
        ctx.lineTo(c * cellWidth, canvas.height);
        ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellHeight);
        ctx.lineTo(canvas.width, r * cellHeight);
        ctx.stroke();
    }
}

// Вспомогательная функция отрисовки одной плашки иона
function drawIonBlock(context, ion, x, y, w, h) {
    context.save();

    const px = x * w;
    const py = y * h;

    // Определяем базовый цвет плашки, если это не зафиксированный осадок (flashColor)
    if (ion.flashColor) {
        // Эффект вспышки монолитного химического осадка
        context.fillStyle = ion.flashColor;
        context.strokeStyle = "#ffffff";
        context.shadowColor = ion.flashColor;
        context.shadowBlur = 20;
    } else {
        // Обычный ион: катионы — изумрудно-зеленые (Breaking), анионы — розовые (Science)
        if (ion.type === "cation") {
            context.fillStyle = "rgba(0, 255, 136, 0.15)";
            context.strokeStyle = "#00ff88";
            context.shadowColor = "#00ff88";
        } else {
            context.fillStyle = "rgba(255, 42, 133, 0.15)";
            context.strokeStyle = "#ff2a85";
            context.shadowColor = "#ff2a85";
        }
        context.shadowBlur = 8;
    }

    // Рисуем скругленный прямоугольник (блок иона)
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(px + 3, py + 3, w - 6, h - 6, 4);
    context.fill();
    context.stroke();

    // Отрисовываем текст (Химическую формулу иона, например: Na⁺, SO₄²⁻)
    context.fillStyle = "#ffffff";
    context.shadowBlur = 0; // Отключаем тень для текста, чтобы он оставался четким
    
    // Адаптивный размер шрифта под экран смартфона
    context.font = `bold ${h * 0.4}px 'Courier New'`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(ion.name, px + w / 2, py + h / 2);

    context.restore();
}
