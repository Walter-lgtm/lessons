// Конфигурация шлюза Google Form (Замените ID и entry-ID на ваши данные)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeixH3rHZqNQ2LOQQUIb4femOspWr6wIkjl1UUGSKsvJyNaXg/formResponse";
const ENTRY_FIO = "entry.640137960";       // ID поля ФИО
const ENTRY_CLASS = "entry.1967238076";     // ID поля Класс (сюда пишется и маркер штрафа)
const ENTRY_SCORE = "entry.920164469";     // ID поля Баллы
const ENTRY_MARK = "entry.1875008469";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 12; // По 1 баллу на каждое из 12 заданий

// Инициализация интерфейса при первичной загрузке
document.addEventListener("DOMContentLoaded", () => {
    const authBtn = document.getElementById("auth-trigger");
    authBtn.addEventListener("click", executeBiometricAuth);

    // Запуск обработчика интерактивного зачеркивания слов (Задание 4)
    initializeWordStriking();
    // Инициализация новой сенсорной механики сопоставления
    initMatchMechanic();
});

function initMatchMechanic() {
    let selectedLeftT2 = null;
    const leftItemsT2 = document.querySelectorAll(".t2-left");
    const rightTargetsT2 = document.querySelectorAll(".t2-right");

    leftItemsT2.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return;
            // Снимаем выделение с других левых элементов
            leftItemsT2.forEach(i => i.classList.remove("selected"));
            selectedLeftT2 = item;
            item.classList.add("selected");
        });
    });

    rightTargetsT2.forEach(target => {
        target.addEventListener("click", () => {
            if (target.classList.contains("matched") || !selectedLeftT2) return;
            
            // Записываем ID выбранной науки в дата-атрибут ответа
            target.dataset.userAnswer = selectedLeftT2.dataset.id;
            
            // Визуально блокируем элементы
            target.classList.add("matched");
            selectedLeftT2.classList.add("matched");
            selectedLeftT2.classList.remove("selected");
            
            // Сбрасываем указатель
            selectedLeftT2 = null;
        });
    });
}
// Протокол Авторизации и Защиты "Анти-брутфорс v2.0"
function executeBiometricAuth() {
    const fioInput = document.getElementById("student-fio").value.trim();
    const classInput = document.getElementById("student-class").value.trim();
    const alertBox = document.getElementById("auth-alert");

    // Защита от пустых кликов и некорректного ввода
    if (fioInput.length < 5 || classInput.length < 2) {
        alertBox.textContent = "ОШИБКА: ДАННЫЕ ВВЕДЕНЫ НЕКОРРЕКТНО. ОПОРНЫЕ СИМВОЛЫ НЕ ОПОЗНАНЫ.";
        alertBox.style.display = "block";
        return;
    }

    // Генерация уникального Base64 UID устройства
    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_auth_uid");

    // Проверка повторного перезапуска/авторизации на одном устройстве
    if (savedUID === studentUID) {
        // Считываем старый штраф и инкрементируем его
        let currentPenalty = parseInt(localStorage.getItem("bme_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_penalty", penaltyPoints);
        
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        // Чистая сессия — сохраняем новые данные в localStorage устройства
        localStorage.setItem("bme_auth_uid", studentUID);
        localStorage.setItem("bme_penalty", "0");
        penaltyPoints = 0;
    }

    // Перевод интерфейса в рабочий режим: скрытие авторизации и открытие задач
    document.getElementById("auth-block").style.display = "none";
    
    const bioContent = document.getElementById("biology-content");
    bioContent.style.removeProperty("display");
    bioContent.classList.remove("hidden-module");
}
// Интерактивная механика Задания 4 (Зачеркивание лишних слов)
function initializeWordStriking() {
    const wordBank = document.getElementById("task4-bank");
    if (!wordBank) return;

    // Делегирование событий клика для стабильной работы на смартфонах
    wordBank.addEventListener("click", (event) => {
        const token = event.target.closest(".word-token");
        if (token) {
            // Переключаем класс struck (определен в style.css)
            token.classList.toggle("struck");
        }
    });

    // Навешиваем слушатель на финальную кнопку отправки всей лабораторной работы
    const submitBtn = document.getElementById("submit-tasks");
    if (submitBtn) {
        submitBtn.addEventListener("click", collectAndVerifyAnswers);
    }
}
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Выпадающий список (селектор)
    const ans1 = document.getElementById("task1-ans").value;
    answersReport.push({ isCorrect: ans1 === "ботаника" });

    // Задание 2: Одиночный выбор (радиокнопки)
    const rad2 = document.querySelector('input[name="task2"]:checked');
    answersReport.push({ isCorrect: rad2 && rad2.value === "Ботаника" });

    // Задание 3: Выпадающий список прямо в тексте
    const ans3 = document.getElementById("task3-ans").value;
    answersReport.push({ isCorrect: ans3 === "ботаника" });

    // Задание 4: Зачеркнутые слова (лишние: шампиньон, иволга, косуля, тушканчик)
    const tokens = document.querySelectorAll("#task4-bank .word-token");
    let task4Correct = true;
    tokens.forEach(token => {
        const word = token.getAttribute("data-word");
        const isStruck = token.classList.contains("struck");
        const isExtra = ["шампиньон", "иволга", "косуля", "тушканчик"].includes(word);
        // Если лишнее слово не зачеркнуто ИЛИ нужное слово зачеркнуто — ответ неверный
        if ((isExtra && !isStruck) || (!isExtra && isStruck)) {
            task4Correct = false;
        }
    });
    answersReport.push({ isCorrect: task4Correct });

    // Задание 5: Проверка сенсорного сопоставления пар (все 7 пар должны совпасть)
    const rightElements = document.querySelectorAll(".t2-right");
    let task5Correct = true;
    let totalMatchedCount = 0;

    rightElements.forEach(target => {
        const correctValue = target.getAttribute("data-correct");
        const userValue = target.dataset.userAnswer;
        
        if (userValue) {
            totalMatchedCount++;
        }
        if (userValue !== correctValue) {
            task5Correct = false;
        }
    });

    // Если сопоставлены не все 7 пар, задание не засчитывается
    if (totalMatchedCount < 7) {
        task5Correct = false;
    }
    answersReport.push({ isCorrect: task5Correct });

    // Задание 6: Множественный выбор (НЕ объекты ботаники: Слон, Крокодил, Сыроежка, Майский жук)
    const checked6 = Array.from(document.querySelectorAll('input[name="task6"]:checked')).map(el => el.value);
    const expected6 = ["Слон", "Крокодил", "Сыроежка", "Майский жук"];
    const task6Correct = checked6.length === expected6.length && checked6.every(v => expected6.includes(v));
    answersReport.push({ isCorrect: task6Correct });

    // Задание 7: Одиночный выбор (радиокнопки)
    const rad7 = document.querySelector('input[name="task7"]:checked');
    answersReport.push({ isCorrect: rad7 && rad7.value === "Карликовая берёза" });

    // Задание 8: Одиночный выбор (радиокнопки)
    const rad8 = document.querySelector('input[name="task8"]:checked');
    answersReport.push({ isCorrect: rad8 && rad8.value === "Антропогенного" });

    // Задание 9: Одиночный выбор (радиокнопки)
    const rad9 = document.querySelector('input[name="task9"]:checked');
    answersReport.push({ isCorrect: rad9 && rad9.value === "Фотосинтез" });

    // Задание 10: Одиночный выбор (радиокнопки)
    const rad10 = document.querySelector('input[name="task10"]:checked');
    answersReport.push({ isCorrect: rad10 && rad10.value === "Ботаника" });

    // Задание 11: Одиночный выбор (радиокнопки)
    const rad11 = document.querySelector('input[name="task11"]:checked');
    answersReport.push({ isCorrect: rad11 && rad11.value === "Растения" });

    // Задание 12: Одиночный выбор (радиокнопки)
    const rad12 = document.querySelector('input[name="task12"]:checked');
    answersReport.push({ isCorrect: rad12 && rad12.value === "создают органические вещества из неорганических" });

    // Передаем сформированный массив на модуль финальной синхронизации
    transmitDataToBlackMesa(answersReport);
}
// Подсчет результатов по строгой 5-балльной шкале (Ботаника, 6 класс)
function calculateGrade(score) {
    const percentage = (score / totalPointsPossible) * 100;
    if (percentage >= 90) return 5; // 11-12 баллов
    if (percentage >= 70) return 4; // 9-10 баллов
    if (percentage >= 50) return 3; // 6-8 баллов
    return 2;                       // Менее 6 баллов
}

