// Конфигурация шлюза Google Form (Замените ID и entry-ID на ваши данные)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfDneqzG6KvwnxZIbXoSANpS5lZWKgLn-pdJfZ1MipVXj84Wg/formResponse";
const ENTRY_FIO = "entry.610115539";       // ID поля ФИО
const ENTRY_CLASS = "entry.986731064";     // ID поля Класс (сюда пишется и маркер штрафа)
const ENTRY_SCORE = "entry.1516118205";     // ID поля Баллы
const ENTRY_MARK = "entry.1392002384";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 8; // По 1 баллу на каждое из 8 заданий

// Первичная инициализация компонентов
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

    if (fioInput.length < 5 || classInput.length < 2) {
        alertBox.textContent = "ОШИБКА: ДАННЫЕ ВВЕДЕНЫ НЕКОРРЕКТНО. ОПОРНЫЕ СИМВОЛЫ НЕ ОПОЗНАНЫ.";
        alertBox.style.display = "block";
        return;
    }

    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_p1_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_p1_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_p1_penalty", penaltyPoints);
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_p1_uid", studentUID);
        localStorage.setItem("bme_p1_penalty", "0");
        penaltyPoints = 0;
    }

    document.getElementById("auth-block").style.display = "none";
    const bioContent = document.getElementById("biology-content");
    bioContent.style.removeProperty("display");
    bioContent.classList.remove("hidden-module");
}

// Механика Задания 4: Сенсорное сопоставление пар (Тап слева -> Тап справа)
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
            target.dataset.userAnswer = selectedLeftT2.dataset.id;
            target.classList.add("matched");
            selectedLeftT2.classList.add("matched");
            selectedLeftT2.classList.remove("selected");
            selectedLeftT2 = null;
        });
    });
}

// Механика Задания 5: Мобильный Drag-and-Drop (Сортировка по контейнерам)
function initializeDragAndDrop() {
    const dragItems = document.querySelectorAll('#t5-drag-bank [draggable="true"]');
    const dropZones = [document.getElementById('t5-group1'), document.getElementById('t5-group2'), document.getElementById('t5-group3')];

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
            e.preventDefault(); // Разрешаем сброс в зону
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            const wordData = e.dataTransfer.getData('text/plain');
            const draggedNode = document.querySelector(`#t5-drag-bank [data-word="${wordData}"]`) || document.querySelector(`.task-card [data-word="${wordData}"]`);
            if (draggedNode) {
                // Визуальный перенос элемента внутрь контейнера
                zone.appendChild(draggedNode);
                draggedNode.style.margin = "2px";
                draggedNode.style.border = "1px solid rgba(0, 255, 102, 0.4)";
            }
        });
    });
}

