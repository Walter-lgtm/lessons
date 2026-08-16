// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe84LzzlPjgouuKqv4M61zKRW4FaXB7RwxPmbyr5ng03hZqLw/formResponse";
const ENTRY_FIO = "entry.297110394";       // ID поля ФИО
const ENTRY_CLASS = "entry.1078039353";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.2122899692";     // ID поля Баллы
const ENTRY_MARK = "entry.1253686606";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 18; // Масштабный комплекс на 18 заданий

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
    
    // Запуск обработчиков интерактива
    initializeWordStriking();
    initializeTripleDragAndDrop();
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

    // Генерация уникального Base64 идентификатора устройства для Параграфа 7
    studentUID = btoa(unescape(encodeURIComponent(fioInput + "_" + classInput)));
    const savedUID = localStorage.getItem("bme_p7_seeds_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_p7_seeds_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_p7_seeds_penalty", penaltyPoints);
        
        alertBox.textContent = "ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОР ПРОВЕРКИ. АКТИВИРОВАН ШТРАФ: -" + penaltyPoints + " БАЛЛ.";
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_p7_seeds_uid", studentUID);
        localStorage.setItem("bme_p7_seeds_penalty", "0");
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
// Управляющий модуль независимого распределения для Заданий 1, 2 и 3
function initializeTripleDragAndDrop() {
    const ids =;
    ids.forEach(function(id) {
        const dragItems = document.querySelectorAll("#t" + id + '-drag-bank [draggable="true"]');
        const dropZones = [document.getElementById("t" + id + "-group1"), document.getElementById("t" + id + "-group2")];

        dragItems.forEach(function(item) {
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', item.dataset.word);
                item.classList.add('selected');
            });
            item.addEventListener('dragend', function() {
                item.classList.remove('selected');
            });
        });

        dropZones.forEach(function(zone) {
            zone.addEventListener('dragover', function(e) {
                e.preventDefault();
            });
            zone.addEventListener('drop', function(e) {
                e.preventDefault();
                const wordData = e.dataTransfer.getData('text/plain');
                const draggedNode = document.querySelector("#t" + id + '-drag-bank [data-word="' + wordData + '"]');
                if (draggedNode) {
                    zone.appendChild(draggedNode);
                    draggedNode.style.margin = "2px";
                    draggedNode.style.border = "1px solid rgba(0, 255, 102, 0.4)";
                }
            });
        });
    });
}

