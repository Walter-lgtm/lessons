// База данных эмодзи по царствам живой природы
const KINGDOMS_DATA = {
    "РАСТЕНИЯ": ["🌺", "🌸", "🌹", "🌻", "🌲", "🌳", "🌴", "🌵", "🌿", "🍀", "🍁", "🌾", "🍏", "🍎", "🍐", "🍊", "🍋", "🍒", "🍍", "🌽", "🥕", "🍇", "🍅"],
    "ЖИВОТНЫЕ": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🫎", "🐝", "🪱", "🪲", "🪰", "🐌", "🦋"],
    "ГРИБЫ": ["🍄", "🍄‍🟫"],
    "БАКТЕРИИ": ["🦠"]
};

// Список всех доступных царств для выбора цели
const KINGDOM_NAMES = Object.keys(KINGDOMS_DATA);

// Игровые переменные
let score = 0;
let level = 1;
let currentTargetKingdom = "";
let gameActive = false;
let baseSpeed = 3.5; // БЫЛО 1.5. Теперь эмодзи летят бодрее с самого начала!
let spawnInterval = 900; // БЫЛО 1200. Теперь они появляются чуть чаще, создавая динамику.
let spawnTimerId = null;
let activeEmojis = [];

// DOM элементы
const gameTerminal = document.getElementById("game-terminal");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const scoreValue = document.getElementById("score-value");
const levelValue = document.getElementById("level-value");
const targetKingdom = document.getElementById("target-kingdom");

// Старт игры по клику на кнопку
startBtn.addEventListener("click", startGame);

function startGame() {
    startScreen.style.display = "none";
    score = 0;
    level = 1;
    baseSpeed = 1.5;
    spawnInterval = 1200;
    activeEmojis = [];
    gameActive = true;
    
    updateScoreDisplay();
    updateLevelDisplay();
    changeTargetKingdom();
    
    // Запуск генерации эмодзи
    gameLoop();
    scheduleNextSpawn();
}

// Выбор нового случайного целевого царства
function changeTargetKingdom() {
    const randomIndex = Math.floor(Math.random() * KINGDOM_NAMES.length);
    currentTargetKingdom = KINGDOM_NAMES[randomIndex];
    targetKingdom.textContent = currentTargetKingdom;
}

// Планирование появления следующего эмодзи
function scheduleNextSpawn() {
    if (!gameActive) return;
    
    spawnTimerId = setTimeout(() => {
        spawnEmoji();
        scheduleNextSpawn();
    }, spawnInterval);
}

// Создание падающего эмодзи
function spawnEmoji() {
    if (!gameActive) return;

    // Выбираем случайное царство, чтобы взять оттуда эмодзи
    const randomKingdom = KINGDOM_NAMES[Math.floor(Math.random() * KINGDOM_NAMES.length)];
    const emojiList = KINGDOMS_DATA[randomKingdom];
    const emojiChar = emojiList[Math.floor(Math.random() * emojiList.length)];

    // Создаем DOM-элемент
    const emojiEl = document.createElement("div");
    emojiEl.className = "emoji-item";
    emojiEl.textContent = emojiChar;
    
    // Запоминаем правильное ли это царство
    const isCorrect = (randomKingdom === currentTargetKingdom);
    emojiEl.dataset.correct = isCorrect;
    emojiEl.dataset.kingdom = randomKingdom;

    // Рандомное положение по горизонтали (учитывая ширину экрана и эмодзи)
    const terminalWidth = gameTerminal.clientWidth;
    const minX = 10;
    const maxX = terminalWidth - 80;
    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    
    emojiEl.style.left = `${randomX}px`;
    
    // Начальная позиция Y (над экраном)
    let posY = -100;
    emojiEl.style.transform = `translateY(${posY}px)`;

    // Обработка тапа по эмодзи
    emojiEl.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Защита от двойного тапа на мобильных
        handleEmojiClick(emojiEl);
    });
    emojiEl.addEventListener("mousedown", () => {
        handleEmojiClick(emojiEl);
    });

    gameTerminal.appendChild(emojiEl);

    // Добавляем в массив активных для анимации
    activeEmojis.push({
        element: emojiEl,
        y: posY,
        isCorrect: isCorrect
    });
}

