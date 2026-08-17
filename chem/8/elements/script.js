// База данных строго по советской/российской короткой форме ПСХЭ (для первых 4-х периодов)
// Сетка: 7 рядов (с учетом деления больших периодов на ряды) на 8 групп (колонок)
const elementsData = [
    // ПЕРИОД 1 (Ряд 1)
    { symbol: 'H', name: 'Водород', row: 1, col: 1 },
    { symbol: 'He', name: 'Гелий', row: 1, col: 8 },
    
    // ПЕРИОД 2 (Ряд 2)
    { symbol: 'Li', name: 'Литий', row: 2, col: 1 },
    { symbol: 'Be', name: 'Бериллий', row: 2, col: 2 },
    { symbol: 'B', name: 'Бор', row: 2, col: 3 },
    { symbol: 'C', name: 'Углерод', row: 2, col: 4 },
    { symbol: 'N', name: 'Азот', row: 2, col: 5 },
    { symbol: 'O', name: 'Кислород', row: 2, col: 6 },
    { symbol: 'F', name: 'Фтор', row: 2, col: 7 },
    { symbol: 'Ne', name: 'Неон', row: 2, col: 8 },
    
    // ПЕРИОД 3 (Ряд 3)
    { symbol: 'Na', name: 'Натрий', row: 3, col: 1 },
    { symbol: 'Mg', name: 'Магний', row: 3, col: 2 },
    { symbol: 'Al', name: 'Алюминий', row: 3, col: 3 },
    { symbol: 'Si', name: 'Кремний', row: 3, col: 4 },
    { symbol: 'P', name: 'Фосфор', row: 3, col: 5 },
    { symbol: 'S', name: 'Сера', row: 3, col: 6 },
    { symbol: 'Cl', name: 'Хлор', row: 3, col: 7 },
    { symbol: 'Ar', name: 'Аргон', row: 3, col: 8 },
    
    // ПЕРИОД 4 — ВЕРХНИЙ РЯД (Ряд 4 по нашей сетке)
    { symbol: 'K', name: 'Калий', row: 4, col: 1 },
    { symbol: 'Ca', name: 'Кальций', row: 4, col: 2 },
    { symbol: 'Sc', name: 'Скандий', row: 4, col: 3 },
    { symbol: 'Ti', name: 'Титан', row: 4, col: 4 },
    { symbol: 'V', name: 'Ванадий', row: 4, col: 5 },
    { symbol: 'Cr', name: 'Хром', row: 4, col: 6 },
    { symbol: 'Mn', name: 'Марганец', row: 4, col: 7 },
    
    // Триада железа (Они делят 8-ю группу в верхнем ряду 4-го периода)
    // Чтобы у каждого была СВОЯ ячейка, мы сдвинем Co и Ni в соседние ячейки виртуального расширения ряда 4
    { symbol: 'Fe', name: 'Железо', row: 4, col: 8 },
    { symbol: 'Co', name: 'Кобальт', row: 4, col: 9 },
    { symbol: 'Ni', name: 'Никель', row: 4, col: 10 },
    
    // ПЕРИОД 4 — НИЖНИЙ РЯД (Ряд 5 по нашей сетке)
    // Обратите внимание: элементы по картинке смещены (например, Cu под Ca, Zn под Sc и т.д.)
    { symbol: 'Cu', name: 'Медь', row: 5, col: 1 },
    { symbol: 'Zn', name: 'Цинк', row: 5, col: 2 },
    { symbol: 'Ga', name: 'Галлий', row: 5, col: 3 },
    { symbol: 'Ge', name: 'Германий', row: 5, col: 4 },
    { symbol: 'As', name: 'Мышьяк', row: 5, col: 5 },
    { symbol: 'Se', name: 'Селен', row: 5, col: 6 },
    { symbol: 'Br', name: 'Бром', row: 5, col: 7 },
    { symbol: 'Kr', name: 'Криптон', row: 5, col: 8 }
];

// Web Audio API Синтезатор звука (Безошибочный метод воспроизведения звука клика Half-Life)
let audioCtx = null;

function playHLSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Если контекст "уснул" из-за политик безопасности, будим его
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Создаем звуковой узел (Осциллятор)
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Настройка частоты для воссоздания электронного "клика костюма HEV / Терминала"
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Высокая нота (Ля)
        osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.08); // Резкое падение частоты вниз
        
        // Настройка громкости (резкое затухание для имитации щелчка)
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    } catch(e) {
        console.log("Audio Error: ", e);
    }
}

