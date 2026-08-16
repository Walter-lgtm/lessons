// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe1GAz8Yb6HKFBJ4-dhAcXylXEk-iXmHTEu9roB2XW2gAlDCA/fprnResponse";
const ENTRY_FIO = "entry.953902753";       // ID поля ФИО
const ENTRY_CLASS = "entry.997093366";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.1150902725";     // ID поля Баллы
const ENTRY_MARK = "entry.282116281";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 12; // По 1 баллу на каждое из 12 заданий

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
    
    // Запуск обработчиков интерактива
    initializeWordStriking();
    initMatchMechanic();
    initializeDragAndDrop();
});

// Протокол Авторизации и Защиты "Анти-брутфорс v2.0"
function executeBiometricAuth() {
    const fioInput = document.getElementById("student-fio").value.trim();
    const classInput = document.getElementById("student-class").value.trim();
    const alertBox = document.getElementById("auth-alert");

    // Блокировка пустых или некорректных отправлений
    if (fioInput.length < 5 || classInput.length < 2) {
        alertBox.textContent = "ОШИБКА: ДАННЫЕ ВВЕДЕНЫ НЕКОРРЕКТНО. ОПОРНЫЕ СИМВОЛЫ НЕ ОПОЗНАНЫ.";
        alertBox.style.display = "block";
        return;
    }

    // Генерация уникального Base64 идентификатора устройства для Параграфа 5
    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_p5_tissues_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_p5_tissues_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_p5_tissues_penalty", penaltyPoints);
        
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_p5_tissues_uid", studentUID);
        localStorage.setItem("bme_p5_tissues_penalty", "0");
        penaltyPoints = 0;
    }

    // Скрытие экрана авторизации и открытие доступа к био-комплексу
    document.getElementById("auth-block").style.display = "none";
    
    const bioContent = document.getElementById("biology-content");
    bioContent.style.removeProperty("display");
    bioContent.classList.remove("hidden-module");

    // Привязка обработчика к кнопке отправки отчета
    const submitBtn = document.getElementById("submit-tasks");
    if (submitBtn) {
        submitBtn.addEventListener("click", collectAndVerifyAnswers);
    }
}

// Механика Задания 1: Сенсорное сопоставление пар (Тап слева -> Тап справа)
function initMatchMechanic() {
    let selectedLeftT2 = null;
    const leftItemsT2 = document.querySelectorAll(".t2-left");
    const rightTargetsT2 = document.querySelectorAll(".t2-right");

    leftItemsT2.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return;
            leftItemsT2.forEach(i => i.classList.remove("selected"));
            selectedLeftT2 = item;
            item.classList.add("selected");
        });
    });

    rightTargetsT2.forEach(target => {
        target.addEventListener("click", () => {
            if (target.classList.contains("matched") || !selectedLeftT2) return;
            
            // Записываем ID выбранной ткани в дата-атрибут ответа
            target.dataset.userAnswer = selectedLeftT2.dataset.id;
            
            // Визуально фиксируем связанные элементы
            target.classList.add("matched");
            selectedLeftT2.classList.add("matched");
            selectedLeftT2.classList.remove("selected");
            
            selectedLeftT2 = null;
        });
    });
}

// Механика Задания 9: Кроссплатформенный Drag-and-Drop (Сортировка по контейнерам)
function initializeDragAndDrop() {
    const dragItems = document.querySelectorAll('#t9-drag-bank [draggable="true"]');
    const dropZones = [document.getElementById('t9-group1'), document.getElementById('t9-group2'), document.getElementById('t9-group3')];

    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.dataset.word);
            item.classList.add('selected');
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('selected');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            const wordData = e.dataTransfer.getData('text/plain');
            const draggedNode = document.querySelector(`#t9-drag-bank [data-word="${wordData}"]`);
            if (draggedNode) {
                zone.appendChild(draggedNode);
                draggedNode.style.margin = "2px";
                draggedNode.style.border = "1px solid rgba(0, 255, 102, 0.4)";
            }
        });
    });
}

