// ==================== НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ====================
const GOOGLE_FORM_URL = "https://google.com"; 

// Замените эти entry.XXXXXX на реальные ID полей из вашей Google-формы
const ENTRY_IDS = {
    name: "entry.111111111",   // Поле для ФИО
    class: "entry.222222222",  // Поле для Класса
    score: "entry.333333333",  // Поле для Баллов
    grade: "entry.444444444"   // Поле для Оценки
};
// =======================================================================

// Данные сокетов для растительной клетки (координаты X и Y в % от центра картинки)
const organelleData = [
    { id: "wall", name: "Стенка клетки", x: 4.5, y: 16.5 },
    { id: "vacuol", name: "Центральная вакуоль", x: 5.0, y: 28.5 },
    { id: "mit", name: "Митохондрии", x: 4.5, y: 36.5 },
    { id: "goldji", name: "Аппарат Гольджи", x: 5.5, y: 43.5 },
    { id: "rib", name: "Рибосомы", x: 4.5, y: 51.5 },
    { id: "core", name: "Ядро", x: 4.5, y: 59.5 },
    { id: "core-min", name: "Ядрышко", x: 5.5, y: 66.5 },
    { id: "eps-smooth", name: "Гладкая ЭПС", x: 6.5, y: 76.5 },
    { id: "cyto", name: "Цитоплазма", x: 6.5, y: 84.5 },
    { id: "chloro", name: "Хлоропласты", x: 92.5, y: 17.5 },
    { id: "memb", name: "Плазматическая мембрана", x: 92.5, y: 28.5 },
    { id: "desma", name: "Плазмодесма", x: 92.5, y: 40.5 },
    { id: "lyso", name: "Лизосомы", x: 92.5, y: 47.5 },
    { id: "core-shell", name: "Оболочка ядра", x: 92.5, y: 59.5 },
    { id: "eps-gran", name: "Гранулярная ЭПС", x: 92.5, y: 70.5 }
];

let currentScore = 0;
const totalOrganelles = organelleData.length;
let draggedElement = null;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    initGame();
    setupFormSubmission();
});

function initGame() {
    const draggablesContainer = document.getElementById("draggables-container");
    const socketsContainer = document.getElementById("sockets-container");
    
    draggablesContainer.innerHTML = "";
    socketsContainer.innerHTML = "";
    currentScore = 0;
    updateScoreDisplay();

    // 1. Создаем плашки (перемешиваем их, чтобы не шли по порядку)
    const shuffledData = [...organelleData].sort(() => Math.random() - 0.5);
    shuffledData.forEach(item => {
        const block = document.createElement("div");
        block.classList.add("draggable-item");
        block.textContent = item.name;
        block.setAttribute("draggable", "true");
        block.dataset.id = item.id;

        // Десктопные события мыши
        block.addEventListener("dragstart", handleDragStart);
        block.addEventListener("dragend", handleDragEnd);

        // Мобильные события Touch (для смартфонов)
        block.addEventListener("touchstart", handleTouchStart, { passive: false });
        block.addEventListener("touchmove", handleTouchMove, { passive: false });
        block.addEventListener("touchend", handleTouchEnd);

        draggablesContainer.appendChild(block);
    });

    // 2. Создаем зоны-сокеты на картинке
    organelleData.forEach(item => {
        const socket = document.createElement("div");
        socket.classList.add("cell-socket");
        socket.style.left = `${item.x}%`;
        socket.style.top = `${item.y}%`;
        socket.dataset.id = item.id;
        socket.textContent = "..."; // Индикатор пустого гнезда

        // События для приема элементов (Десктоп)
        socket.addEventListener("dragover", e => e.preventDefault());
        socket.addEventListener("dragenter", () => socket.classList.add("highlight"));
        socket.addEventListener("dragleave", () => socket.classList.remove("highlight"));
        socket.addEventListener("drop", handleDrop);

        socketsContainer.appendChild(socket);
    });
}

// --- ЛОГИКА ДЛЯ ДЕСКТОПА (Drag and Drop) ---
function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = "0.5";
}

function handleDragEnd() {
    this.style.opacity = "1";
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("highlight");
    checkMatch(draggedElement, this);
}

// --- ЛОГИКА ДЛЯ СМАРТФОНОВ (Touch Events) ---
let touchStartNode = null;

function handleTouchStart(e) {
    draggedElement = this;
    touchStartNode = e.target;
    this.style.position = 'fixed';
    this.style.zIndex = '1000';
    moveAt(e.touches[0].pageX, e.touches[0].pageY);
}