// Механика Задания 8: Зачеркивание токенов кликом
function initializeWordStriking() {
    const task8Bank = document.getElementById("task8-bank");
    if (task8Bank) {
        task8Bank.addEventListener("click", function(e) {
            const token = e.target.closest(".word-token");
            if (token) token.classList.toggle("struck");
        });
    }
}
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Drag-and-Drop (Однодольные / Двудольные)
    const g1_1 = Array.from(document.querySelectorAll("#t1-group1 [data-word]")).map(function(el) { return el.dataset.word; });
    const g1_2 = Array.from(document.querySelectorAll("#t1-group2 [data-word]")).map(function(el) { return el.dataset.word; });
    const exp1_1 = ["лилия", "кукуруза", "пшеница", "рожь"];
    const exp1_2 = ["редис", "томаты", "свёкла", "яблоня"];
    answersReport.push({ isCorrect: g1_1.length === exp1_1.length && g1_1.every(function(v) { return exp1_1.includes(v); }) && g1_2.length === exp1_2.length && g1_2.every(function(v) { return exp1_2.includes(v); }) });

    // Задание 2: Drag-and-Drop (Однодольные / Двудольные)
    const g2_1 = Array.from(document.querySelectorAll("#t2-group1 [data-word]")).map(function(el) { return el.dataset.word; });
    const g2_2 = Array.from(document.querySelectorAll("#t2-group2 [data-word]")).map(function(el) { return el.dataset.word; });
    const exp2_1 = ["ландыш", "овёс", "ячмень", "чеснок"];
    const exp2_2 = ["морковь", "слива", "капуста", "подсолнечник"];
    answersReport.push({ isCorrect: g2_1.length === exp2_1.length && g2_1.every(function(v) { return exp2_1.includes(v); }) && g2_2.length === exp2_2.length && g2_2.every(function(v) { return exp2_2.includes(v); }) });

    // Задание 3: Drag-and-Drop (В эндосперме / В семядолях)
    const g3_1 = Array.from(document.querySelectorAll("#t3-group1 [data-word]")).map(function(el) { return el.dataset.word; });
    const g3_2 = Array.from(document.querySelectorAll("#t3-group2 [data-word]")).map(function(el) { return el.dataset.word; });
    const exp3_1 = ["ячмень", "лук", "рожь", "тигровая лилия", "кукуруза", "тюльпан"];
    const exp3_2 = ["сирень", "картофель", "фасоль", "вишня", "баклажан", "горох"];
    answersReport.push({ isCorrect: g3_1.length === exp3_1.length && g3_1.every(function(v) { return exp3_1.includes(v); }) && g3_2.length === exp3_2.length && g3_2.every(function(v) { return exp3_2.includes(v); }) });

    // Задание 4: Радиокнопка (2 - Лесной орех, грецкий орех, подсолнечник)
    const rad4 = document.querySelector('input[name="task4"]:checked');
    answersReport.push({ isCorrect: rad4 && rad4.value === "2" });

    // Задание 5: Радиокнопка (Генеративным)
    const rad5 = document.querySelector('input[name="task5"]:checked');
    answersReport.push({ isCorrect: rad5 && rad5.value === "Генеративным" });
    // Задание 6: Чекбоксы (Двудольные, Обоеполые)
    const checked6 = Array.from(document.querySelectorAll('input[name="task6"]:checked')).map(function(el) { return el.value; });
    const expected6 = ["Двудольные", "Обоеполые"];
    answersReport.push({ isCorrect: checked6.length === expected6.length && checked6.every(function(v) { return expected6.includes(v); }) });

    // Задание 7: Свободный текстовый ввод по опорным буквам (8 полей)
    const t7_1 = document.getElementById("task7-in1").value.trim().toLowerCase();
    const t7_2 = document.getElementById("task7-in2").value.trim().toLowerCase();
    const t7_3 = document.getElementById("task7-in3").value.trim().toLowerCase();
    const t7_4 = document.getElementById("task7-in4").value.trim().toLowerCase();
    const t7_5 = document.getElementById("task7-in5").value.trim().toLowerCase();
    const t7_6 = document.getElementById("task7-in6").value.trim().toLowerCase();
    const t7_7 = document.getElementById("task7-in7").value.trim().toLowerCase();
    const t7_8 = document.getElementById("task7-in8").value.trim().toLowerCase();
    const t7Correct = t7_1.startsWith("зародыш") && t7_2.startsWith("эндосперм") && t7_3.startsWith("зародыш") && 
                      t7_4.startsWith("кореш") && t7_5.startsWith("стебел") && t7_6.startsWith("почеч") && 
                      t7_7.startsWith("семядол") && t7_8.startsWith("семядол");
    answersReport.push({ isCorrect: t7Correct });

    // Задание 8: Зачеркнутые токены
    const tokens8 = document.querySelectorAll("#task8-bank .word-token");
    let task8Correct = true;
    tokens8.forEach(function(token) {
        const word = token.getAttribute("data-word").trim();
        const isStruck = token.classList.contains("struck");
        const isExtra = ["пшеницы ,", "тюльпана ,", "овса и", "горох ,", "капусту ,", "яблоню ,", "томаты ,", "огурец", "картофель."].includes(word);
        if ((isExtra && !isStruck) || (!isExtra && isStruck)) task8Correct = false;
    });
    answersReport.push({ isCorrect: task8Correct });

    // Задание 9: Радиокнопка (Пшеница)
    const rad9 = document.querySelector('input[name="task9"]:checked');
    answersReport.push({ isCorrect: rad9 && rad9.value === "Пшеница" });

    // Задание 10: Чекбоксы (НЕ однодольные: Свёкла, Морковь)
    const checked10 = Array.from(document.querySelectorAll('input[name="task10"]:checked')).map(function(el) { return el.value; });
    const expected10 = ["Свёкла", "Морковь"];
    answersReport.push({ isCorrect: checked10.length === expected10.length && checked10.every(function(v) { return expected10.includes(v); }) });

    // Задание 11: Чекбоксы (НЕ двудольные: Рожь, Ландыш)
    const checked11 = Array.from(document.querySelectorAll('input[name="task11"]:checked')).map(function(el) { return el.value; });
    const expected11 = ["Рожь", "Ландыш"];
    answersReport.push({ isCorrect: checked11.length === expected11.length && checked11.every(function(v) { return expected11.includes(v); }) });
    // Задание 12: Радиокнопка по sem.png (3)
    const rad12 = document.querySelector('input[name="task12"]:checked');
    answersReport.push({ isCorrect: rad12 && rad12.value === "3" });

    // Задание 13: Радиокнопка по sem.png (Однодольное)
    const rad13 = document.querySelector('input[name="task13"]:checked');
    answersReport.push({ isCorrect: rad13 && rad13.value === "Однодольное" });

    // Задание 14: Радиокнопка по seed_leaves.png (Семядоли)
    const rad14 = document.querySelector('input[name="task14"]:checked');
    answersReport.push({ isCorrect: rad14 && rad14.value === "Семядоли" });

    // Задание 15: Радиокнопка по seed_compare.png (Слева)
    const rad15 = document.querySelector('input[name="task15"]:checked');
    answersReport.push({ isCorrect: rad15 && rad15.value === "Слева" });

    // Задание 16: Радиокнопка по seed_compare.png (Количеством семядолей)
    const rad16 = document.querySelector('input[name="task16"]:checked');
    answersReport.push({ isCorrect: rad16 && rad16.value === "Количеством семядолей" });

    // Задание 17: Выпадающие селекторы (Зародыш, эндосперме, Семядоли, двудольными, однодольными)
    const sel1 = document.getElementById("task17-sel1").value;
    const sel2 = document.getElementById("task17-sel2").value;
    const sel3 = document.getElementById("task17-sel3").value;
    const sel4 = document.getElementById("task17-sel4").value;
    const sel5 = document.getElementById("task17-sel5").value;
    answersReport.push({ isCorrect: sel1 === "Зародыш" && sel2 === "эндосперме" && sel3 === "Семядоли" && sel4 === "двудольными" && sel5 === "однодольными" });

    // Задание 18: Радиокнопка по sem.png (6)
    const rad18 = document.querySelector('input[name="task18"]:checked');
    answersReport.push({ isCorrect: rad18 && rad18.value === "6" });

    // Запуск процесса трансляции пакета данных
    transmitDataToBlackMesa(answersReport);
}
// Подсчет результатов по 5-балльной шкале (для 18 заданий)
function calculateGrade(score) {
    const percentage = (score / totalPointsPossible) * 100;
    if (percentage >= 90) return 5; // 17-18 баллов
    if (percentage >= 70) return 4; // 13-16 баллов
    if (percentage >= 50) return 3; // 9-12 баллов
    return 2;                       // Менее 9 баллов
}

// Бесшовная отправка FormData на шлюз Google Form
function transmitDataToBlackMesa(studentAnswers) {
    const fio = document.getElementById("student-fio").value.trim();
    let classField = document.getElementById("student-class").value.trim();
    
    let rawScore = 0;
    studentAnswers.forEach(function(ans) { if (ans.isCorrect) rawScore++; });
    
    let finalScore = rawScore - penaltyPoints;
    if (finalScore < 0) finalScore = 0;
    
    const finalMark = calculateGrade(finalScore);

    if (penaltyPoints > 0) {
        classField += " [ПОВТОР: -" + penaltyPoints + "]";
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
    .then(function() {
        displayFinalHUDReport(finalScore, finalMark);
    })
    .catch(function(error) {
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
