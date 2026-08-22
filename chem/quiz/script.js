// ===================================================
// BLACK MESA: КАСКАДНАЯ ДИССОЦИАЦИЯ v3.0 (ЛОГИКА ИГРЫ)
// ===================================================

// ПОРЦИЯ 1: ЗВУКОВОЙ ДВИЖОК И СТАРТОВЫЕ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ

let audioCtx = null;

// Программный синтезатор Half-Life звуков (Web Audio API)
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
    } catch(e) { console.log("Сбой аудио-контекста:", e); }
}

// Связывание интерфейса стартового экрана
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

// Фиксация базовой громкости музыки
if (valveTheme) valveTheme.volume = 0.4;
// ПОРЦИЯ 2: ЛОГИКА ВЗАИМОДЕЙСТВИЯ СО СТАРТОВЫМ ИНТЕРФЕЙСОМ И ВАЛИДАЦИЯ

// Активация терминала и запуск музыки по первому клику на оверлей
if (audioLockOverlay) {
    audioLockOverlay.addEventListener('click', () => {
        audioLockOverlay.classList.remove('active');
        if (authScreen) authScreen.classList.add('active');
        if (valveTheme) {
            valveTheme.play().catch(err => console.log("Аудио заблокировано системой:", err));
        }
    });
}

// Управление окном правил игры (Открыть)
if (rulesBtn) {
    rulesBtn.addEventListener('click', () => {
        authScreen.classList.remove('active');
        rulesScreen.classList.add('active');
    });
}

// Управление окном правил игры (Закрыть)
if (closeRulesBtn) {
    closeRulesBtn.addEventListener('click', () => {
        rulesScreen.classList.remove('active');
        authScreen.classList.add('active');
    });
}

// Проверка заполнения полей ввода для разблокировки игровых режимов
function checkAuthInputs() {
    const nameValue = studentNameInput.value.trim();
    const classValue = studentClassInput.value.trim();
    if (nameValue.length > 0 && classValue.length > 0) {
        pvpBtn.disabled = false;
        pvaiBtn.disabled = false;
    } else {
        pvpBtn.disabled = true;
        pvaiBtn.disabled = true;
    }
}

if (studentNameInput) studentNameInput.addEventListener('input', checkAuthInputs);
if (studentClassInput) studentClassInput.addEventListener('input', checkAuthInputs);
// ПОРЦИЯ 3: КАТАЛОГ ИОНОВ И СОСТОЯНИЕ ИГРОВОГО СЕАНСА

const cst_cations = [
    { id: "H",  name: "Водород",  charge: 1, type: "cation" },
    { id: "NH4",name: "Аммоний",  charge: 1, type: "cation" },
    { id: "Li", name: "Литий",    charge: 1, type: "cation" },
    { id: "Na", name: "Натрий",   charge: 1, type: "cation" },
    { id: "K",  name: "Калий",    charge: 1, type: "cation" },
    { id: "Ag", name: "Серебро",  charge: 1, type: "cation" },
    { id: "Ba", name: "Барий",    charge: 2, type: "cation" },
    { id: "Ca", name: "Кальций",  charge: 2, type: "cation" },
    { id: "Mg", name: "Магний",   charge: 2, type: "cation" },
    { id: "Sr", name: "Стронций", charge: 2, type: "cation" },
    { id: "Pb", name: "Свинец",   charge: 2, type: "cation" },
    { id: "Cu", name: "Медь(II)", charge: 2, type: "cation" },
    { id: "Fe2",name: "Железо(II)",charge: 2, type: "cation" },
    { id: "Zn", name: "Цинк",     charge: 2, type: "cation" },
    { id: "Mn", name: "Марганец", charge: 2, type: "cation" },
    { id: "Ni", name: "Никель",   charge: 2, type: "cation" },
    { id: "Co", name: "Кобальт",  charge: 2, type: "cation" },
    { id: "Al", name: "Алюминий", charge: 3, type: "cation" },
    { id: "Fe3",name: "Железо(III)",charge: 3, type: "cation" },
    { id: "Cr", name: "Хром(III)", charge: 3, type: "cation" }
];

