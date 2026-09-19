// База данных эмодзи по царствам живой природы
const KINGDOMS_DATA = {
    "РАСТЕНИЯ": ["🌺", "🌸", "🌹", "🌻", "🌲", "🌳", "🌴", "🌵", "🌿", "🍀", "🍁", "🌾", "🍏", "🍎", "🍐", "🍊", "🍋", "🍒", "🍍", "🌽", "🥕", "🍇", "🍅"],
    "ЖИВОТНЫЕ": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🐝", "🪱", "🪲", "🪰", "🐌", "🦋"],
    "ГРИБЫ": ["🍄"],
    "БАКТЕРИИ": ["🦠"]
};

// Список всех доступных царств для выбора цели
const KINGDOM_NAMES = Object.keys(KINGDOMS_DATA);

// Игровые переменные
let score = 0;
let level = 1;
let lives = 3; // Новая переменная для жизней
let currentTargetKingdom = "";
let gameActive = false;
let isPaused = false; // Новое состояние паузы
let baseSpeed = 3.5; 
let spawnInterval = 900; 
let spawnTimerId = null;
let activeEmojis = [];

// DOM элементы
const gameTerminal = document.getElementById("game-terminal");
const startScreen = document.getElementById("start-screen");
const pauseScreen = document.getElementById("pause-screen"); // Элемент экрана паузы
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn"); // Кнопка паузы
const resumeBtn = document.getElementById("resume-btn"); // Кнопка продолжить
const scoreValue = document.getElementById("score-value");
const levelValue = document.getElementById("level-value");
const livesContainer = document.getElementById("lives-container"); // Контейнер жизней
const targetKingdom = document.getElementById("target-kingdom");

// Старт игры по клику на кнопку
startBtn.addEventListener("click", startGame);
// Обработчики для паузы
pauseBtn.addEventListener("click", togglePause);
resumeBtn.addEventListener("click", togglePause);

function togglePause() {
    if (!gameActive) return; // Не ставим на паузу, если игра не началась или окончена

    isPaused = !isPaused;
    
    if (isPaused) {
        // Включаем паузу
        pauseScreen.style.display = "flex";
        pauseBtn.textContent = "▶️";
        pauseBtn.classList.add("paused");
        clearTimeout(spawnTimerId); // Останавливаем появление новых эмодзи
    } else {
        // Выключаем паузу
        pauseScreen.style.display = "none";
        pauseBtn.textContent = "⏸️";
        pauseBtn.classList.remove("paused");
        // Перезапускаем игровой цикл анимации и генерации
        requestAnimationFrame(gameLoop);
        scheduleNextSpawn();
    }
}

function startGame() {
    initAudio();
    startScreen.style.display = "none";
    score = 0;
    level = 1;
    lives = 3; // Сброс жизней
    baseSpeed = 3.5;
    spawnInterval = 900;
    activeEmojis = [];
    gameActive = true;
    isPaused = false;
    
    updateScoreDisplay();
    updateLevelDisplay();
    updateLivesDisplay(); // Обновление сердечек на экране
    changeTargetKingdom();
    
    gameLoop();
    scheduleNextSpawn();
}

function updateLivesDisplay() {
    livesContainer.textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
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

function handleEmojiClick(emojiEl) {
    if (!gameActive || isPaused) return; // Блокируем клики на паузе

    const isCorrect = emojiEl.dataset.correct === "true";

    if (isCorrect) {
        score += 10;
        playSound("correct");
        updateScoreDisplay();
        
        emojiEl.style.transform += " scale(1.3)";
        emojiEl.style.opacity = "0";
        emojiEl.style.pointerEvents = "none";
        
        if (score % 100 === 0) {
            levelUp();
        }
        
        if (Math.random() > 0.6) {
            changeTargetKingdom();
            updateActiveEmojisStatus();
        }
    } else {
        // Ошибка: минус жизнь
        lives--;
        playSound("wrong");
        updateLivesDisplay();
        
        emojiEl.style.filter = "grayscale(100%) opacity(0.5)";
        emojiEl.style.pointerEvents = "none";
        
        if (lives <= 0) {
            gameOver();
        }
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
    if (!gameActive || isPaused) return; // Если пауза — останавливаем перерисовку кадров

    const terminalHeight = gameTerminal.clientHeight;

    for (let i = activeEmojis.length - 1; i >= 0; i--) {
        const item = activeEmojis[i];
        
        item.y += baseSpeed;
        item.element.style.transform = `translateY(${item.y}px)`;

        if (item.y > terminalHeight) {
            // Если игрок ПРОПУСТИЛ нужное царство (оно улетело вниз целым)
            if (item.isCorrect && item.element.style.opacity !== "0" && item.element.style.pointerEvents !== "none") {
                lives--;
                playSound("wrong");
                updateLivesDisplay();
                
                if (lives <= 0) {
                    gameOver();
                    return; // Немедленно выходим из цикла
                }
            }
            
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
// Логика звуковых эффектов (Web Audio API)
let isMuted = false;
let audioCtx = null;

const muteBtn = document.getElementById("mute-btn");

muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
    muteBtn.classList.toggle("muted", isMuted);
});

// Функция для инициализации аудио (нужна из-за политики безопасности браузеров)
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Универсальный синтезатор коротких звуков
function playSound(type) {
    if (isMuted) return;
    
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainContainer = audioCtx.createGain();
    
    osc.connect(gainContainer);
    gainContainer.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === "correct") {
        // Ретро-звук успеха (короткий прыжок частоты вверх)
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        
        gainContainer.gain.setValueAtTime(0.3, now);
        gainContainer.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === "wrong") {
        // Звук ошибки (низкий, нисходящий басовый звук)
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.2);
        
        gainContainer.gain.setValueAtTime(0.2, now);
        gainContainer.gain.linearRampToValueAtTime(0.01, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
    }
}
