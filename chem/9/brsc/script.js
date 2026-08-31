// --- 🧪 ХИМИЧЕСКАЯ БАЗА ДАННЫХ ИГРЫ ---
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

// --- ИГРОВЫЕ НАСТРОЙКИ ---
const COLS = 10;
const ROWS = 20;
let canvas = null, ctx = null;
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentIon = null;
let score = 0;
let level = 1;
let baseSpeed = 1000; 
let dropCounter = 0;
let lastTime = 0;
let isGameOver = false;
let flyingGases = []; 

const SUBSCRIPT_NUMBERS = { '0': '₀', '1': '', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };

// Инициализация при старте DOM
document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("game-canvas");
    if (canvas) ctx = canvas.getContext("2d");
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
        setTimeout(initGame, 50); // Даем 50мс на развертывание верстки
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

    document.querySelectorAll(".btn-diff").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".btn-diff").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            level = parseInt(e.target.dataset.level) || 1;
            document.getElementById("level-val").innerText = level;
        });
    });
}

function setupControlListeners() {
    document.getElementById("btn-left").addEventListener("pointerdown", (e) => { e.preventDefault(); moveIon(-1); });
    document.getElementById("btn-right").addEventListener("pointerdown", (e) => { e.preventDefault(); moveIon(1); });
    document.getElementById("btn-down").addEventListener("pointerdown", (e) => { e.preventDefault(); dropIon(); });

    document.addEventListener("keydown", (e) => {
        if (isGameOver || !currentIon) return;
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ф") moveIon(-1);
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "в") moveIon(1);
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "ы") dropIon();
    });
}

function initGame() {
    if (!canvas || !ctx) return;
    
    // Зануляем размеры холста под его физическое отображение в DOM
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

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
    const pool = Math.random() < 0.5 ? CATIONS : ANIONS;
    const template = pool[Math.floor(Math.random() * pool.length)];
    
    currentIon = {
        id: template.id,
        name: template.name,
        charge: template.charge,
        type: template.type,
        x: 4,
        y: 0
    };

    if (grid[currentIon.y][currentIon.x] !== null) {
        isGameOver = true;
        alert(`Игра окончена! Ваши очки: ${score}`);
    }
}

function moveIon(dir) {
    if (!currentIon || isGameOver) return;
    const newX = currentIon.x + dir;
    if (newX >= 0 && newX < COLS) {
        if (grid[currentIon.y][newX] === null) {
            currentIon.x = newX;
        }
    }
}

function dropIon() {
    if (!currentIon || isGameOver) return;
    if (currentIon.y + 1 < ROWS && grid[currentIon.y + 1][currentIon.x] === null) {
        currentIon.y++;
    } else {
        lockIon();
    }
}

function lockIon() {
    grid[currentIon.y][currentIon.x] = {
        name: currentIon.name,
        id: currentIon.id,
        charge: currentIon.charge,
        type: currentIon.type,
        flashColor: null
    };
    
    checkChemicalReaction(currentIon.x);
    if (!isGameOver) spawnIon();
}

function findLCM(a, b) {
    let gcd = Math.abs(a);
    let tempB = Math.abs(b);
    while (tempB) {
        let t = tempB;
        tempB = gcd % tempB;
        gcd = t;
    }
    return (Math.abs(a) * Math.abs(b)) / gcd;
}

function checkChemicalReaction(colIndex) {
    let ionsInCol = [];
    for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r][colIndex]) {
            ionsInCol.push({ row: r, data: grid[r][colIndex] });
        }
    }
    if (ionsInCol.length < 2) return;

    let totalCharge = 0;
    let reactionParticipants = [];
    let catId = null;
    let anId = null;

    for (let item of ionsInCol) {
        totalCharge += item.data.charge;
        reactionParticipants.push(item);

        if (item.data.type === "cation") catId = item.data.id;
        if (item.data.type === "anion") anId = item.data.id;

        if (totalCharge === 0 && catId && anId) {
            executeReaction(colIndex, reactionParticipants, catId, anId);
            return;
        }
    }
}
function executeReaction(colIndex, participants, catId, anId) {
    const reactionKey = `${catId}_${anId}`;
    const reactionResult = SOLUBILITY_TABLE[reactionKey] || { state: "R" };

    updateFormulaHUD(catId, anId, reactionResult.gas);

    score += participants.length * 100 * level;
    document.getElementById("score-val").innerText = String(score).padStart(4, '0');

    if (reactionResult.state === "G") {
        flyingGases.push({ name: reactionResult.gas, x: colIndex, y: participants[participants.length - 1].row, alpha: 1.0 });
        removeIonsFromGrid(participants, colIndex);
    } else if (reactionResult.state === "I" || reactionResult.state === "M") {
        participants.forEach(p => {
            if (grid[p.row][colIndex]) grid[p.row][colIndex].flashColor = reactionResult.color || "#FFFFFF";
        });
        setTimeout(() => { removeIonsFromGrid(participants, colIndex); }, 250);
    } else {
        removeIonsFromGrid(participants, colIndex);
    }
}

