// ===================================================
// BLACK MESA: КАСКАДНАЯ ДИССОЦИАЦИЯ v3.0 (МOНОЛИТНЫЙ ДВИЖОК)
// ===================================================

let audioCtx = null;
function playSound(type) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode); gainNode.connect(audioCtx.destination);

        if (type === 'click') {
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            osc.start(); osc.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.25);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, audioCtx.currentTime);
            osc.frequency.setValueAtTime(120, audioCtx.currentTime + 0.12);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.25);
        }
    } catch(e) { console.log(e); }
}

const audioLockOverlay = document.getElementById('audio-lock-overlay');
const authScreen = document.getElementById('auth-screen');
const rulesScreen = document.getElementById('rules-screen');
const valveTheme = document.getElementById('valve-theme');
const studentNameInput = document.getElementById('student-name');
const studentClassInput = document.getElementById('student-class');
const pvpBtn = document.getElementById('mode-pvp-btn');
const pvaiBtn = document.getElementById('mode-pvai-btn');
const rulesBtn = document.getElementById('rules-btn');
const closeRulesBtn = document.getElementById('close-rules-btn');

if (valveTheme) valveTheme.volume = 0.4;

if (audioLockOverlay) {
    audioLockOverlay.addEventListener('click', () => {
        audioLockOverlay.classList.remove('active');
        if (authScreen) authScreen.classList.add('active');
        if (valveTheme) valveTheme.play().catch(err => console.log(err));
    });
}
if (rulesBtn) rulesBtn.addEventListener('click', () => { authScreen.classList.remove('active'); rulesScreen.classList.add('active'); });
if (closeRulesBtn) closeRulesBtn.addEventListener('click', () => { rulesScreen.classList.remove('active'); authScreen.classList.add('active'); });

function checkAuthInputs() {
    const nameValue = studentNameInput.value.trim();
    const classValue = studentClassInput.value.trim();
    if (nameValue.length > 0 && classValue.length > 0) {
        pvpBtn.disabled = pvaiBtn.disabled = false;
    } else {
        pvpBtn.disabled = pvaiBtn.disabled = true;
    }
}
if (studentNameInput) studentNameInput.addEventListener('input', checkAuthInputs);
if (studentClassInput) studentClassInput.addEventListener('input', checkAuthInputs);

// БАЗА ИОНОВ И КАРТА РАСТВОРИМОСТИ
const cst_cations = [
    { id: "H", charge: 1, type: "cation" }, { id: "NH4", charge: 1, type: "cation" },
    { id: "Li", charge: 1, type: "cation" }, { id: "Na", charge: 1, type: "cation" },
    { id: "K", charge: 1, type: "cation" }, { id: "Ag", charge: 1, type: "cation" },
    { id: "Ba", charge: 2, type: "cation" }, { id: "Ca", charge: 2, type: "cation" },
    { id: "Mg", charge: 2, type: "cation" }, { id: "Sr", charge: 2, type: "cation" },
    { id: "Pb", charge: 2, type: "cation" }, { id: "Cu", charge: 2, type: "cation" },
    { id: "Fe2", charge: 2, type: "cation" }, { id: "Zn", charge: 2, type: "cation" },
    { id: "Mn", charge: 2, type: "cation" }, { id: "Ni", charge: 2, type: "cation" },
    { id: "Co", charge: 2, type: "cation" }, { id: "Al", charge: 3, type: "cation" },
    { id: "Fe3", charge: 3, type: "cation" }, { id: "Cr", charge: 3, type: "cation" }
];
const cst_anions = [
    { id: "OH", charge: -1, type: "anion" }, { id: "F", charge: -1, type: "anion" },
    { id: "Cl", charge: -1, type: "anion" }, { id: "Br", charge: -1, type: "anion" },
    { id: "I", charge: -1, type: "anion" }, { id: "NO3", charge: -1, type: "anion" },
    { id: "CH3COO", charge: -1, type: "anion" }, { id: "S", charge: -2, type: "anion" },
    { id: "SO3", charge: -2, type: "anion" }, { id: "SO4", charge: -2, type: "anion" },
    { id: "CO3", charge: -2, type: "anion" }, { id: "SiO3", charge: -2, type: "anion" },
    { id: "PO4", charge: -3, type: "anion" }
];
const solubilityMap = {
    "H_OH": { state: "W", desc: "Слабый электролит — Вода!" },
    "H_CO3": { state: "G", desc: "Выделение углекислого газа CO2." },
    "H_SO3": { state: "G", desc: "Выделение сернистого газа SO2." },
    "H_S": { state: "G", desc: "Выделение сероводорода H2S." },
    "NH4_OH": { state: "G", desc: "Выделение газа аммиака NH3." },
    "Ba_SO4": { state: "N", color: "белый", desc: "Плотный белый осадок сульфата бария!" },
    "Ag_Cl": { state: "N", color: "белый", desc: "Белый творожистый осадок хлорида серебра!" },
    "Ag_I": { state: "N", color: "желтый", desc: "Желтый осадок иодида серебра!" },
    "Cu_S": { state: "N", color: "черный", desc: "Черный осадок сульфида меди!" },
    "Cu_OH": { state: "N", color: "голубой", desc: "Голубой осадок гидроксида меди(II)!" },
    "Fe3_OH": { state: "N", color: "бурый", desc: "Бурый осадок гидроксида железа(III)!" },
    "Fe2_OH": { state: "N", color: "серо-зеленый", desc: "Серо-зеленый осадок гидроксида железа(II)!" }
};