const cst_anions = [
    { id: "OH",  name: "Гидроксид", charge: -1, type: "anion" },
    { id: "F",   name: "Фторид",    charge: -1, type: "anion" },
    { id: "Cl",  name: "Хлорид",    charge: -1, type: "anion" },
    { id: "Br",  name: "Бромид",    charge: -1, type: "anion" },
    { id: "I",   name: "Иодид",     charge: -1, type: "anion" },
    { id: "NO3", name: "Нитрат",    charge: -1, type: "anion" },
    { id: "CH3COO", name: "Ацетат", charge: -1, type: "anion" },
    { id: "S",   name: "Сульфид",   charge: -2, type: "anion" },
    { id: "SO3", name: "Сульфит",   charge: -2, type: "anion" },
    { id: "SO4", name: "Сульфат",   charge: -2, type: "anion" },
    { id: "CO3", name: "Карбонат",  charge: -2, type: "anion" },
    { id: "SiO3",name: "Силикат",   charge: -2, type: "anion" },
    { id: "PO4", name: "Фосфат",    charge: -3, type: "anion" }
];

// Переменные текущего игрового процесса
let gameDeck = [];
let userHand = [];
let aiHand = [];
let tableAttackCards = [];
let tableDefenseCards = [];
let selectedHandCards = [];
let currentTurn = "user";
// ПОРЦИЯ 4: КАРТА РАСТВОРИМОСТИ И СБОРКА ТАКТИЧЕСКОЙ КОЛОДЫ НА 180 КАРТ

const solubilityMap = {
    "H_OH": { state: "W", desc: "Образование слабого электролита — Воды!" },
    "H_CO3": { state: "G", desc: "Угольная кислота разложилась! Выделение углекислого газа CO2." },
    "H_SO3": { state: "G", desc: "Сернистая кислота разложилась! Выделение сернистого газа SO2." },
    "H_S": { state: "G", desc: "Выделение сероводорода H2S." },
    "NH4_OH": { state: "G", desc: "Гидроксид аммония разложился! Выделение газа аммиака NH3." },
    "Ba_SO4": { state: "N", color: "белый", desc: "Выпал плотный белый осадок сульфата бария!" },
    "Ag_Cl": { state: "N", color: "белый", desc: "Выпал белый осадок хлорида серебра!" },
    "Ag_I": { state: "N", color: "желтый", desc: "Выпал желтый осадок иодида серебра!" },
    "Cu_S": { state: "N", color: "черный", desc: "Выпал черный осадок сульфида меди!" },
    "Cu_OH": { state: "N", color: "голубой", desc: "Выпал голубой осадок гидроксида меди(II)!" },
    "Fe3_OH": { state: "N", color: "бурый", desc: "Выпал бурый осадок гидроксида железа(III)!" },
    "Fe2_OH": { state: "N", color: "серо-зеленый", desc: "Выпал серо-зеленый осадок гидроксида железа(II)!" }
};

// Функция генерации и случайного перемешивания колоды
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
    pool.sort(() => 0.5 - Math.random());
    return pool;
}
// ПОРЦИЯ 5: ИНИЦИАЛИЗАЦИЯ ИГРОВОГО СЕАНСА PvAi И СТАРТОВАЯ РАЗДАЧА

