// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdysXpS-Yc8qv-oV5otstllhgd32Kco0Iz8NZBFVvs_-RCl0g/formResponse";
const ENTRY_FIO = "entry.1824804219";       // ID поля ФИО
const ENTRY_CLASS = "entry.1646856778";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.345494492";     // ID поля Баллы
const ENTRY_MARK = "entry.1418906527";      // ID поля Оценка

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

    // Генерация уникального Base64 идентификатора устройства для Параграфа 3
    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_p3_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_p3_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_p3_penalty", penaltyPoints);
        
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_p3_uid", studentUID);
        localStorage.setItem("bme_p3_penalty", "0");
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
            
            // Записываем ID выбранного вещества в дата-атрибут ответа
            target.dataset.userAnswer = selectedLeftT2.dataset.id;
            
            // Визуально фиксируем связанные элементы
            target.classList.add("matched");
            selectedLeftT2.classList.add("matched");
            selectedLeftT2.classList.remove("selected");
            
            selectedLeftT2 = null;
        });
    });
}

// Механика Задания 4: Зачеркивание токенов кликом
function initializeWordStriking() {
    const wordBank = document.getElementById("task4-bank");
    if (!wordBank) return;

    wordBank.addEventListener("click", (e) => {
        const token = e.target.closest(".word-token");
        if (token) token.classList.toggle("struck");
    });
}
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Сенсорное сопоставление (4 пары)
    const rightElements = document.querySelectorAll(".t2-right");
    let task1Correct = true;
    let totalMatchedCount = 0;
    rightElements.forEach(target => {
        const correctValue = target.getAttribute("data-correct");
        const userValue = target.dataset.userAnswer;
        if (userValue) totalMatchedCount++;
        if (userValue !== correctValue) task1Correct = false;
    });
    if (totalMatchedCount < 4) task1Correct = false;
    answersReport.push({ isCorrect: task1Correct });

    // Задание 2: Радиокнопка (Белки)
    const rad2 = document.querySelector('input[name="task2"]:checked');
    answersReport.push({ isCorrect: rad2 && rad2.value === "Белки" });

    // Задание 3: Радиокнопка (10–20)
    const rad3 = document.querySelector('input[name="task3"]:checked');
    answersReport.push({ isCorrect: rad3 && rad3.value === "10–20" });

    // Задание 4: Зачеркнутые токены (лишние неорганические: соли калия, угольную кислоту, воду, соли кальция, соли магния, углекислый газ)
    const tokens = document.querySelectorAll("#task4-bank .word-token");
    let task4Correct = true;
    const extraWords = ["soli kalia ,", "ugolnuu kislotu ,", "vodu ,", "soli kalcia ,", "soli magnia ,", "uglekisly gaz"]; 
    // Для надежности сверяем по data-word
    tokens.forEach(token => {
        const word = token.getAttribute("data-word").trim();
        const isStruck = token.classList.contains("struck");
        const isExtra = ["соли калия ,", "угольную кислоту ,", "воду ,", "соли кальция ,", "соли магния ,", "углекислый газ"].includes(word);
        if ((isExtra && !isStruck) || (!isExtra && isStruck)) task4Correct = false;
    });
    answersReport.push({ isCorrect: task4Correct });

    // Задание 5: Радиокнопка (Нуклеиновые кислоты)
    const rad5 = document.querySelector('input[name="task5"]:checked');
    answersReport.push({ isCorrect: rad5 && rad5.value === "Нуклеиновые кислоты" });

    // Задание 6: Радиокнопка (Углеводы)
    const rad6 = document.querySelector('input[name="task6"]:checked');
    answersReport.push({ isCorrect: rad6 && rad6.value === "Углеводы" });

    // Задание 7: Радиокнопка (Углерод)
    const rad7 = document.querySelector('input[name="task7"]:checked');
    answersReport.push({ isCorrect: rad7 && rad7.value === "Углерод" });

    // Задание 8: Радиокнопка (68%)
    const rad8 = document.querySelector('input[name="task8"]:checked');
    answersReport.push({ isCorrect: rad8 && rad8.value === "68%" });

    // Задание 9: Радиокнопка (В хромосомах)
    const rad9 = document.querySelector('input[name="task9"]:checked');
    answersReport.push({ isCorrect: rad9 && rad9.value === "В хромосомах" });

    // Задание 10: Текстовый ввод (минеральные, соли, белков, нуклеиновых, кислот)
    const t10_1 = document.getElementById("task10-in1").value.trim().toLowerCase();
    const t10_2 = document.getElementById("task10-in2").value.trim().toLowerCase();
    const t10_3 = document.getElementById("task10-in3").value.trim().toLowerCase();
    const t10_4 = document.getElementById("task10-in4").value.trim().toLowerCase();
    const t10_5 = document.getElementById("task10-in5").value.trim().toLowerCase();
    
    // Допускаем ввод корня или полного слова для надежности проверки на смартфонах
    const t10Correct = (t10_1.startsWith("минераль") && t10_2.startsWith("сол") && 
                        t10_3.startsWith("белк") && t10_4.startsWith("нуклеин") && t10_5.startsWith("кислот"));
    answersReport.push({ isCorrect: t10Correct });

    // Задание 11: Радиокнопка (Воды)
    const rad11 = document.querySelector('input[name="task11"]:checked');
    answersReport.push({ isCorrect: rad11 && rad11.value === "Воды" });

    // Задание 12: Текстовый ввод (углеводы, белки, жиров, нуклеиновые, кислоты)
    const t12_1 = document.getElementById("task12-in1").value.trim().toLowerCase();
    const t12_2 = document.getElementById("task12-in2").value.trim().toLowerCase();
    const t12_3 = document.getElementById("task12-in3").value.trim().toLowerCase();
    const t12_4 = document.getElementById("task12-in4").value.trim().toLowerCase();
    const t12_5 = document.getElementById("task12-in5").value.trim().toLowerCase();

    const t12Correct = (t12_1.startsWith("углевод") && t12_2.startsWith("белк") && 
                        t12_3.startsWith("жир") && t12_4.startsWith("нуклеин") && t12_5.startsWith("кислот"));
    answersReport.push({ isCorrect: t12Correct });

    // Запуск процесса трансляции пакета данных
    transmitDataToBlackMesa(answersReport);
}

// Подсчет результатов по 5-балльной шкале (для 12 заданий химического состава)
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