// Механика Заданий 2 и 10: Зачеркивание токенов кликом
function initializeWordStriking() {
    const task2Bank = document.getElementById("task2-bank");
    if (task2Bank) {
        task2Bank.addEventListener("click", (e) => {
            const token = e.target.closest(".word-token");
            if (token) token.classList.toggle("struck");
        });
    }

    const task10Bank = document.getElementById("task10-bank");
    if (task10Bank) {
        task10Bank.addEventListener("click", (e) => {
            const token = e.target.closest(".word-token");
            if (token) token.classList.toggle("struck");
        });
    }
}
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Сенсорное сопоставление тканей и роли (5 пар)
    const rightElements = document.querySelectorAll(".t2-right");
    let task1Correct = true;
    let totalMatchedCount = 0;
    rightElements.forEach(target => {
        const correctValue = target.getAttribute("data-correct");
        const userValue = target.dataset.userAnswer;
        if (userValue) totalMatchedCount++;
        if (userValue !== correctValue) task1Correct = false;
    });
    if (totalMatchedCount < 5) task1Correct = false;
    answersReport.push({ isCorrect: task1Correct });

    // Задание 2: Зачеркнутые токены (лишние животные ткани: соединительные, мышечные, жировые)
    const tokens2 = document.querySelectorAll("#task2-bank .word-token");
    let task2Correct = true;
    tokens2.forEach(token => {
        const word = token.getAttribute("data-word").trim();
        const isStruck = token.classList.contains("struck");
        const isExtra = ["соединительные ,", "мышечные ,", "жировые ,"].includes(word);
        if ((isExtra && !isStruck) || (!isExtra && isStruck)) task2Correct = false;
    });
    answersReport.push({ isCorrect: task2Correct });

    // Задание 3: Выпадающий список (тканью)
    const sel3 = document.getElementById("task3-ans").value;
    answersReport.push({ isCorrect: sel3 === "тканью" });

    // Задание 4: Радиокнопка (Образовательной)
    const rad4 = document.querySelector('input[name="task4"]:checked');
    answersReport.push({ isCorrect: rad4 && rad4.value === "Образовательной" });

    // Задание 5: Радиокнопка (Конус нарастания)
    const rad5 = document.querySelector('input[name="task5"]:checked');
    answersReport.push({ isCorrect: rad5 && rad5.value === "Конус нарастания" });

    // Задание 6: Радиокнопка (Камбия)
    const rad6 = document.querySelector('input[name="task6"]:checked');
    answersReport.push({ isCorrect: rad6 && rad6.value === "Камбия" });

    // Задание 7: Текстовый ввод терминов по опорным буквам (простая, сложная)
    const t7_1 = document.getElementById("task7-in1").value.trim().toLowerCase();
    const t7_2 = document.getElementById("task7-in2").value.trim().toLowerCase();
    const t7Correct = (t7_1.startsWith("прост") && t7_2.startsWith("сложн"));
    answersReport.push({ isCorrect: t7Correct });

    // Задание 8: Радиокнопка (Основная)
    const rad8 = document.querySelector('input[name="task8"]:checked');
    answersReport.push({ isCorrect: rad8 && rad8.value === "Основная" });

    // Задание 9: Сверка массивов Drag-and-Drop по трем группам тканей
    let task9Correct = true;
    const group1 = Array.from(document.querySelectorAll("#t9-group1 [data-word]")).map(el => el.dataset.word);
    const group2 = Array.from(document.querySelectorAll("#t9-group2 [data-word]")).map(el => el.dataset.word);
    const group3 = Array.from(document.querySelectorAll("#t9-group3 [data-word]")).map(el => el.dataset.word);

    const expectedG1 = ["конус нарастания", "камбий"];
    const expectedG2 = ["запасающая", "фотосинтезирующая"];
    const expectedG3 = ["эпидермис", "волоски корня", "пробка"];

    if (group1.length !== expectedG1.length || !group1.every(v => expectedG1.includes(v))) task9Correct = false;
    if (group2.length !== expectedG2.length || !group2.every(v => expectedG2.includes(v))) task9Correct = false;
    if (group3.length !== expectedG3.length || !group3.every(v => expectedG3.includes(v))) task9Correct = false;
    answersReport.push({ isCorrect: task9Correct });

    // Задание 10: Зачеркнутые токены (лишние ткани, не являющиеся основными: покровную, механическую, проводящую)
    const tokens10 = document.querySelectorAll("#task10-bank .word-token");
    let task10Correct = true;
    tokens10.forEach(token => {
        const word = token.getAttribute("data-word").trim();
        const isStruck = token.classList.contains("struck");
        const isExtra = ["покровную ,", "механическую ,", "проводящую"].includes(word);
        if ((isExtra && !isStruck) || (!isExtra && isStruck)) task10Correct = false;
    });
    answersReport.push({ isCorrect: task10Correct });

    // Задание 11: Радиокнопка (Камбия)
    const rad11 = document.querySelector('input[name="task11"]:checked');
    answersReport.push({ isCorrect: rad11 && rad11.value === "Камбия" });

    // Задание 12: Радиокнопка (Грю)
    const rad12 = document.querySelector('input[name="task12"]:checked');
    answersReport.push({ isCorrect: rad12 && rad12.value === "Грю" });

    // Запуск процесса трансляции пакета данных
    transmitDataToBlackMesa(answersReport);
}

