// ==================== НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ====================
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScwmK7HaknWp9kMUiT58fKskwpbFHM9K3bBsIyjqifNi5plPQ/formResponse"; 

const ENTRY_IDS = {
    name: "entry.1807934981",   
    class: "entry.151400541",  
    score: "entry.2094081297",  
    grade: "entry.263224971"   
};
// =======================================================================

// База данных для ВСЕХ типов клеток (заготовки на будущее)
const cellDatabases = {
    rast: [
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
    ],
    jiv: [
        // Сюда мы добавим органеллы животной клетки на следующем шаге
        { id: "core", name: "Ядро (Животная)", x: 50, y: 50 } 
    ],
    grib: [
        // Сюда добавим органеллы грибной клетки
        { id: "wall", name: "Клеточная стенка (Грибы)", x: 50, y: 50 }
    ]
};

let currentCellType = "rast";
let currentScore = 0;
let totalOrganelles = 0;
let draggedElement = null;

// Переменные для умного тача
let touchStartX = 0;
let touchStartY = 0;
let isDraggingActive = false;

document.addEventListener("DOMContentLoaded", () => {
    initGame(currentCellType);
    setupFormSubmission();
    
    // Кнопка возврата в шапке сбрасывает текущий уровень
    document.getElementById("menu-btn").addEventListener("click", () => {
        if(confirm("Вернуться к выбору образцов? Текущий прогресс будет сброшен.")) {
            initGame(currentCellType);
        }
    });
});

// Функция переключения вкладок/клеток
function switchCell(type) {
    currentCellType = type;
    
    // Меняем активную кнопку в меню
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`[onclick="switchCell('${type}')"]`);
    if(activeBtn) activeBtn.classList.add("active");
    
    // Меняем саму картинку на экране
    const imgEl = document.getElementById("cell-image");
    imgEl.src = `kletka_${type}.png`;
    
    initGame(type);
}

function initGame(type) {
    const draggablesContainer = document.getElementById("draggables-container");
    const socketsContainer = document.getElementById("sockets-container");
    
    draggablesContainer.innerHTML = "";
    socketsContainer.innerHTML = "";
    currentScore = 0;
    
    const activeData = cellDatabases[type] || [];
    totalOrganelles = activeData.length;
    updateScoreDisplay();

    // Создаем плашки (перемешиваем)
    const shuffledData = [...activeData].sort(() => Math.random() - 0.5);
    shuffledData.forEach(item => {
        const block = document.createElement("div");
        block.classList.add("draggable-item");
        block.textContent = item.name;
        block.setAttribute("draggable", "true");
        block.dataset.id = item.id;

        // Десктоп
        block.addEventListener("dragstart", handleDragStart);
        block.addEventListener("dragend", handleDragEnd);

        // Умный Тач для смартфонов
        block.addEventListener("touchstart", handleTouchStart, { passive: true });
        block.addEventListener("touchmove", handleTouchMove, { passive: false });
        block.addEventListener("touchend", handleTouchEnd);

        draggablesContainer.appendChild(block);
    });

    // Создаем сокеты
    activeData.forEach(item => {
        const socket = document.createElement("div");
        socket.classList.add("cell-socket");
        socket.style.left = `${item.x}%`;
        socket.style.top = `${item.y}%`;
        socket.dataset.id = item.id;
        socket.textContent = "...";

        socket.addEventListener("dragover", e => e.preventDefault());
        socket.addEventListener("dragenter", () => socket.classList.add("highlight"));
        socket.addEventListener("dragleave", () => socket.classList.remove("highlight"));
        socket.addEventListener("drop", handleDrop);

        socketsContainer.appendChild(socket);
    });
}

// --- ДЕСКТОП ЛОГИКА ---
function handleDragStart() { draggedElement = this; this.style.opacity = "0.5"; }
function handleDragEnd() { this.style.opacity = "1"; }
function handleDrop(e) { e.preventDefault(); this.classList.remove("highlight"); checkMatch(draggedElement, this); }

// --- МОБИЛЬНАЯ УМНАЯ ЛОГИКА ---
function handleTouchStart(e) {
    draggedElement = this;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isDraggingActive = false; // Изначально считаем, что идет обычный скролл меню
}

