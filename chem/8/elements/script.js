// Расширенная база данных: 32 химических элемента (Полные первые 4 периода короткой формы ПСХЭ)
const elementsData = [
    // Ряд 1
    { symbol: 'H', name: 'Водород', row: 1, col: 1 },
    { symbol: 'He', name: 'Гелий', row: 1, col: 8 },
    // Ряд 2
    { symbol: 'Li', name: 'Литий', row: 2, col: 1 },
    { symbol: 'Be', name: 'Бериллий', row: 2, col: 2 },
    { symbol: 'B', name: 'Бор', row: 2, col: 3 },
    { symbol: 'C', name: 'Углерод', row: 2, col: 4 },
    { symbol: 'N', name: 'Азот', row: 2, col: 5 },
    { symbol: 'O', name: 'Кислород', row: 2, col: 6 },
    { symbol: 'F', name: 'Фтор', row: 2, col: 7 },
    { symbol: 'Ne', name: 'Неон', row: 2, col: 8 },
    // Ряд 3
    { symbol: 'Na', name: 'Натрий', row: 3, col: 1 },
    { symbol: 'Mg', name: 'Магний', row: 3, col: 2 },
    { symbol: 'Al', name: 'Алюминий', row: 3, col: 3 },
    { symbol: 'Si', name: 'Кремний', row: 3, col: 4 },
    { symbol: 'P', name: 'Фосфор', row: 3, col: 5 },
    { symbol: 'S', name: 'Сера', row: 3, col: 6 },
    { symbol: 'Cl', name: 'Хлор', row: 3, col: 7 },
    { symbol: 'Ar', name: 'Аргон', row: 3, col: 8 },
    // Ряд 4 (Весь большой 4-й период, собранный по группам короткой формы I-VIII)
    { symbol: 'K', name: 'Калий', row: 4, col: 1 },
    { symbol: 'Ca', name: 'Кальций', row: 4, col: 2 },
    { symbol: 'Sc', name: 'Скандий', row: 4, col: 3 },
    { symbol: 'Ti', name: 'Титан', row: 4, col: 4 },
    { symbol: 'V', name: 'Ванадий', row: 4, col: 5 },
    { symbol: 'Cr', name: 'Хром', row: 4, col: 6 },
    { symbol: 'Mn', name: 'Марганец', row: 4, col: 7 },
    { symbol: 'Fe', name: 'Железо', row: 4, col: 8 },
    { symbol: 'Co', name: 'Кобальт', row: 4, col: 8 }, // В короткой форме триады VIII группы делят ячейку/колонку
    { symbol: 'Ni', name: 'Никель', row: 4, col: 8 },
    { symbol: 'Cu', name: 'Медь', row: 4, col: 1 },
    { symbol: 'Zn', name: 'Цинк', row: 4, col: 2 },
    { symbol: 'Ga', name: 'Галлий', row: 4, col: 3 },
    { symbol: 'Ge', name: 'Германий', row: 4, col: 4 },
    { symbol: 'As', name: 'Мышьяк', row: 4, col: 5 },
    { symbol: 'Se', name: 'Селен', row: 4, col: 6 },
    { symbol: 'Br', name: 'Бром', row: 4, col: 7 },
    { symbol: 'Kr', name: 'Криптон', row: 4, col: 8 }
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
    
    // Отрисовка стабильной сетки 4х8
    for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= 8; c++) {
            // Находим элементы для текущей ячейки
            const elements = elementsData.filter(e => e.row === r && e.col === c);
            
            if (elements.length > 0) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                // Если в ячейке по классической схеме несколько элементов (например Fe, Co, Ni в 4 ряду 8 группы), 
                // выводим их через слэш, но для теста выберем первый попавшийся символ как целевой клик, 
                // либо, если они разделены, берем случайный. Для простоты склеим их визуально.
                if (elements.length > 1) {
                    cell.textContent = elements.map(e => e.symbol).join('/');
                    cell.style.fontSize = '0.8rem'; // Ужимаем шрифт для триад
                    cell.dataset.symbol = elements[0].symbol; // Привязка к первому (или обработка любого ниже)
                } else {
                    cell.textContent = elements[0].symbol;
                    cell.dataset.symbol = elements[0].symbol;
                }
                
                cell.addEventListener('click', () => {
                    playHLSound(); // Активируется по тапу
                    // Проверяем, совпадает ли клик с любым элементом из этой ячейки
                    const isCorrect = elements.some(e => e.symbol === testElements[currentIndex].symbol);
                    handleCellClick(isCorrect);
                });
                tableContainer.appendChild(cell);
            } else {
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