// Обработка клика/тапа
function handleEmojiClick(emojiEl) {
    if (!gameActive) return;

    const isCorrect = emojiEl.dataset.correct === "true";

    if (isCorrect) {
        score += 10;
        updateScoreDisplay();
        
        // Визуальный эффект успеха
        emojiEl.style.transform += " scale(1.3)";
        emojiEl.style.opacity = "0";
        emojiEl.style.pointerEvents = "none";
        
        // Каждые 100 очков повышаем уровень и скорость
        if (score % 100 === 0) {
            levelUp();
        }
        
        // Смена цели раз в несколько верных тапов (для динамики)
        if (Math.random() > 0.6) {
            changeTargetKingdom();
            // Обновляем статус у всех летящих эмодзи под новую цель
            updateActiveEmojisStatus();
        }
    } else {
        // Ошибка: штраф по очкам (не уходим в минус)
        score = Math.max(0, score - 5);
        updateScoreDisplay();
        
        // Анимация тряски при ошибке
        emojiEl.style.filter = "grayscale(100%) opacity(0.5)";
        emojiEl.style.pointerEvents = "none";
    }
}

// Пересчет статусов «правильный/неправильный» при смене цели на лету
function updateActiveEmojisStatus() {
    activeEmojis.forEach(item => {
        const itemKingdom = item.element.dataset.kingdom;
        const isCorrect = (itemKingdom === currentTargetKingdom);
        item.element.dataset.correct = isCorrect;
        item.isCorrect = isCorrect;
    });
}

function levelUp() {
    level++;
    updateLevelDisplay();
    baseSpeed += 0.5; // Увеличиваем скорость падения
    spawnInterval = Math.max(400, spawnInterval - 150); // Эмодзи падают чаще
}

function updateScoreDisplay() { scoreValue.textContent = score; }
function updateLevelDisplay() { levelValue.textContent = level; }

// Главный игровой цикл для плавной анимации падения
function gameLoop() {
    if (!gameActive) return;

    const terminalHeight = gameTerminal.clientHeight;

    for (let i = activeEmojis.length - 1; i >= 0; i--) {
        const item = activeEmojis[i];
        
        // Скорость зависит от уровня
        item.y += baseSpeed;
        item.element.style.transform = `translateY(${item.y}px)`;

        // Если эмодзи упал за нижний край экрана
        if (item.y > terminalHeight) {
            // Если игрок пропустил НУЖНОЕ царство — штрафуем
            if (item.isCorrect && item.element.style.opacity !== "0") {
                score = Math.max(0, score - 5);
                updateScoreDisplay();
            }
            
            // Удаляем элемент
            item.element.remove();
            activeEmojis.splice(i, 1);
        }
    }

    requestAnimationFrame(gameLoop);
}

// Завершение игры (можно вызывать при проигрыше, пока просто сброс)
function gameOver() {
    gameActive = false;
    clearTimeout(spawnTimerId);
    
    // Удаляем все оставшиеся эмодзи
    activeEmojis.forEach(item => item.element.remove());
    activeEmojis = [];
    
    startScreen.innerHTML = `
        <h2>Игра окончена!</h2>
        <p>Ваш результат: <strong style="color: #ffff00">${score}</strong> очков, Уровень: <strong>${level}</strong></p>
        <button id="restart-btn">Играть снова</button>
    `;
    startScreen.style.display = "flex";
    document.getElementById("restart-btn").addEventListener("click", () => {
        // Перезагрузка страницы или сброс для новой игры
        location.reload();
    });
}