function handleTouchMove(e) {
    e.preventDefault(); // Запрещаем скролл экрана при перетаскивании
    if (!draggedElement) return;
    moveAt(e.touches[0].pageX, e.touches[0].pageY);
}

function moveAt(pageX, pageY) {
    draggedElement.style.left = pageX - draggedElement.offsetWidth / 2 + 'px';
    draggedElement.style.top = pageY - draggedElement.offsetHeight / 2 + 'px';
}

function handleTouchEnd(e) {
    if (!draggedElement) return;

    // Сбрасываем стили фиксации, чтобы определить элемент под пальцем
    draggedElement.style.display = 'none';
    const changedTouch = e.changedTouches[0];
    const targetElem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
    draggedElement.style.display = 'block';

    // Возвращаем стили в исходное состояние
    draggedElement.style.position = 'static';
    draggedElement.style.zIndex = 'auto';
    draggedElement.style.left = 'auto';
    draggedElement.style.top = 'auto';

    const socket = targetElem ? targetElem.closest('.cell-socket') : null;
    
    if (socket) {
        checkMatch(draggedElement, socket);
    }
    draggedElement = null;
}

// --- ПРОВЕРКА СОВПАДЕНИЯ ---
function checkMatch(item, socket) {
    if (item.dataset.id === socket.dataset.id && !socket.classList.contains("correct")) {
        // Успешная стыковка в стиле Half-Life
        socket.classList.add("correct");
        socket.style.borderStyle = "solid";
        socket.style.borderColor = "#f7941d";
        socket.style.background = "rgba(247, 148, 29, 0.2)";
        socket.style.color = "#f7941d";
        socket.textContent = item.textContent;
        
        item.remove(); // Удаляем плашку из меню
        
        currentScore++;
        updateScoreDisplay();
        
        if (currentScore === totalOrganelles) {
            showResultWindow();
        }
    } else {
        // Эффект ошибки — вспышка рамки сокета (кратковременно)
        socket.style.borderColor = "#ff0000";
        setTimeout(() => { if(!socket.classList.contains("correct")) socket.style.borderColor = ""; }, 500);
    }
}

function updateScoreDisplay() {
    document.getElementById("score").textContent = currentScore;
}

// --- РАСЧЕТ ОЦЕНКИ И МОДАЛЬНОЕ ОКНО ---
function calculateGrade(score) {
    // Шкала оценок для 15 органелл:
    if (score >= 14) return "5 (ОТЛИЧНО)";
    if (score >= 11) return "4 (ХОРОШО)";
    if (score >= 8)  return "3 (УДОВЛЕТВОРИТЕЛЬНО)";
    return "2 (ТРЕБУЕТСЯ ПОВТОРЕНИЕ)";
}

function showResultWindow() {
    const modal = document.getElementById("result-modal");
    const modalScore = document.getElementById("modal-score");
    const modalGrade = document.getElementById("modal-grade");
    const form = document.getElementById("google-form");

    const finalGrade = calculateGrade(currentScore);

    modalScore.textContent = currentScore;
    modalGrade.textContent = finalGrade;
    
    // Подшиваем ссылку на форму в атрибуты
    form.action = GOOGLE_FORM_URL;

    // Показываем окно терминала
    modal.classList.remove("hidden");
}

// --- ОТПРАВКА ДАННЫХ В GOOGLE ТАБЛИЦУ ---
function setupFormSubmission() {
    const form = document.getElementById("google-form");
    
    form.addEventListener("submit", (e) => {
        // Подставляем значения в невидимые инпуты перед отправкой
        document.getElementById("entry-score").value = currentScore;
        document.getElementById("entry-grade").value = calculateGrade(currentScore);
        
        // Связываем видимые текстовые поля с именами полей Google-формы
        document.getElementById("student-name").name = ENTRY_IDS.name;
        document.getElementById("student-class").name = ENTRY_IDS.class;
        document.getElementById("entry-score").name = ENTRY_IDS.score;
        document.getElementById("entry-grade").name = ENTRY_IDS.grade;

        // Меняем текст кнопки, показывая ученику, что данные уходят
        const btn = form.querySelector(".submit-btn");
        btn.textContent = "СИНХРОНИЗАЦИЯ С СЕРВЕРОМ...";
        btn.disabled = true;

        // Ждем отправки во фрейм и выводим финальное уведомление
        document.getElementById("hidden-iframe").onload = () => {
            btn.textContent = "ДАННЫЕ УСПЕШНО СОХРАНЕНЫ!";
            btn.style.borderColor = "#00ff00";
            btn.style.color = "#00ff00";
        };
    });
}