let gameDeck = []; let userHand = []; let aiHand = [];
let tableAttackCards = []; let tableDefenseCards = []; let currentTurn = "user";

function generate180Deck(starterOwner) {
    let pool = [];
    cst_cations.forEach(c => {
        let count = (c.id === "H" && starterOwner) ? 3 : 4;
        for(let i=0; i<count; i++) pool.push({...c, uid: Math.random().toString(36).substr(2, 9)});
    });
    cst_anions.forEach(a => {
        let count = (a.id === "OH" && starterOwner) ? 3 : 4;
        for(let i=0; i<count; i++) pool.push({...a, uid: Math.random().toString(36).substr(2, 9)});
    });
    pool.sort(() => 0.5 - Math.random()); return pool;
}

// УМНЫЙ СИНТЕЗАТОР ХИМИЧЕСКИХ ФОРМУЛ
function generateChemicalFormula(cationId, anionId) {
    const catObj = cst_cations.find(c => c.id === cationId);
    const anObj = cst_anions.find(a => a.id === anionId);
    if (!catObj || !anObj) return "";
    const cCharge = catObj.charge; const aCharge = Math.abs(anObj.charge);
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const lcm = (cCharge * aCharge) / gcd(cCharge, aCharge);
    let cIndex = lcm / cCharge; let aIndex = lcm / aCharge;
    
    let cText = cationId; if (cIndex > 1) cText += `<sub>${cIndex}</sub>`;
    let aText = anionId;
    const isComplex = (anionId.length > 2 || anionId === "OH" || /\d/.test(anionId));
    if (aIndex > 1) {
        aText = isComplex ? `(${anionId})<sub>${aIndex}</sub>` : `${anionId}<sub>${aIndex}</sub>`;
    }
    if (cationId === "H" && anionId === "OH") return "H<sub>2</sub>O";
    return cText + aText;
}

// ЗАПУСК ИГРЫ AGAINST AI
if (pvaiBtn) {
    pvaiBtn.addEventListener('click', () => {
        playSound('click');
        try { if (valveTheme) { valveTheme.pause(); valveTheme.currentTime = 0; } } catch(e){}
        authScreen.classList.remove('active'); document.getElementById('game-screen').classList.add('active');
        
        const whoStarts = Math.random() > 0.5 ? "user" : "ai"; currentTurn = whoStarts;
        gameDeck = generate180Deck(true); userHand = []; aiHand = [];

        const startH = { id: "H", charge: 1, type: "caption" === "cation" ? "cation" : "cation", uid: "start-h" };
        const startOH = { id: "OH", charge: -1, type: "anion", uid: "start-oh" };

        if (whoStarts === "user") {
            userHand.push(startH, startOH); document.getElementById('reactor-status').textContent = "ВАШ ХОД! ПЕРЕТАЩИТЕ H+ И OH- НА СТОЛ ЗАЩИТЫ";
        } else {
            aiHand.push(startH, startOH); document.getElementById('reactor-status').textContent = "ПРОФЕССОР АНАЛИЗИРУЕТ РАСТВОР...";
        }
        while (userHand.length < 6) userHand.push(gameDeck.pop());
        while (aiHand.length < 6) aiHand.push(gameDeck.pop());

        updateReactorUI();
        if (whoStarts === "ai") setTimeout(executeAiFirstTurn, 2000);
    });
}