// Финальная синхронизация и бесшовная трансляция FormData в Google Форму
function transmitDataToBlackMesa(studentAnswers) {
    const fio = document.getElementById("student-fio").value.trim();
    let classField = document.getElementById("student-class").value.trim();
    
    // Рассчитываем итоговые баллы
    let rawScore = 0;
    studentAnswers.forEach(ans => { 
        if (ans.isCorrect) rawScore++; 
    });
    
    // Применяем накопительный штраф системы защиты
    let finalScore = rawScore - penaltyPoints;
    if (finalScore < 0) finalScore = 0;
    
    // Вычисляем итоговую оценку по пятибалльной шкале
    const finalMark = calculateGrade(finalScore);

    // Внедряем скрытый маркер попытки в строку Класса для Google Таблицы
    if (penaltyPoints > 0) {
        classField += ` [ПОВТОР: -${penaltyPoints}]`;
    }

    // Сборка защищенного пакета FormData для передачи
    const formData = new FormData();
    formData.append(ENTRY_FIO, fio);
    formData.append(ENTRY_CLASS, classField);
    formData.append(ENTRY_SCORE, finalScore);
    formData.append(ENTRY_MARK, finalMark);

    // Изменение состояния кнопки на время отправки (защита от мульти-кликов)
    const submitBtn = document.getElementById("submit-tasks");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "СИНХРОНИЗАЦИЯ ПАКЕТА...";
        submitBtn.style.background = "#b33c00";
    }

    // Скрытый асинхронный POST-запрос на шлюз Google Form
    fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors", // Предотвращает сбои CORS на смартфонах учеников
        body: formData
    })
    .then(() => {
        // Успешная передача данных -> Перерисовка HUD в режим отчета
        displayFinalHUDReport(finalScore, finalMark);
    })
    .catch((error) => {
        console.error("Критический сбой синхронизации:", error);
        alert("КРИТИЧЕСКИЙ СБОЙ СВЯЗИ. Отчет не отправлен. Попробуйте еще раз.");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Синхронизировать отчет";
            submitBtn.style.background = "#ff5500";
        }
    });
}

