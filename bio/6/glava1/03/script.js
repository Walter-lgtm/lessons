// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScvF5lHgCjU1ghAUtmmyCuHFppn9s89Q3oEKulj9oq-TBEzeg/formResponse";
const ENTRY_FIO = "entry.150937237";       // ID поля ФИО
const ENTRY_CLASS = "entry.1386813975";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.13751593";     // ID поля Баллы
const ENTRY_MARK = "entry.1631752509";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 12; // По 1 баллу на каждое из 12 заданий

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
    
    // Запуск мобильного обработчика сопоставления пар (Задание 1)
    initMatchMechanic();
});

// Протокол Авторизации и Защиты "Анти-брутфорс v2.0"
function executeBiometricAuth() {
    const fioInput = document.getElementById("student-fio").value.trim();
    const classInput = document.getElementById("student-class").value.trim();
    const alertBox = document.getElementById("auth-alert");

    // Блокировка пустых или некорректных отправлений
    if (fioInput.length < 5 || classInput.length < 2) {
        alertBox.textContent = "ОШИБКА: ДАННЫЕ ВВЕДЕНЫ НЕКОРРЕКТНО. СИМВОЛЫ НЕ ОПОЗНАНЫ.";
        alertBox.style.display = "block";
        return;
    }

    // Генерация уникального Base64 идентификатора устройства для Параграфа 2
    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_p2_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_p2_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_p2_penalty", penaltyPoints);
        
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_p2_uid", studentUID);
        localStorage.setItem("bme_p2_penalty", "0");
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
            
            // Записываем ID выбранного органоида в дата-атрибут ответа
            target.dataset.userAnswer = selectedLeftT2.dataset.id;
            
            // Визуально фиксируем связанные элементы
            target.classList.add("matched");
            selectedLeftT2.classList.add("matched");
            selectedLeftT2.classList.remove("selected");
            
            selectedLeftT2 = null;
        });
    });
}
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Сенсорное сопоставление органоидов (5 пар)
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

    // Задание 2: Радиокнопка (Ядро)
    const rad2 = document.querySelector('input[name="task2"]:checked');
    answersReport.push({ isCorrect: rad2 && rad2.value === "Ядро" });

    // Задание 3: Радиокнопка (Вакуоли)
    const rad3 = document.querySelector('input[name="task3"]:checked');
    answersReport.push({ isCorrect: rad3 && rad3.value === "Вакуоли" });

    // Задание 4: Радиокнопка (Хлоропласты)
    const rad4 = document.querySelector('input[name="task4"]:checked');
    answersReport.push({ isCorrect: rad4 && rad4.value === "Хлоропласты" });

    // Задание 5: Радиокнопка (Хромопластами)
    const rad5 = document.querySelector('input[name="task5"]:checked');
    answersReport.push({ isCorrect: rad5 && rad5.value === "Хромопластами" });

    // Задание 6: Радиокнопка (Ядра)
    const rad6 = document.querySelector('input[name="task6"]:checked');
    answersReport.push({ isCorrect: rad6 && rad6.value === "Ядра" });

    // Задание 7: Радиокнопка (Ядро)
    const rad7 = document.querySelector('input[name="task7"]:checked');
    answersReport.push({ isCorrect: rad7 && rad7.value === "Ядро" });

    // Задание 8: Радиокнопка (Пластид)
    const rad8 = document.querySelector('input[name="task8"]:checked');
    answersReport.push({ isCorrect: rad8 && rad8.value === "Пластид" });

    // Задание 9: Радиокнопка (Оболочка)
    const rad9 = document.querySelector('input[name="task9"]:checked');
    answersReport.push({ isCorrect: rad9 && rad9.value === "Оболочка" });

    // Задание 10: Радиокнопка (Наличие ядра)
    const rad10 = document.querySelector('input[name="task10"]:checked');
    answersReport.push({ isCorrect: rad10 && rad10.value === "Наличие ядра" });

    // Задание 11: Чекбоксы (Наличие пластид, Наличие клеточной стенки)
    const checked11 = Array.from(document.querySelectorAll('input[name="task11"]:checked')).map(el => el.value);
    const expected11 = ["Наличие пластид", "Наличие клеточной стенки"];
    const task11Correct = checked11.length === expected11.length && checked11.every(v => expected11.includes(v));
    answersReport.push({ isCorrect: task11Correct });

    // Задание 12: Три встроенных инлайн-селектора по тексту параграфа
    const sel1 = document.getElementById("task12-sel1").value;
    const sel2 = document.getElementById("task12-sel2").value;
    const sel3 = document.getElementById("task12-sel3").value;
    answersReport.push({ isCorrect: sel1 === "Пластиды" && sel2 === "лейкопластах" && sel3 === "хромопласты" });

    // Передача массива на модуль трансляции данных
    transmitDataToBlackMesa(answersReport);
}

// Подсчет результатов по 5-балльной шкале (для 12 заданий растительной клетки)
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

// Отрисовка итогового отчета с привязкой к λ-CORE
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