// Конфигурация Google Forms (перенесите сюда ваши сохраненные ID)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc_VBm6LD0ZGFgZUTVOBN7MepuP4gZrft1WydLoB3MBHzxOwg/formResponse"; 
const FORM_ENTRIES = {
    name: "entry.743705304",   
    group: "entry.2070572231",  
    score: "entry.1852517913",  
    grade: "entry.1463755207"   
};

let studentName = "";
let studentClass = "";
let testElements = [];
let currentIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 100;

function renderShortTable() {
    const tableContainer = document.getElementById('periodic-table');
    tableContainer.innerHTML = '';
    
    // Отрисовка стабильной сетки 6 рядов на 8 групп
    for (let r = 1; r <= 6; r++) {
        for (let c = 1; c <= 8; c++) {
            // Ищем элемент для текущей ячейки
            const element = elementsData.find(e => e.row === r && e.col === c);
            
            if (element) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = element.symbol;
                cell.dataset.symbol = element.symbol;
                
                cell.addEventListener('click', () => {
                    playHLSound(); // Вспышка и звук терминала
                    
                    cell.classList.add('flash-active');
                    
                    // Проверяем, совпадает ли клик с текущим загаданным элементом
                    const isCorrect = (element.symbol === testElements[currentIndex].symbol);
                    
                    setTimeout(() => {
                        cell.classList.remove('flash-active');
                        handleCellClick(isCorrect);
                    }, 150);
                });
                tableContainer.appendChild(cell);
            } else {
                // Если элемента в этих координатах нет, создаем пустую некликабельную зону
                const cell = document.createElement('div');
                cell.className = 'cell empty';
                tableContainer.appendChild(cell);
            }
        }
    }
}

document.getElementById('start-btn').addEventListener('click', () => {
    studentName = document.getElementById('student-name').value.trim();
    studentClass = document.getElementById('student-class').value.trim();
    
    if (!studentName || !studentClass) {
        alert("Авторизация отклонена терминалом Black Mesa.");
        return;
    }
    
    playHLSound(); // Прогреваем аудио-контекст первым разрешенным кликом
    
    document.getElementById('display-name').textContent = studentName;
    
    // Рандомим 21 уникальный элемент из нашей базы в 32 штуки
    testElements = [...elementsData].sort(() => 0.5 - Math.random()).slice(0, 21);
    
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    renderShortTable();
    nextQuestion();
});

function nextQuestion() {
    clearInterval(timerInterval);
    if (currentIndex >= testElements.length) {
        endGame();
        return;
    }
    document.getElementById('current-step').textContent = currentIndex + 1;
    document.getElementById('target-element').textContent = testElements[currentIndex].name.toUpperCase();
    startTimer();
}

function startTimer() {
    timeLeft = 100;
    const progressBar = document.getElementById('timer-progress');
    
    timerInterval = setInterval(() => {
        timeLeft -= 1;
        progressBar.style.width = `${timeLeft}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentIndex++;
            nextQuestion();
        }
    }, 100);
}

function handleCellClick(isCorrect) {
    if (isCorrect) {
        score++;
    }
    currentIndex++;
    nextQuestion();
}

function calculateGrade(score) {
    if (score >= 19) return "5";
    if (score >= 15) return "4";
    if (score >= 10) return "3";
    return "2";
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('final-screen').classList.add('active');
    
    const grade = calculateGrade(score);
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-grade').textContent = grade;
    
    sendResultsToGoogle(grade);
}

function sendResultsToGoogle(grade) {
    const formData = new FormData();
    formData.append(FORM_ENTRIES.name, studentName);
    formData.append(FORM_ENTRIES.group, studentClass);
    formData.append(FORM_ENTRIES.score, score);
    formData.append(FORM_ENTRIES.grade, grade);
    
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        document.getElementById('sync-status').textContent = "ДАННЫЕ СИНХРОНИЗИРОВАНЫ С СЕРВЕРОМ BLACK MESA.";
        document.getElementById('restart-btn').classList.remove('hidden');
    })
    .catch((error) => {
        document.getElementById('sync-status').textContent = "ОШИБКА СВЯЗИ. Передайте экран учителю.";
        document.getElementById('restart-btn').classList.remove('hidden');
    });
}