if (pvaiBtn) {
    pvaiBtn.addEventListener('click', () => {
        playSound('click');
        
        // Надежное отключение музыки стартового экрана при переходе в игру
        try {
            if (valveTheme) {
                valveTheme.pause();
                valveTheme.currentTime = 0;
            }
        } catch (e) { console.log("Ошибка аудио-модуля при остановке:", e); }

        // Переключение экранов терминала
        authScreen.classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        // Рандомим хозяина первого хода и собираем колоду
        const whoStarts = Math.random() > 0.5 ? "user" : "ai";
        currentTurn = whoStarts;
        gameDeck = generate180Deck(true);

        // Объявляем стартовые ионы H+ и OH- для правила "Воды"
        const startH = { id: "H", name: "Водород", charge: 1, type: "cation", uid: "start-h" };
        const startOH = { id: "OH", name: "Гидроксид", charge: -1, type: "anion", uid: "start-oh" };

        // Принудительно закладываем стартовую комбинацию первому ходящему
        if (whoStarts === "user") {
            userHand.push(startH, startOH);
            document.getElementById('reactor-status').textContent = "ВАШ ХОД! СБРОСЬТЕ H+ И OH- (ВОДА!)";
        } else {
            aiHand.push(startH, startOH);
            document.getElementById('reactor-status').textContent = "ПРОФЕССОР АНАЛИЗИРУЕТ РАСТВОР...";
        }

        // Добираем карты из резерва колоды до 6 штук каждому
        while (userHand.length < 6) userHand.push(gameDeck.pop());
        while (aiHand.length < 6) aiHand.push(gameDeck.pop());

        // Отрисовываем интерфейс
        updateReactorUI();

        // Если первый ход за ИИ — даем небольшую задержку перед действием компьютера
        if (whoStarts === "ai") {
            setTimeout(executeAiFirstTurn, 2000);
        }
    });
}
// ПОРЦИЯ 6: ГРАФИЧЕСКИЙ РЕНДЕРИНГ КАРТ И ЛОГИКА ТАПА ПО РУКЕ

