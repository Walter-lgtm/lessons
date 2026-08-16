// Координаты элементов для Короткой формы ПСХЭ (8 групп / столбцов)
// Лантаноиды и актиноиды исключены. Поля row (ряд) и col (группа от 1 до 8)
const elementsData = [
    { symbol: 'H', name: 'Водород', row: 1, col: 1 },
    { symbol: 'He', name: 'Гелий', row: 1, col: 8 },
    { symbol: 'Li', name: 'Литий', row: 2, col: 1 },
    { symbol: 'Be', name: 'Бериллий', row: 2, col: 2 },
    { symbol: 'B', name: 'Бор', row: 2, col: 3 },
    { symbol: 'C', name: 'Углерод', row: 2, col: 4 },
    { symbol: 'N', name: 'Азот', row: 2, col: 5 },
    { symbol: 'O', name: 'Кислород', row: 2, col: 6 },
    { symbol: 'F', name: 'Фтор', row: 2, col: 7 },
    { symbol: 'Ne', name: 'Неон', row: 2, col: 8 },
    { symbol: 'Na', name: 'Натрий', row: 3, col: 1 },
    { symbol: 'Mg', name: 'Магний', row: 3, col: 2 },
    { symbol: 'Al', name: 'Алюминий', row: 3, col: 3 },
    { symbol: 'Si', name: 'Кремний', row: 3, col: 4 },
    { symbol: 'P', name: 'Фосфор', row: 3, col: 5 },
    { symbol: 'S', name: 'Сера', row: 3, col: 6 },
    { symbol: 'Cl', name: 'Хлор', row: 3, col: 7 },
    { symbol: 'Ar', name: 'Аргон', row: 3, col: 8 },
    { symbol: 'K', name: 'Калий', row: 4, col: 1 },
    { symbol: 'Ca', name: 'Кальций', row: 4, col: 2 },
    { symbol: 'Fe', name: 'Железо', row: 4, col: 8 } 
];

// Подключаем аудиоэффект Half-Life (звук клика по интерфейсу)
const hlClickSound = new Audio("https://google.com"); // Резервный научно-электронный звук
// Если хотите оригинальный звук кнопок Half-Life, можно загрузить свой button3.wav и указать относительный путь: new Audio("sounds/button3.wav");
hlClickSound.volume = 0.5;

// Сюда вставьте ваши проверенные данные из консоли Гугл-Формы!
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

// Рендеринг короткой таблицы (максимум 4 ряда для нашей выборки)
function renderShortTable() {
    const tableContainer = document.getElementById('periodic-table');
    tableContainer.innerHTML = '';
    
    // Короткая форма использует сетку 4 рядов на 8 групп для текущего набора элементов
    for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= 8; c++) {
            const cell = document.createElement('div');
            const element = elementsData.find(e => e.row === r && e.col === c);
            
            if (element) {
                cell.className = 'cell';
                cell.textContent = element.symbol;
                cell.dataset.symbol = element.symbol;
                
                // Добавляем обработку тапа и звука
                cell.addEventListener('click', () => {
                    playHLSound();
                    handleCellClick(element.symbol);
                });
            } else {
                cell.className = 'cell empty';
            }
            tableContainer.appendChild(cell);
        }
    }
}

function playHLSound() {
    // Сбрасываем аудио дорожку на начало перед каждым кликом (для частых тапов)
    hlClickSound.currentTime = 0;
    hlClickSound.play().catch(e => console.log("Аудио заблокировано политикой браузера до первого взаимодействия"));
}

document.getElementById('start-btn').addEventListener('click', () => {
    studentName = document.getElementById('student-name').value.trim();
    studentClass = document.getElementById('student-class').value.trim();
    
    if (!studentName || !studentClass) {
        alert("Пожалуйста, авторизуйтесь в системе Black Mesa.");
        return;
    }
    
    // Воспроизводим звук при успешном входе
    playHLSound();
    
    document.getElementById('display-name').textContent = studentName;
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

function handleCellClick(clickedSymbol) {
    const correctSymbol = testElements[currentIndex].symbol;
    if (clickedSymbol === correctSymbol) {
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
