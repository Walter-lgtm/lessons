// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeQiloLpv4E_a-2NVj_35DExdr5FbdFccm-kKY-XYZaIu3rlg/formResponse";
const ENTRY_FIO = "entry.37805431";       // ID поля ФИО
const ENTRY_CLASS = "entry.988562560";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.1536731049";     // ID поля Баллы
const ENTRY_MARK = "entry.1552587366";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 12; // По 1 баллу на каждое из 12 заданий

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
    
    // Запуск обработчиков интерактива
    initializeWordStriking();
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

    // Генерация уникального Base64 идентификатора устройства для Параграфа 6
    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_p6_organs_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_p6_organs_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_p6_organs_penalty", penaltyPoints);
        
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_p6_organs_uid", studentUID);
        localStorage.setItem("bme_p6_organs_penalty", "0");
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

// Механика Задания 1: Кроссплатформенный Drag-and-Drop (Сортировка органов)
function initializeDragAndDrop() {
    const dragItems = document.querySelectorAll('#t1-drag-bank [draggable="true"]');
    const dropZones = [document.getElementById('t1-group1'), document.getElementById('t1-group2')];

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
            const draggedNode = document.querySelector(`#t1-drag-bank [data-word="${wordData}"]`);
            if (draggedNode) {
                zone.appendChild(draggedNode);
                draggedNode.style.margin = "2px";
                draggedNode.style.border = "1px solid rgba(0, 255, 102, 0.4)";
            }
        });
    });
}

// Механика Задания 11: Зачеркивание токенов кликом
function initializeWordStriking() {
    const task11Bank = document.getElementById("task11-bank");
    if (task11Bank) {
        task11Bank.addEventListener("click", (e) => {
            const token = e.target.closest(".word-token");
            if (token) token.classList.toggle("struck");
        });
    }
}
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Сверка массивов Drag-and-Drop по ДВУМ группам органов
    let task1Correct = true;
    const group1 = Array.from(document.querySelectorAll("#t1-group1 [data-word]")).map(el => el.dataset.word);
    const group2 = Array.from(document.querySelectorAll("#t1-group2 [data-word]")).map(el => el.dataset.word);

    const expectedG1 = ["корень", "стебель", "лист", "почки"];
    const expectedG2 = ["цветок", "плод", "семена"];

    if (group1.length !== expectedG1.length || !group1.every(v => expectedG1.includes(v))) task1Correct = false;
    if (group2.length !== expectedG2.length || !group2.every(v => expectedG2.includes(v))) task1Correct = false;
    answersReport.push({ isCorrect: task1Correct });

    // Задание 2: Выпадающий список (Орган)
    const sel2 = document.getElementById("task2-ans").value;
    answersReport.push({ isCorrect: sel2 === "Орган" });

    // Задание 3: Радиокнопка (Размножение)
    const rad3 = document.querySelector('input[name="task3"]:checked');
    answersReport.push({ isCorrect: rad3 && rad3.value === "Размножение" });

    // Задание 4: Радиокнопка (Корень)
    const rad4 = document.querySelector('input[name="task4"]:checked');
    answersReport.push({ isCorrect: rad4 && rad4.value === "Корень" });

    // Задание 5: Радиокнопка (Корень)
    const rad5 = document.querySelector('input[name="task5"]:checked');
    answersReport.push({ isCorrect: rad5 && rad5.value === "Корень" });

    // Задание 6: Текстовый ввод (ткань, орган, организм)
    const t6_1 = document.getElementById("task6-in1").value.trim().toLowerCase();
    const t6_2 = document.getElementById("task6-in2").value.trim().toLowerCase();
    const t6_3 = document.getElementById("task6-in3").value.trim().toLowerCase();
    const t6Correct = (t6_1.startsWith("ткан") && t6_2.startsWith("орган") && t6_3.startsWith("организм"));
    answersReport.push({ isCorrect: t6Correct });

    // Задание 7: Радиокнопка (2 -> Клетка → ткань → орган → организм)
    const rad7 = document.querySelector('input[name="task7"]:checked');
    answersReport.push({ isCorrect: rad7 && rad7.value === "2" });

    // Задание 8: Текстовый ввод (цветок, тычинки, пестик, околоцветник, семя/семена)
    const t8_1 = document.getElementById("task8-in1").value.trim().toLowerCase();
    const t8_2 = document.getElementById("task8-in2").value.trim().toLowerCase();
    const t8_3 = document.getElementById("task8-in3").value.trim().toLowerCase();
    const t8_4 = document.getElementById("task8-in4").value.trim().toLowerCase();
    const t8_5 = document.getElementById("task8-in5").value.trim().toLowerCase();
    const t8Correct = (t8_1.startsWith("цветок") && t8_2.startsWith("тычин") && 
                        t8_3.startsWith("пестик") && t8_4.startsWith("околоцветн") && 
                        (t8_5.startsWith("сем") || t8_5.startsWith("плод")));
    answersReport.push({ isCorrect: t8Correct });

    // Задание 9: Чекбоксы покрытосеменных (Ольха, Яблоня, Васильки)
    const checked9 = Array.from(document.querySelectorAll('input[name="task9"]:checked')).map(el => el.value);
    const expected9 = ["Ольха", "Яблоня", "Васильки"];
    const task9Correct = checked9.length === expected9.length && checked9.every(v => expected9.includes(v));
    answersReport.push({ isCorrect: task9Correct });

    // Задание 10: Чекбоксы признаков цветкового по bio_flower.png (Цветок, Плод, Семена)
    const checked10 = Array.from(document.querySelectorAll('input[name="task10"]:checked')).map(el => el.value);
    const expected10 = ["Цветок", "Плод", "Семена"];
    const task10Correct = checked10.length === expected10.length && checked10.every(v => expected10.includes(v));
    answersReport.push({ isCorrect: task10Correct });

    // Задание 11: Зачеркнутые токены (лишние генеративные: цветки, плоды, семена)
    const tokens11 = document.querySelectorAll("#task11-bank .word-token");
    let task11Correct = true;
    tokens11.forEach(token => {
        const word = token.getAttribute("data-word").trim();
        const isStruck = token.classList.contains("struck");
        const isExtra = ["цветки ,", "плоды ,", "семена"].includes(word);
        if ((isExtra && !isStruck) || (!isExtra && isStruck)) task11Correct = false;
    });
    answersReport.push({ isCorrect: task11Correct });

    // Задание 12: Текстовый ввод (корнеплодами / корнеплод / корнеплоды)
    const t12_ans = document.getElementById("task12-ans").value.trim().toLowerCase();
    const task12Correct = t12_ans.startsWith("орнеплод"); // С учетом опорной "к" проверяем остаток слова
    answersReport.push({ isCorrect: task12Correct });

    // Запуск процесса трансляции пакета данных
    transmitDataToBlackMesa(answersReport);
}

// Подсчет результатов по 5-балльной шкале (для 12 заданий)
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