// Подсчет результатов по 5-балльной шкале (для 12 заданий растительных тканей)
function calculateGrade(score) {
    const percentage = (score / totalPointsPossible) * 100;
    if (percentage >= 90) return 5; // 11-12 баллов
    if (percentage >= 70) return 4; // 9-10 баллов
    if (percentage >= 50) return 3; // 6-8 баллов
    return 2;                       // Менее 6 баллов
}

// Бесшовная отправка FormData на шлюз Google Form
function transmitDataToBlackMesa(studentAnswers) {
    const fio = document.getElementById("student-fio").value.trim();
    let classField = document.getElementById("student-class").value.trim();
    
    let rawScore = 0;
    studentAnswers.forEach(ans => { if (ans.isCorrect) rawScore++; });
    
    let finalScore = rawScore - penaltyPoints;
    if (finalScore < 0) finalScore = 0;
    
    const finalMark = calculateGrade(finalScore);

    if (penaltyPoints > 0) {
        classField += ` [ПОВТОР: -${penaltyPoints}]`;
    }

    const formData = new FormData();
    formData.append(ENTRY_FIO, fio);
    formData.append(ENTRY_CLASS, classField);
    formData.append(ENTRY_SCORE, finalScore);
    formData.append(ENTRY_MARK, finalMark);

    const submitBtn = document.getElementById("submit-tasks");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "СИНХРОНИЗАЦИЯ ПАКЕТА...";
        submitBtn.style.background = "#b33c00";
    }

    fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    })
    .then(() => {
        displayFinalHUDReport(finalScore, finalMark);
    })
    .catch((error) => {
        console.error("Критический сбой синхронизации:", error);
        alert("ОШИБКА СВЯЗИ. Данные не переданы. Попробуйте еще раз.");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Синхронизировать отчет";
            submitBtn.style.background = "#ff5500";
        }
    });
}

// Отрисовка итогового отчета с жесткой привязкой к λ-CORE
function displayFinalHUDReport(score, mark) {
    const mainContent = document.getElementById("biology-content");
    mainContent.innerHTML = `
        <div style="border: 2px solid #ff5500; padding: 25px 15px; text-align: center; background: rgba(255,85,0,0.05); margin-top: 10px;">
            <h2 style="color: #ff5500; margin-bottom: 15px; letter-spacing: 2px; font-size: 1.3rem;">ТЕСТИРОВАНИЕ ЗАВЕРШЕНО</h2>
            <p style="margin-bottom: 15px; font-size: 0.95rem; color: #00ff66;">ДАННЫЕ УСПЕШНО СИНХРОНИЗИРОВАНЫ С СЕРВЕРОМ λ-CORE</p>
            <div style="font-size: 1.1rem; margin: 20px 0; border-top: 1px dashed rgba(0,255,102,0.3); border-bottom: 1px dashed rgba(0,255,102,0.3); padding: 10px 0;">
                НАБРАНО БАЛЛОВ: <span style="color: #ff5500; font-weight: bold;">${score} из ${totalPointsPossible}</span>
                ${penaltyPoints > 0 ? `<br><span style="color: #ff5500; font-size: 0.8rem;">(Применен штраф Анти-брутфорса: -${penaltyPoints})</span>` : ""}
            </div>
            <div style="font-size: 2.2rem; border: 2px solid #00ff66; display: inline-block; padding: 10px 40px; color: #000; background: #00ff66; font-weight: bold; box-shadow: 0 0 15px #00ff66;">
                ОЦЕНКА: ${mark}
            </div>
            <p style="font-size: 0.75rem; color: #666; margin-top: 25px; word-break: break-all;">Идентификатор сессии устройства:<br>${studentUID}</p>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