// НАДЕЖНЫЙ СБОР РУКИ С ПОДДЕРЖКОЙ ИСТИННОГО МОБИЛЬНОГО DRAG-AND-DROP
function updateReactorUI() {
    document.getElementById('deck-count').textContent = gameDeck.length;
    document.getElementById('p1-status').textContent = `${studentNameInput.value.trim()} [Карт: ${userHand.length}]`;
    const handBox = document.getElementById('player-hand'); 
    handBox.innerHTML = '';
    
    userHand.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.type}`;
        const chargeText = card.charge > 0 ? (card.charge === 1 ? "+" : `${card.charge}+`) : (card.charge === -1 ? "-" : `${Math.abs(card.charge)}-`);
        cardEl.innerHTML = `<div class="card-symbol">${card.id}</div><div class="card-charge">${chargeText}</div>`;
        
        // Мобильный Pointer-движок переноса (Идеально обрабатывает пальцы и мышь)
        cardEl.addEventListener('pointerdown', (e) => {
            if (currentTurn !== "user") return;
            e.preventDefault();
            cardEl.releasePointerCapture(e.pointerId); // Отключаем системный захват тача, чтобы работал перенос
            playSound('click');
            
            // Определяем целевой реактор в зависимости от фазы игры
            const targetZoneId = tableAttackCards.length === 0 ? 'table-attack-zone' : 'table-defense-zone';
            const dropTargetZone = document.getElementById(targetZoneId);

            // Создаем летящий клон карты
            const dragClone = cardEl.cloneNode(true);
            dragClone.classList.add('dragging');
            dragClone.style.width = cardEl.offsetWidth + 'px';
            dragClone.style.height = cardEl.offsetHeight + 'px';
            document.body.appendChild(dragClone);
            
            moveAt(e.clientX, e.clientY);

            function moveAt(clientX, clientY) {
                dragClone.style.left = (clientX - cardEl.offsetWidth / 2) + 'px';
                dragClone.style.top = (clientY - cardEl.offsetHeight / 2) + 'px';
                
                // Проверяем наведение на лету для красивой подсветки зоны в реальном времени
                if (dropTargetZone) {
                    const rect = dropTargetZone.getBoundingClientRect();
                    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                        dropTargetZone.classList.add('drag-hover');
                    } else {
                        dropTargetZone.classList.remove('drag-hover');
                    }
                }
            }

            function onPointerMove(ev) {
                moveAt(ev.clientX, ev.clientY);
            }
            
            document.addEventListener('pointermove', onPointerMove);
            
            dragClone.addEventListener('pointerup', (ev) => {
                document.removeEventListener('pointermove', onPointerMove);
                if (dropTargetZone) dropTargetZone.classList.remove('drag-hover');
                
                // МОБИЛЬНЫЙ ФИKСАТОР: Проверяем, находится ли палец физически над зоной-реактором в момент отпускания
                let successDrop = false;
                if (dropTargetZone) {
                    const rect = dropTargetZone.getBoundingClientRect();
                    successDrop = (ev.clientX >= rect.left && ev.clientX <= rect.right && ev.clientY >= rect.top && ev.clientY <= rect.bottom);
                }
                
                if (successDrop) {
                    // Ионы успешно попадают в реактор!
                    userHand = userHand.filter(c => c.uid !== card.uid);
                    if (tableAttackCards.length === 0) {
                        tableAttackCards.push(card);
                    } else {
                        tableDefenseCards.push(card);
                    }
                    playSound('success');
                    updateReactorUI(); 
                    renderTableZones(); 
                    updateActionButtonsState();
                } else {
                    // Возвращаем карту обратно, если промахнулись мимо стола
                    playSound('error');
                }
                dragClone.remove();
            }, { once: true });
        });

        handBox.appendChild(cardEl);
    });
}
// ПЕРЕРАСЧЕТ ВАЛЕНТНОСТИ И КНОПОК ПУЛЬТА
function updateActionButtonsState() {
    const btnDiss = document.getElementById('btn-dissociated');
    const btnSed = document.getElementById('btn-sediment');
    const btnDeg = document.getElementById('btn-degassed');
    const btnNeut = document.getElementById('btn-neutralized');

    // Если на столе пусто — кнопки заблокированы до выкладки атак
    if (tableAttackCards.length === 0 && tableDefenseCards.length === 0) {
        btnDiss.disabled = btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true; return;
    }

    // Если игрок выложил атаку и стол защиты чист
    if (tableAttackCards.length > 0 && tableDefenseCards.length === 0) {
        const firstType = tableAttackCards[0].type;
        const isSameType = tableAttackCards.every(c => c.type === firstType);
        const hasH = tableAttackCards.some(c => c.id === "H"); const hasOH = tableAttackCards.some(c => c.id === "OH");
        
        if (tableAttackCards.length === 2 && hasH && hasOH) {
            btnNeut.disabled = false; btnDiss.disabled = btnSed.disabled = btnDeg.disabled = true;
        } else if (isSameType) {
            btnDiss.disabled = false; btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true;
        } else {
            btnDiss.disabled = btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true;
        }
    } 
    // Если игрок защищается от атаки Профессора
    else if (tableAttackCards.length > 0 && tableDefenseCards.length > 0) {
        let totalSum = 0;
        [...tableAttackCards, ...tableDefenseCards].forEach(c => totalSum += c.charge);
        
        if (totalSum === 0) {
            btnDiss.disabled = btnSed.disabled = btnDeg.disabled = false;
            const hasH = [...tableAttackCards, ...tableDefenseCards].some(c => c.id === "H");
            const hasOH = [...tableAttackCards, ...tableDefenseCards].some(c => c.id === "OH");
            btnNeut.disabled = !(hasH && hasOH);
        } else {
            btnDiss.disabled = btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true;
        }
    }
}
// ПРИВЯЗКА КНОПОК ОТВЕТОВ ПУЛЬТА
const btnDissEl = document.getElementById('btn-dissociated'); const btnDegEl = document.getElementById('btn-degassed');
const btnNeutEl = document.getElementById('btn-neutralized'); const btnSedEl = document.getElementById('btn-sediment');
const btnAssocEl = document.getElementById('btn-associated');

if (btnDissEl) btnDissEl.addEventListener('click', () => processPlayerAction('R'));
if (btnDegEl) btnDegEl.addEventListener('click', () => processPlayerAction('G'));
if (btnNeutEl) btnNeutEl.addEventListener('click', () => processPlayerAction('W'));
if (btnSedEl) { btnSedEl.addEventListener('click', () => { playSound('click'); document.getElementById('color-picker-overlay').classList.add('active'); }); }

document.querySelectorAll('.color-select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('color-picker-overlay').classList.remove('active');
        processPlayerAction('N', this.dataset.color);
    });
});

if (btnAssocEl) {
    btnAssocEl.addEventListener('click', () => {
        if (currentTurn !== "user" || tableAttackCards.length === 0) return;
        playSound('error'); userHand.push(...tableAttackCards, ...tableDefenseCards);
        tableAttackCards = []; tableDefenseCards = [];
        document.getElementById('reactor-status').textContent = "ВЫ АССОЦИИРОВАЛИ ИОНЫ. ХОД ПРОФЕССОРА.";
        currentTurn = "ai"; clearSelectedAndNext(); setTimeout(executeAiTurn, 2000);
    });
}

// СУДЬЕСТВО И ХИМИЧЕСКИЙ АНАЛИЗ РЕАКЦИЙ
function processPlayerAction(claimedState, claimedColor = null) {
    playSound('click'); const statusText = document.getElementById('reactor-status');

    if (tableDefenseCards.length === 0) { // Обработка стартового сброса "Воды" игроком
        const hasH = tableAttackCards.some(c => c.id === "H"); const hasOH = tableAttackCards.some(c => c.id === "OH");
        if (tableAttackCards.length === 2 && hasH && hasOH && claimedState === 'W') {
            playSound('success'); statusText.innerHTML = `<span class="green-text">ВЫКРИК: "Вода!". Нейтрализация успешна.</span>`;
            tableAttackCards = []; currentTurn = "user";
        } else {
            statusText.textContent = "ПОТОК ИОНОВ НАПРАВЛЕН НА ПРОФЕССОРА. ХОД ИИ..."; currentTurn = "ai"; setTimeout(executeAiTurn, 2000);
        }
        clearSelectedAndNext(); return;
    }

    let isChemicalTruth = true; let actualReactionData = null;
    for (let cat of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'cation')) {
        for (let an of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'anion')) {
            if (solubilityMap[`${cat.id}_${an.id}`]) { actualReactionData = solubilityMap[`${cat.id}_${an.id}`]; break; }
        }
    }
    if (!actualReactionData) actualReactionData = { state: "R", desc: "Вещество полностью диссоциировало!" };

    if (actualReactionData.state !== claimedState) isChemicalTruth = false;
    if (claimedState === 'N' && actualReactionData.color !== claimedColor) isChemicalTruth = false;

    if (isChemicalTruth) {
        playSound('success'); statusText.innerHTML = `<span class="green-text">ВЕРНО! ${actualReactionData.desc} Карты в раствор.</span>`;
        tableAttackCards = []; tableDefenseCards = []; currentTurn = "user";
    } else {
        playSound('error'); statusText.innerHTML = `<span class="text-error">ОШИБКА АНАЛИЗА! Вы забираете ВСЕ ионы!</span>`;
        userHand.push(...tableAttackCards, ...tableDefenseCards); tableAttackCards = []; tableDefenseCards = [];
        currentTurn = "ai"; setTimeout(executeAiTurn, 2000);
    }
    clearSelectedAndNext();
}

function clearSelectedAndNext() {
    while (userHand.length < 6 && gameDeck.length > 0) userHand.push(gameDeck.pop());
    while (aiHand.length < 6 && gameDeck.length > 0) aiHand.push(gameDeck.pop());
    updateReactorUI(); renderTableZones(); updateActionButtonsState();
    if (userHand.length === 0 && gameDeck.length === 0) { alert("ВЫ ПОБЕДИЛИ ПРОФЕССОРА!"); location.reload(); }
}
// ИСПРАВЛЕННЫЙ И СИНХРОНИЗИРОВАННЫЙ ВЫВОД СТОЛА И ФОРМУЛ СИНТЕЗА
function renderTableZones() {
    const attackZone = document.getElementById('table-attack-zone');
    const defenseZone = document.getElementById('table-defense-zone');
    
    if (attackZone) {
        attackZone.innerHTML = '';
        if (tableAttackCards.length === 0) { 
            attackZone.innerHTML = '<div class="reactor-empty-text">РАСТВОР ЧИСТ</div>'; 
        } else { 
            tableAttackCards.forEach(c => attackZone.appendChild(createStaticCardElement(c))); 
        }
    }
    if (defenseZone) {
        defenseZone.innerHTML = '';
        if (tableDefenseCards.length === 0) { 
            defenseZone.innerHTML = '<div class="reactor-empty-text">ПЕРЕТАЩИТЕ КАРТУ СЮДА</div>'; 
        } else { 
            tableDefenseCards.forEach(c => defenseZone.appendChild(createStaticCardElement(c))); 
        }
    }

    // ДИНАМИЧЕСКИЙ ВЫВОД ФОРМУЛЫ СИНТЕЗА ПРЯМО НА ЭКРАНЕ СУДЬЕСТВА
    const activeCation = [...tableAttackCards, ...tableDefenseCards].find(c => c.type === 'cation');
    const activeAnion = [...tableAttackCards, ...tableDefenseCards].find(c => c.type === 'anion');
    const existingBadge = document.querySelector('.formula-display-badge');
    if (existingBadge) existingBadge.remove();

    if (activeCation && activeAnion && defenseZone) {
        const formulaHtml = generateChemicalFormula(activeCation.id, activeAnion.id);
        const formulaBadge = document.createElement('div');
        formulaBadge.className = 'formula-display-badge';
        formulaBadge.innerHTML = `СИНТЕЗ: <span class="formula-text">${formulaHtml}</span>`;
        defenseZone.appendChild(formulaBadge);
    }
}

function createStaticCardElement(card) {
    const el = document.createElement('div'); el.className = `card ${card.type}`;
    const chargeText = card.charge > 0 ? (card.charge === 1 ? "+" : `${card.charge}+`) : (card.charge === -1 ? "-" : `${Math.abs(card.charge)}-`);
    el.innerHTML = `<div class="card-symbol">${card.id}</div><div class="card-charge">${chargeText}</div>`;
    return el;
}

// ИИ КОМПЬЮТЕРНОГО СОПЕРНИКА
function executeAiFirstTurn() {
    const hCard = aiHand.find(c => c.uid === "start-h"); const ohCard = aiHand.find(c => c.uid === "start-oh");
    if (hCard && ohCard) {
        tableAttackCards.push(hCard, ohCard); aiHand = aiHand.filter(c => c.uid !== "start-h" && c.uid !== "start-oh");
        playSound('success'); document.getElementById('reactor-status').innerHTML = `<span class="text-error">ПРОФЕССОР: "Вода!". Стартовая нейтрализация выполнена. Ваш ход!</span>`;
        tableAttackCards = []; currentTurn = "user";
    }
    clearSelectedAndNext();
}

function executeAiTurn() {
    if (currentTurn !== "ai") return; const statusText = document.getElementById('reactor-status');
    if (tableAttackCards.length === 0) {
        if (aiHand.length === 0) return;
        const randomCard = aiHand[Math.floor(Math.random() * aiHand.length)];
        const matchingCards = aiHand.filter(c => c.id === randomCard.id);
        tableAttackCards.push(...matchingCards); aiHand = aiHand.filter(c => !matchingCards.includes(c));
        statusText.innerHTML = `<span class="text-error">Профессор атаковал вас ионами: ${randomCard.id}! Перетащите защиту!</span>`;
        currentTurn = "user"; clearSelectedAndNext(); return;
    }
    let attackCharge = 0; tableAttackCards.forEach(c => attackCharge += c.charge);
    let defensiveCombination = findAiDefensiveCombination(attackCharge);

    if (defensiveCombination.length > 0) {
        tableDefenseCards.push(...defensiveCombination); aiHand = aiHand.filter(c => !defensiveCombination.includes(c));
        let reaction = null;
        for (let cat of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'cation')) {
            for (let an of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'anion')) {
                if (solubilityMap[`${cat.id}_${an.id}`]) { reaction = solubilityMap[`${cat.id}_${an.id}`]; break; }
            }
        }
        if (!reaction) reaction = { state: "R", desc: "Диссоциировал!" };
        playSound('success'); statusText.innerHTML = `<span class="text-error">Профессор защитился: "${reaction.state === 'N' ? 'ОСАДОК!' : (reaction.state === 'G' ? 'ДЕГАЗИРОВАЛСЯ!' : 'ДИССОЦИИРОВАЛ!')}".</span>`;
        tableAttackCards = []; tableDefenseCards = []; currentTurn = "ai";
        clearSelectedAndNext(); setTimeout(executeAiTurn, 2500);
    } else {
        playSound('error'); aiHand.push(...tableAttackCards); tableAttackCards = []; tableDefenseCards = [];
        statusText.innerHTML = `<span class="green-text">Профессор не смог отбиться и ассоциировал ионы! Ваш ход!</span>`;
        currentTurn = "user"; clearSelectedAndNext();
    }
}

function findAiDefensiveCombination(targetAttackCharge) {
    for (let c1 of aiHand) { if (targetAttackCharge + c1.charge === 0) return [c1]; }
    for (let i = 0; i < aiHand.length; i++) {
        for (let j = i + 1; j < aiHand.length; j++) {
            if (targetAttackCharge + aiHand[i].charge + aiHand[j].charge === 0) return [activeCation, activeAnion].fill(null), [aiHand[i], aiHand[j]];
        }
    }
    return [];
}

checkAuthInputs();
