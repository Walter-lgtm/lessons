// База данных элементов (21 элемент для теста, упорядочены по ПСХЭ для рендеринга полной сетки)
// Строка (row) от 1 до 7, Колонка (col) от 1 до 18
const elementsData = [
    { symbol: 'H', name: 'Водород', row: 1, col: 1 },
    { symbol: 'He', name: 'Гелий', row: 1, col: 18 },
    { symbol: 'Li', name: 'Литий', row: 2, col: 1 },
    { symbol: 'Be', name: 'Бериллий', row: 2, col: 2 },
    { symbol: 'B', name: 'Бор', row: 2, col: 13 },
    { symbol: 'C', name: 'Углерод', row: 2, col: 14 },
    { symbol: 'N', name: 'Азот', row: 2, col: 15 },
    { symbol: 'O', name: 'Кислород', row: 2, col: 16 },
    { symbol: 'F', name: 'Фтор', row: 2, col: 17 },
    { symbol: 'Ne', name: 'Неон', row: 2, col: 18 },
    { symbol: 'Na', name: 'Натрий', row: 3, col: 1 },
    { symbol: 'Mg', name: 'Магний', row: 3, col: 2 },
    { symbol: 'Al', name: 'Алюминий', row: 3, col: 13 },
    { symbol: 'Si', name: 'Кремний', row: 3, col: 14 },
    { symbol: 'P', name: 'Фосфор', row: 3, col: 15 },
    { symbol: 'S', name: 'Сера', row: 3, col: 16 },
    { symbol: 'Cl', name: 'Хлор', row: 3, col: 17 },
    { symbol: 'Ar', name: 'Аргон', row: 3, col: 18 },
    { symbol: 'K', row: 4, col: 1, name: 'Калий' },
    { symbol: 'Ca', row: 4, col: 2, name: 'Кальций' },
    { symbol: 'Fe', row: 4, col: 8, name: 'Железо' }
];

// Настройки интеграции с Google Forms (ЗАМЕНИТЕ НА СВОИ ДАННЫЕ)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc_VBm6LD0ZGFgZUTVOBN7MepuP4gZrft1WydLoB3MBHzxOwg/formResponse"; 
const FORM_ENTRIES = {
    name: "entry.743705304",   // ID поля ФИО
    group: "entry.2070572231",  // ID поля Класс
    score: "entry.1852517913",  // ID поля Баллы
    grade: "entry.1463755207"   // ID поля Оценка
};

let studentName = "";
let studentClass = "";
let testElements = [];
let currentIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 100; // Проценты таймера

// Инициализация таблицы
function renderTable() {
    const tableContainer = document.getElementById('periodic-table');
    tableContainer.innerHTML = '';
    
    // Создаем пустую сетку 7x18
    for (let r = 1; r <= 7; r++) {
        for (let c = 1; c <= 18; c++) {
            const cell = document.createElement('div');
            const element = elementsData.find(e => e.row === r && e.col === c);
            
            if (element) {
                cell.className = 'cell';
                cell.textContent = element.symbol;
                cell.dataset.symbol = element.symbol;
                cell.addEventListener('click', () => handleCellClick(element.symbol));
            } else {
                cell.className = 'cell empty';
            }
            tableContainer.appendChild(cell);
        }
    }
}

// Старт игры
document.getElementById('start-btn').addEventListener('click', () => {
    studentName = document.getElementById('student-name').value.trim();
    studentClass = document.getElementById('student-class').value.trim();
    
    if (!studentName || !studentClass) {
        alert("Пожалуйста, заполните все поля терминала.");
        return;
    }
    
    document.getElementById('display-name').textContent = studentName;
    
    // Перемешиваем и берем ровно 21 элемент для тестирования
    testElements = [...elementsData].sort(() => 0.5 - Math.random()).slice(0, 21);
    
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    renderTable();
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
        timeLeft -= 1; // 100 шагов за 10 секунд (каждые 100мс по 1%)
        progressBar.style.width = `${timeLeft}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentIndex++;
            nextQuestion(); // Переход, если не успел
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

// Отправка через скрытую форму (CORS-bypass метод)
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
        document.getElementById('sync-status').textContent = "ДАННЫЕ УСПЕШНО СИНХРОНИЗИРОВАНЫ С СЕРВЕРОМ BLACK MESA.";
        document.getElementById('restart-btn').classList.remove('hidden');
    })
    .catch((error) => {
        document.getElementById('sync-status').textContent = "ОШИБКА СВЯЗИ. Передайте экран учителю.";
        document.getElementById('restart-btn').classList.remove('hidden');
        console.error(error);
    });
}