// Вывод итогового экрана на мобильном устройстве (полная блокировка заданий)
function displayFinalHUDReport(score, mark) {
    const mainContent = document.getElementById("biology-content");
    mainContent.innerHTML = `
        <div style="border: 2px solid #ff5500; padding: 25px 15px; text-align: center; background: rgba(255,85,0,0.05); margin-top: 10px;">
            <h2 style="color: #ff5500; margin-bottom: 15px; letter-spacing: 2px; font-size: 1.3rem;">ТЕСТИРОВАНИЕ ЗАВЕРШЕНО</h2>
            <p style="margin-bottom: 15px; font-size: 0.95rem; color: #00ff66;">ДАННЫЕ БИО-МОДУЛЯ УСПЕШНО СИНХРОНИЗИРОВАНЫ С СЕРВЕРОМ ВОСТОЧНОЙ ЧЕРНОЙ МЕЗЫ</p>
            <div style="font-size: 1.1rem; margin: 20px 0; border-top: 1px dashed rgba(0,255,102,0.3); border-bottom: 1px dashed rgba(0,255,102,0.3); padding: 10px 0;">
                НАБРАНО БАЛЛОВ: <span style="color: #ff5500; font-weight: bold;">${score} из ${totalPointsPossible}</span>
                ${penaltyPoints > 0 ? `<br><span style="color: #ff5500; font-size: 0.8rem;">(Применен штраф за перезапуск: -${penaltyPoints})</span>` : ""}
            </div>
            <div style="font-size: 2.2rem; border: 2px solid #00ff66; display: inline-block; padding: 10px 40px; color: #000; background: #00ff66; font-weight: bold; box-shadow: 0 0 15px #00ff66;">
                ОЦЕНКА: ${mark}
            </div>
            <p style="font-size: 0.75rem; color: #666; margin-top: 25px; word-break: break-all;">Идентификатор сессии устройства:<br>${studentUID}</p>
        </div>
    `;
    
    // Плавный скролл экрана смартфона к началу отчета
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