function updateReactorUI() {
    // Обновляем счетчик колоды и имя Джины Кросс / доктора Фримена
    document.getElementById('deck-count').textContent = gameDeck.length;
    document.getElementById('p1-status').textContent = `${studentNameInput.value.trim()} [Карт: ${userHand.length}]`;
    
    const handBox = document.getElementById('player-hand');
    handBox.innerHTML = '';
    selectedHandCards = []; // Сбрасываем старые выделения при обновлении
    
    userHand.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.type}`;
        
        // Красивое отображение заряда валентности (например: 2+, 3-, +)
        const chargeText = card.charge > 0 ? (card.charge === 1 ? "+" : `${card.charge}+`) : (card.charge === -1 ? "-" : `${Math.abs(card.charge)}-`);
        
        cardEl.innerHTML = `
            <div class="card-symbol">${card.id}</div>
            <div class="card-charge">${chargeText}</div>
        `;
        
        // Слушатель выделения карты исследователем
        cardEl.addEventListener('click', () => {
            if (currentTurn !== "user") return; // Запрет ходить в ход Профессора
            playSound('click');
            
            cardEl.classList.toggle('selected');
            
            const index = selectedHandCards.indexOf(card);
            if (index > -1) {
                selectedHandCards.splice(index, 1);
            } else {
                selectedHandCards.push(card);
            }
            
            // Запускаем перерасчет зарядов на пульте управления
            updateActionButtonsState();
        });
        
        handBox.appendChild(cardEl);
    });
}
// ПОРЦИЯ 7: АНАЛИЗАТОР ИОННЫХ ЗАРЯДОВ И КОНТРОЛЬ ПУЛЬТА УПРАВЛЕНИЯ

function updateActionButtonsState() {
    const btnDiss = document.getElementById('btn-dissociated');
    const btnSed = document.getElementById('btn-sediment');
    const btnDeg = document.getElementById('btn-degassed');
    const btnNeut = document.getElementById('btn-neutralized');

    // Если исследователь не выбрал ни одной карты — полностью тушим пульт признаков
    if (selectedHandCards.length === 0) {
        btnDiss.disabled = btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true;
        return;
    }

    // Считаем суммарную валентность выбранных карт защиты/атаки на руке
    let sumCharge = 0;
    selectedHandCards.forEach(c => sumCharge += c.charge);

    // СЦЕНАРИЙ А: ВЫ ХОДИТЕ ПЕРВЫМ (Зона атаки на столе пуста)
    if (tableAttackCards.length === 0) {
        const firstType = selectedHandCards[0].type;
        const isSameType = selectedHandCards.every(c => c.type === firstType);
        
        const hasH = selectedHandCards.some(c => c.id === "H");
        const hasOH = selectedHandCards.some(c => c.id === "OH");
        
        // Особое правило первого хода: если выбрана ровно одна пара H+ и OH-, открываем нейтрализацию ("Вода!")
        if (selectedHandCards.length === 2 && hasH && hasOH) {
            btnNeut.disabled = false;
            btnDiss.disabled = btnSed.disabled = btnDeg.disabled = true;
        } else if (isSameType) {
            // Обычный ход можно сделать только однородными ионами (например, выкинуть сразу два хлорида)
            btnDiss.disabled = false;
            btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true;
        } else {
            btnDiss.disabled = btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true;
        }
    } 
    // СЦЕНАРИЙ Б: ВЫ ОТБИВАЕТЕСЬ (На столе лежит атака противника)
    else {
        let attackCharge = 0;
        tableAttackCards.forEach(c => attackCharge += c.charge);

        // Математическое равенство: сумма зарядов атаки и защиты должна быть строго равна 0
        if (attackCharge + sumCharge === 0) {
            btnDiss.disabled = false;
            btnSed.disabled = false;
            btnDeg.disabled = false;
            
            // Проверяем наличие водорода и гидроксида в общей массе смеси для кнопки Воды
            const hasH = [...tableAttackCards, ...selectedHandCards].some(c => c.id === "H");
            const hasOH = [...tableAttackCards, ...selectedHandCards].some(c => c.id === "OH");
            btnNeut.disabled = !(hasH && hasOH);
        } else {
            // Если баланс валентности нарушен — блокируем пульт, заставляя пересчитать ионы
            btnDiss.disabled = btnSed.disabled = btnDeg.disabled = btnNeut.disabled = true;
        }
    }
}
// ПОРЦИЯ 8: СВЯЗЫВАНИЕ КНОПОК ПУЛЬТА И АВАРИЙНЫЙ ЗАБОР КАРТ (АССОЦИАЦИЯ)

const btnDissEl = document.getElementById('btn-dissociated');
const btnDegEl = document.getElementById('btn-degassed');
const btnNeutEl = document.getElementById('btn-neutralized');
const btnSedEl = document.getElementById('btn-sediment');
const btnAssocEl = document.getElementById('btn-associated');

// Привязка базовых выкриков-признаков реакций
if (btnDissEl) btnDissEl.addEventListener('click', () => processPlayerAction('R'));
if (btnDegEl) btnDegEl.addEventListener('click', () => processPlayerAction('G'));
if (btnNeutEl) btnNeutEl.addEventListener('click', () => processPlayerAction('W'));

// Логика кнопки "ОСАДОК!" — открывает панель выбора цвета
if (btnSedEl) {
    btnSedEl.addEventListener('click', () => {
        playSound('click');
        document.getElementById('color-picker-overlay').classList.add('active');
    });
}

// Привязка событий клика на спектральные кнопки цветов осадка
document.querySelectorAll('.color-select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('color-picker-overlay').classList.remove('remove');
        document.getElementById('color-picker-overlay').classList.remove('active');
        processPlayerAction('N', this.dataset.color);
    });
});

// КНОПКА ШТРАФА: "АССОЦИИРОВАЛ!"
if (btnAssocEl) {
    btnAssocEl.addEventListener('click', () => {
        if (currentTurn !== "user" || tableAttackCards.length === 0) return;
        playSound('error');
        
        // Исследователь забирает всю атаку со стола себе в руку
        userHand.push(...tableAttackCards);
        tableAttackCards = [];
        tableDefenseCards = [];
        
        document.getElementById('reactor-status').textContent = "ВЫ АССОЦИИРОВАЛИ ИОНЫ. ХОД ПРОФЕССОРА.";
        currentTurn = "ai";
        
        // Добираем карты до 6, обновляем UI и запускаем ИИ
        drawCardsToSix();
        updateReactorUI();
        renderTableZones();
        
        setTimeout(executeAiTurn, 2000);
    });
}
// УМНЫЙ СИНТЕЗАТОР ХИМИЧЕСКИХ ФОРМУЛ С УЧЕТОМ ИНДЕКСОВ
function generateChemicalFormula(cationId, anionId) {
    // Находим чистые объекты ионов, чтобы узнать их заряды
    const catObj = cst_cations.find(c => c.id === cationId);
    const anObj = cst_anions.find(a => a.id === anionId);
    
    if (!catObj || !anObj) return "";

    const cCharge = catObj.charge;
    const aCharge = Math.abs(anObj.charge);

    // Ищем наименьшее общее кратное (НОК) для зарядов (для 2 и 3 -> 6, для 2 и 2 -> 2)
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const lcm = (cCharge * aCharge) / gcd(cCharge, aCharge);

    // Рассчитываем индексы
    let cIndex = lcm / cCharge;
    let sIndex = lcm / aCharge;

    // Форматируем отображение катиона
    let cText = cationId;
    if (cIndex > 1) {
        cText += `<sub>${cIndex}</sub>`;
    }

    // Форматируем отображение аниона (если он сложный, например SO4 или PO4, и нужен индекс > 1, берем в скобки)
    let aText = anionId;
    // Проверяем, сложный ли анион (содержит ли он цифры или несколько заглавных букв, кроме ОН)
    const isComplex = (anionId.length > 2 || anionId === "OH" || /\d/.test(anionId));
    
    if (sIndex > 1) {
        if (isComplex) {
            aText = `(${anionId})<sub>${sIndex}</sub>`;
        } else {
            aText = `${anionId}<sub>${sIndex}</sub>`;
        }
    }

    // Особые случаи оформления (например, для воды лучше вывести H2O, а не HOH)
    if (cationId === "H" && anionId === "OH") {
        return "H<sub>2</sub>O";
    }

    return cText + aText;
}
// ПОРЦИЯ 9: ХИМИЧЕСКИЙ АРБИТРАЖ, ДОБОР И ПРОВЕРКА УСЛОВИЙ ПОБЕДЫ

function processPlayerAction(claimedState, claimedColor = null) {
    playSound('click');
    const statusText = document.getElementById('reactor-status');

    // СЦЕНАРИЙ А: Игрок ходит первым на пустой стол
    if (tableAttackCards.length === 0) {
        tableAttackCards = [...selectedHandCards];
        userHand = userHand.filter(c => !selectedHandCards.includes(c));
        
        const hasH = tableAttackCards.some(c => c.id === "H");
        const hasOH = tableAttackCards.some(c => c.id === "OH");
        
        // Если это был легитимный стартовый сброс "Воды" (H+ и OH-)
        if (tableAttackCards.length === 2 && hasH && hasOH && claimedState === 'W') {
            playSound('success');
            statusText.innerHTML = `<span class="green-text">ВЫКРИК: "Вода!". Первая нейтрализация успешна! Карты в раствор.</span>`;
            tableAttackCards = []; // Сразу отправляем в "биту"
            currentTurn = "user"; // Начинающий получает право сделать следующий ход
        } else {
            statusText.textContent = "ПОТОК ИОНОВ НАПРАВЛЕН НА ПРОФЕССОРА. ОЖИДАНИЕ ОТВЕТА ИИ...";
            currentTurn = "ai";
            setTimeout(executeAiTurn, 2000);
        }
        clearSelectedAndNext();
        return;
    }

    // СЦЕНАРИЙ Б: Игрок защищается от атаки Профессора
    tableDefenseCards = [...selectedHandCards];
    userHand = userHand.filter(c => !selectedHandCards.includes(c));

    let isChemicalTruth = true;
    let actualReactionData = null;

    // Сканируем пары на столе для поиска осадков, газов или воды в таблице растворимости
    for (let cat of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'cation')) {
        for (let an of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'anion')) {
            const pairKey = `${cat.id}_${an.id}`;
            if (solubilityMap[pairKey]) {
                actualReactionData = solubilityMap[pairKey];
                break;
            }
        }
    }

    // Если пары в особой карте нет — по умолчанию вещество растворимо (диссоциировало)
    if (!actualReactionData) {
        actualReactionData = { state: "R", desc: "Вещество полностью диссоциировало!" };
    }

    // Сверяем химическую истинность
    if (actualReactionData.state !== claimedState) isChemicalTruth = false;
    if (claimedState === 'N' && actualReactionData.color !== claimedColor) isChemicalTruth = false;

    if (isChemicalTruth) {
        playSound('success');
        statusText.innerHTML = `<span class="green-text">ВЕРНО! ${actualReactionData.desc} Защита принята. Ионы в раствор!</span>`;
        tableAttackCards = [];
        tableDefenseCards = [];
        currentTurn = "user"; // Отбился — получил право атаковать самому
    } else {
        playSound('error');
        statusText.innerHTML = `<span class="text-error">ХИМИЧЕСКАЯ ОШИБКА АНАЛИЗА! Вы забираете ВСЕ карты!</span>`;
        // Наказание за ошибку: забираем всё себе в руку
        userHand.push(...tableAttackCards, ...tableDefenseCards);
        tableAttackCards = [];
        tableDefenseCards = [];
        currentTurn = "ai"; // Ход переходит к ИИ
        setTimeout(executeAiTurn, 2000);
    }
    clearSelectedAndNext();
}

// Завершение хода, добор и проверка триггера финала игры
function clearSelectedAndNext() {
    drawCardsToSix();
    updateReactorUI();
    renderTableZones();
    updateActionButtonsState();
    
    if (userHand.length === 0 && gameDeck.length === 0) {
        alert("НЕВЕРОЯТНО! ВЫ СБРОСИЛИ ВСЕ ИОНЫ И ПОБЕДИЛИ ПРОФЕССОРА!");
        location.reload();
    }
}

// Функция автоматического добора карт до 6 штук из резерва
function drawCardsToSix() {
    while (userHand.length < 6 && gameDeck.length > 0) userHand.push(gameDeck.pop());
    while (aiHand.length < 6 && gameDeck.length > 0) aiHand.push(gameDeck.pop());
}
// ПОРЦИЯ 10: ГРАФИКА СТОЛА И ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ ПРОФЕССОРА (ИИ)

// ОБНОВЛЕННАЯ ВИЗУАЛИЗАЦИЯ СТОЛА С СИНТЕЗОМ ФОРМУЛЫ В ПРАВОМ ЭКРАНЕ
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
        if (tableDefenseCards.length === 0 && selectedHandCards.length === 0) {
            // Если защиты нет, пишем стандартный текст
            defenseZone.innerHTML = '<div class="reactor-empty-text">ОЖИДАНИЕ РЕАКЦИИ</div>';
        } else {
            // Собираем все карты, которые сейчас участвуют в защите (или выбраны на руке)
            const activeDefense = tableDefenseCards.length > 0 ? tableDefenseCards : selectedHandCards;
            
            // Отрисовываем карты защиты на столе
            activeDefense.forEach(c => defenseZone.appendChild(createStaticCardElement(c)));

            // КЛЮЧЕВОЙ АПДЕЙТ: Если есть и катионы, и анионы, генерируем формулу!
            const allCurrentCards = [...tableAttackCards, ...activeDefense];
            const firstCation = allCurrentCards.find(c => c.type === 'cation');
            const firstAnion = allCurrentCards.find(c => c.type === 'anion');

            if (firstCation && firstAnion) {
                const formulaHtml = generateChemicalFormula(firstCation.id, firstAnion.id);
                
                // Создаем красивый брутальный шильдик с формулой поверх правого экрана
                const formulaBadge = document.createElement('div');
                formulaBadge.className = 'formula-display-badge';
                formulaBadge.innerHTML = `СИНТЕЗ: <span class="formula-text">${formulaHtml}</span>`;
                defenseZone.appendChild(formulaBadge);
            }
        }
    }
}
// Создание некликабельных копий карточек для отображения на столе
function createStaticCardElement(card) {
    const el = document.createElement('div');
    el.className = `card ${card.type}`;
    const chargeText = card.charge > 0 ? (card.charge === 1 ? "+" : `${card.charge}+`) : (card.charge === -1 ? "-" : `${Math.abs(card.charge)}-`);
    el.innerHTML = `<div class="card-symbol">${card.id}</div><div class="card-charge">${chargeText}</div>`;
    return el;
}

// ОСОБЫЙ СТАРТОВЫЙ ХОД ИИ: Профессор выбивает "Воду!"
function executeAiFirstTurn() {
    const hCard = aiHand.find(c => c.uid === "start-h");
    const ohCard = aiHand.find(c => c.uid === "start-oh");
    
    if (hCard && ohCard) {
        tableAttackCards.push(hCard, ohCard);
        aiHand = aiHand.filter(c => c.uid !== "start-h" && c.uid !== "start-oh");
        playSound('success');
        document.getElementById('reactor-status').innerHTML = `<span class="text-error">ПРОФЕССОР: "Вода!". Стартовая нейтрализация выполнена. Ваш ход!</span>`;
        tableAttackCards = [];
        currentTurn = "user";
    }
    clearSelectedAndNext();
}

// РЕГУЛЯРНЫЙ ИГРОВОЙ ЦИКЛ КОМПЬЮТЕРНОГО СОПЕРНИКА
function executeAiTurn() {
    if (currentTurn !== "ai") return;
    const statusText = document.getElementById('reactor-status');

    // Ситуация 1: Профессор АТАКУЕТ на пустой стол
    if (tableAttackCards.length === 0) {
        if (aiHand.length === 0) return;
        // Случайно выбирает карту и выкидывает все такие же ионы из своей руки
        const randomCard = aiHand[Math.floor(Math.random() * aiHand.length)];
        const matchingCards = aiHand.filter(c => c.id === randomCard.id);
        
        tableAttackCards.push(...matchingCards);
        aiHand = aiHand.filter(c => !matchingCards.includes(c));
        
        statusText.innerHTML = `<span class="text-error">Профессор атаковал вас ионами: ${randomCard.id}! Сбалансируйте заряд!</span>`;
        currentTurn = "user";
        clearSelectedAndNext();
        return;
    }

    // Ситуация 2: Профессор ЗАЩИЩАЕТСЯ от вашей атаки
    let attackCharge = 0;
    tableAttackCards.forEach(c => attackCharge += c.charge);
    
    // ИИ запускает алгоритмический перебор карт в руке для баланса валентности
    let defensiveCombination = findAiDefensiveCombination(attackCharge);

    if (defensiveCombination.length > 0) {
        tableDefenseCards.push(...defensiveCombination);
        aiHand = aiHand.filter(c => !defensiveCombination.includes(c));

        // ИИ сканирует стол на наличие осадков, газов и воды по карте растворимости
        let reaction = null;
        for (let cat of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'cation')) {
            for (let an of [...tableAttackCards, ...tableDefenseCards].filter(c => c.type === 'anion')) {
                if (solubilityMap[`${cat.id}_${an.id}`]) { reaction = solubilityMap[`${cat.id}_${an.id}`]; break; }
            }
        }
        if (!reaction) reaction = { state: "R", desc: "Диссоциировал!" };

        playSound('success');
        statusText.innerHTML = `<span class="text-error">Профессор защитился и заявляет: "${reaction.state === 'N' ? 'ОСАДОК!' : (reaction.state === 'G' ? 'ДЕГАЗИРОВАЛСЯ!' : 'ДИССОЦИИРОВАЛ!')}". Ионы уходят в раствор.</span>`;
        
        tableAttackCards = [];
        tableDefenseCards = [];
        currentTurn = "ai"; // Успешно отбившись, ИИ оставляет право хода за собой
        
        clearSelectedAndNext();
        setTimeout(executeAiTurn, 2500); // Автоматически переходит к своей атаке через паузу
    } else {
        // Если Профессор не нашел математического решения по зарядам — он капитулирует (АССОЦИИРУЕТ)
        playSound('error');
        aiHand.push(...tableAttackCards);
        tableAttackCards = [];
        tableDefenseCards = [];
        
        statusText.innerHTML = `<span class="green-text">Профессор не смог отбиться и ассоциировал ионы! Ваш ход!</span>`;
        currentTurn = "user";
        clearSelectedAndNext();
    }
}

// Математический подбор карт валентности для ИИ (Одиночные, пары и триплеты)
function findAiDefensiveCombination(targetAttackCharge) {
    for (let c1 of aiHand) {
        if (targetAttackCharge + c1.charge === 0) return [c1];
    }
    for (let i = 0; i < aiHand.length; i++) {
        for (let j = i + 1; j < aiHand.length; j++) {
            if (targetAttackCharge + aiHand[i].charge + aiHand[j].charge === 0) return [aiHand[i], aiHand[j]];
        }
    }
    return [];
}

// Запуск первичного триггера проверки полей ввода при старте приложения
checkAuthInputs();