function handleTouchMove(e) {
    if (!draggedElement) return;
    const touch = e.touches[0];
    
    // Вычисляем, куда движется палец
    const diffX = Math.abs(touch.clientX - touchStartX);
    const diffY = Math.abs(touch.clientY - touchStartY);

    // Если палец сдвинулся вбок (по оси X) больше чем на 10px — это запуск перетаскивания плашки
    if (!isDraggingActive && diffX > 10 && diffX > diffY) {
        isDraggingActive = true;
        draggedElement.style.position = 'fixed';
        draggedElement.style.zIndex = '1000';
        draggedElement.style.width = '140px';
    }

    // Если режим Drag-and-Drop активирован, двигаем плашку и блокируем скролл интерфейса
    if (isDraggingActive) {
        e.preventDefault(); 
        draggedElement.style.left = touch.pageX - draggedElement.offsetWidth / 2 + 'px';
        draggedElement.style.top = touch.pageY - draggedElement.offsetHeight / 2 + 'px';
    }
}

function handleTouchEnd(e) {
    if (!draggedElement) return;

    if (isDraggingActive) {
        draggedElement.style.display = 'none';
        const touch = e.changedTouches[0];
        const targetElem = document.elementFromPoint(touch.clientX, touch.clientY);
        draggedElement.style.display = 'block';

        // Сброс стилей
        draggedElement.style.position = 'static';
        draggedElement.style.zIndex = 'auto';
        draggedElement.style.width = 'auto';

        const socket = targetElem ? targetElem.closest('.cell-socket') : null;
        if (socket) {
            checkMatch(draggedElement, socket);
        }
    }
    draggedElement = null;
    isDraggingActive = false;
}

// --- ПРОВЕРКА ---
function checkMatch(item, socket) {
    if (item.dataset.id === socket.dataset.id && !socket.classList.contains("correct")) {
        socket.classList.add("correct");
        socket.style.borderStyle = "solid";
        socket.style.borderColor = "#f7941d";
        socket.style.background = "rgba(247, 148, 29, 0.2)";
        socket.style.color = "#f7941d";
        socket.textContent = item.textContent;
        
        item.remove();
        currentScore++;
        updateScoreDisplay();
        
        if (currentScore === totalOrganelles) {
            showResultWindow();
        }
    } else {
        socket.style.borderColor = "#ff0000";
        setTimeout(() => { if(!socket.classList.contains("correct")) socket.style.borderColor = ""; }, 500);
    }
}

function updateScoreDisplay() {
    document.getElementById("score").textContent = currentScore;
}

function calculateGrade(score) {
    // Динамическая шкала оценок в зависимости от количества органелл на карте
    const percent = (score / totalOrganelles) * 100;
    if (percent >= 90) return "5 (ОТЛИЧНО)";
    if (percent >= 70) return "4 (ХОРОШО)";
    if (percent >= 50) return "3 (УДОВЛЕТВОРИТЕЛЬНО)";
    return "2 (ТРЕБУЕТСЯ ПОВТОРЕНИЕ)";
}

function showResultWindow() {
    document.getElementById("modal-score").textContent = currentScore;
    document.getElementById("modal-total").textContent = totalOrganelles;
    document.getElementById("modal-grade").textContent = calculateGrade(currentScore);
    document.getElementById("google-form").action = GOOGLE_FORM_URL;
    document.getElementById("result-modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("result-modal").classList.add("hidden");
    initGame(currentCellType); // Перезапускаем текущую клетку для тренировки
}

function setupFormSubmission() {
    const form = document.getElementById("google-form");
    form.addEventListener("submit", () => {
        document.getElementById("entry-score").value = currentScore;
        document.getElementById("entry-grade").value = calculateGrade(currentScore);
        
        document.getElementById("student-name").name = ENTRY_IDS.name;
        document.getElementById("student-class").name = ENTRY_IDS.class;
        document.getElementById("entry-score").name = ENTRY_IDS.score;
        document.getElementById("entry-grade").name = ENTRY_IDS.grade;

        const btn = form.querySelector(".submit-btn");
        btn.textContent = "СИНХРОНИЗАЦИЯ С СЕРВЕРОМ...";
        btn.disabled = true;

        document.getElementById("hidden-iframe").onload = () => {
            btn.textContent = "ДАННЫЕ УСПЕШНО СОХРАНЕНЫ!";
            btn.style.borderColor = "#00ff00";
            btn.style.color = "#00ff00";
        };
    });
}