// Механика Задания 6: Зачеркивание токенов кликом
function initializeWordStriking() {
    const wordBank = document.getElementById("task6-bank");
    if (!wordBank) return;

    wordBank.addEventListener("click", (e) => {
        const token = e.target.closest(".word-token");
        if (token) token.classList.toggle("struck");
    });

    const submitBtn = document.getElementById("submit-tasks");
    if (submitBtn) submitBtn.addEventListener("click", collectAndVerifyAnswers);
}
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Три встроенных inline-селектора
    const sel1 = document.getElementById("task1-sel1").value;
    const sel2 = document.getElementById("task1-sel2").value;
    const sel3 = document.getElementById("task1-sel3").value;
    answersReport.push({ isCorrect: sel1 === "хлоропластах" && sel2 === "солнечные лучи" && sel3 === "фотосинтеза" });

    // Задание 2: Радиокнопка (Продуцентов)
    const rad2 = document.querySelector('input[name="task2"]:checked');
    answersReport.push({ isCorrect: rad2 && rad2.value === "Продуцентов" });

    // Задание 3: Радиокнопка (Не передвигаются активно)
    const rad3 = document.querySelector('input[name="task3"]:checked');
    answersReport.push({ isCorrect: rad3 && rad3.value === "Хитиновая оболочка" }); // Коррекция по скриншоту: Сходство - Не передвигаются активно, но в коде проверяем точную строку: "Не передвигаются"

    // Корректировка проверки Задания 3 под переданный в HTML текст:
    const checkRad3 = document.querySelector('input[name="task3"]:checked');
    answersReport.push({ isCorrect: checkRad3 && checkRad3.value === "Не передвигаются" });

    // Задание 4: Сенсорное сопоставление (3 пары)
    const rightElements = document.querySelectorAll(".t2-right");
    let task4Correct = true;
    let totalMatchedCount = 0;
    rightElements.forEach(target => {
        const correctValue = target.getAttribute("data-correct");
        const userValue = target.dataset.userAnswer;
        if (userValue) totalMatchedCount++;
        if (userValue !== correctValue) task4Correct = false;
    });
    if (totalMatchedCount < 3) task4Correct = false;
    answersReport.push({ isCorrect: task4Correct });

    // Задание 5: Сверка массивов Drag-and-Drop по трем группам систем
    let task5Correct = true;
    const group1 = Array.from(document.querySelectorAll("#t5-group1 [data-word]")).map(el => el.dataset.word);
    const group2 = Array.from(document.querySelectorAll("#t5-group2 [data-word]")).map(el => el.dataset.word);
    const group3 = Array.from(document.querySelectorAll("#t5-group3 [data-word]")).map(el => el.dataset.word);

    const expectedG1 = ["улотрикс", "спирогира", "хламидомонада", "хлорелла"];
    const expectedG2 = ["папоротник", "хвощ", "кукушкин лён", "плаун"];
    const expectedG3 = ["лилии", "груша", "ольха", "ландыш"];

    if (group1.length !== expectedG1.length || !group1.every(v => expectedG1.includes(v))) task5Correct = false;
    if (group2.length !== expectedG2.length || !group2.every(v => expectedG2.includes(v))) task5Correct = false;
    if (group3.length !== expectedG3.length || !group3.every(v => expectedG3.includes(v))) task5Correct = false;
    answersReport.push({ isCorrect: task5Correct });

    // Задание 6: Зачеркнутые токены (лишние слова: ель, сосна, калина, земляника, спирогира, черника)
    const tokens = document.querySelectorAll("#task6-bank .word-token");
    let task6Correct = true;
    const extraWords = ["ель,", "сосна,", "калина,", "земляника,", "спирогира,", "черника,"];
    tokens.forEach(token => {
        const word = token.getAttribute("data-word");
        const isStruck = token.classList.contains("struck");
        const isExtra = extraWords.includes(word);
        if ((isExtra && !isStruck) || (!isExtra && isStruck)) task6Correct = false;
    });
    answersReport.push({ isCorrect: task6Correct });

    // Задание 7: Чекбоксы (Хлопчатник, Рожь, Пшеница, Картофель)
    const checked7 = Array.from(document.querySelectorAll('input[name="task7"]:checked')).map(el => el.value);
    const expected7 = ["Хлопчатник", "Рожь", "Пшеница", "Картофель"];
    const task7Correct = checked7.length === expected7.length && checked7.every(v => expected7.includes(v));
    answersReport.push({ isCorrect: task7Correct });

    // Задание 8: Чекбоксы (Яблоня, Баклажаны)
    const checked8 = Array.from(document.querySelectorAll('input[name="task8"]:checked')).map(el => el.value);
    const expected8 = ["Яблоня", "Баклажаны"];
    const task8Correct = checked8.length === expected8.length && checked8.every(v => expected8.includes(v));
    answersReport.push({ isCorrect: task8Correct });

    // Запуск процесса скрытой трансляции
    transmitDataToBlackMesa(answersReport);
}

// Расчет оценки по пятибалльной шкале (для 8 заданий)
function calculateGrade(score) {
    const percentage = (score / totalPointsPossible) * 100;
    if (percentage >= 90) return 5; // 8 баллов
    if (percentage >= 70) return 4; // 6-7 баллов
    if (percentage >= 50) return 3; // 4-5 баллов
    return 2;                       // Менее 4 баллов
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

// Отрисовка итогового отчета
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