function removeIonsFromGrid(participants, colIndex) {
    participants.forEach(p => { grid[p.row][colIndex] = null; });
    let tempCol = [];
    for (let r = 0; r < ROWS; r++) {
        if (grid[r][colIndex] !== null) tempCol.push(grid[r][colIndex]);
    }
    for (let r = 0; r < ROWS; r++) grid[r][colIndex] = null;
    let targetRow = ROWS - 1;
    for (let i = tempCol.length - 1; i >= 0; i--) {
        grid[targetRow][colIndex] = tempCol[i];
        targetRow--;
    }
}

function updateFormulaHUD(catId, anId, gasName) {
    const formulaDisplay = document.getElementById("current-formula");
    if (gasName) {
        formulaDisplay.innerHTML = gasName === "CO2" ? "CO₂↑ (Газ!)" : "NH₃↑ (Газ!)";
        return;
    }
    const cationObj = CATIONS.find(c => c.id === catId);
    const anionObj = ANIONS.find(a => a.id === anId);
    if (!cationObj || !anionObj) return;

    const lcm = findLCM(cationObj.charge, anionObj.charge);
    const indexCat = lcm / Math.abs(cationObj.charge);
    const indexAn = lcm / Math.abs(anionObj.charge);

    let cleanCat = cationObj.name.replace(/[⁺²³\s]/g, '').replace(/\d/g, '');
    let cleanAn = anionObj.name.replace(/[⁻²³\s]/g, '').replace(/\d/g, '');

    if (cleanCat === "NH") cleanCat = "NH₄";
    if (cleanAn === "NO") cleanAn = "NO₃";
    if (cleanAn === "SO") cleanAn = "SO₄";
    if (cleanAn === "PO") cleanAn = "PO₄";
    if (cleanAn === "CO") cleanAn = "CO₃";

    if (indexAn > 1 && ["NO₃", "SO₄", "PO₄", "CO₃"].includes(cleanAn)) cleanAn = `(${cleanAn})`;
    if (indexCat > 1 && cleanCat === "NH₄") cleanCat = `(NH₄)`;

    formulaDisplay.innerText = `${cleanCat}${SUBSCRIPT_NUMBERS[String(indexCat)] || ''}${cleanAn}${SUBSCRIPT_NUMBERS[String(indexAn)] || ''}`;
}

function gameLoop(timestamp) {
    if (isGameOver) return;
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    dropCounter += deltaTime;

    let currentSpeed = baseSpeed * Math.pow(0.80, level - 1);

    if (dropCounter > currentSpeed) {
        dropIon();
        dropCounter = 0;
    }

    // Обновление анимации газов
    for (let i = flyingGases.length - 1; i >= 0; i--) {
        flyingGases[i].y -= 0.15;
        flyingGases[i].alpha -= 0.02;
        if (flyingGases[i].alpha <= 0) flyingGases.splice(i, 1);
    }

    draw();
    requestAnimationFrame(gameLoop);
}
function draw() {
    if (!canvas || !ctx) return;
    
    // Динамическая калибровка разрешения прямо во время цикла
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width / COLS;
    const h = canvas.height / ROWS;

    // Сетка стакана
    ctx.strokeStyle = "rgba(57, 255, 20, 0.15)";
    ctx.lineWidth = 1;
    for (let c = 1; c < COLS; c++) { ctx.beginPath(); ctx.moveTo(c * w, 0); ctx.lineTo(c * w, canvas.height); ctx.stroke(); }
    for (let r = 1; r < ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * h); ctx.lineTo(canvas.width, r * h); ctx.stroke(); }

    // Отрисовка зафиксированных ионов
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) drawBlock(grid[r][c], c, r, w, h);
        }
    }

    // Отрисовка летящего иона
    if (currentIon) drawBlock(currentIon, currentIon.x, currentIon.y, w, h);

    // Отрисовка газов
    flyingGases.forEach(g => {
        ctx.save();
        ctx.globalAlpha = g.alpha;
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(g.x * w + 2, g.y * h + 2, w - 4, h - 4);
        ctx.fillStyle = "#ffffff";
        ctx.font = `900 ${w * 0.55}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(g.name + "↑", g.x * w + w / 2, g.y * h + h / 2);
        ctx.restore();
    });
}

function drawBlock(ion, x, y, w, h) {
    ctx.save();
    const px = x * w;
    const py = y * h;

    if (ion.flashColor) {
        ctx.fillStyle = ion.flashColor;
        ctx.strokeStyle = "#ffffff";
    } else {
        if (ion.type === "cation") {
            ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
            ctx.strokeStyle = "#00ff88";
        } else {
            ctx.fillStyle = "rgba(255, 42, 133, 0.2)";
            ctx.strokeStyle = "#ff2a85";
        }
    }

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px + 2, py + 2, w - 4, h - 4, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
// Используем 55% от ширины ячейки, чтобы буквы занимали максимум места
ctx.font = `900 ${w * 0.55}px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ion.name, px + w / 2, py + h / 2);
    ctx.restore();
}
