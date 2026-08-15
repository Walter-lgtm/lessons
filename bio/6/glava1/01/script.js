// Конфигурация шлюза Google Form (Замените ID и entry-ID на ваши данные)
const GOOGLE_FORM_URL = "https://google.com";
const ENTRY_FIO = "entry.111111111";       // ID поля ФИО
const ENTRY_CLASS = "entry.222222222";     // ID поля Класс (сюда пишется и маркер штрафа)
const ENTRY_SCORE = "entry.333333333";     // ID поля Баллы
const ENTRY_MARK = "entry.444444444";      // ID поля Оценка

// Глобальное состояние сессии
let studentUID = "";
let penaltyPoints = 0;
let totalPointsPossible = 12; // По 1 баллу на задание

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    const authBtn = document.getElementById("auth-trigger");
    authBtn.addEventListener("click", executeBiometricAuth);
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

    // Создаем уникальный UID устройства
    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_auth_uid");

    // Проверка повторного перезапуска/авторизации (накопительный штраф)
    if (savedUID === studentUID) {
        penaltyPoints += 1;
        localStorage.setItem("bme_penalty", penaltyPoints);
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_auth_uid", studentUID);
        localStorage.setItem("bme_penalty", "0");
    }

    // Скрытие авторизации и запуск био-модуля
    document.getElementById("auth-block").style.display = "none";
    document.getElementById("biology-content").style.removeProperty("display");
    document.getElementById("biology-content").classList.remove("hidden-module");
}

// Подсчет результатов по 5-балльной шкале (Ботаника, 6 класс)
function calculateGrade(score) {
    const percentage = (score / totalPointsPossible) * 100;
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    return 2;
}

// Финальная синхронизация и бесшовная отправка FormData
function transmitDataToBlackMesa(studentAnswers) {
    const fio = document.getElementById("student-fio").value.trim();
    let classField = document.getElementById("student-class").value.trim();
    
    // Рассчитываем баллы с учетом штрафа Анти-брутфорса
    let rawScore = 0;
    studentAnswers.forEach(ans => { if(ans.isCorrect) rawScore++; });
    
    let finalScore = rawScore - penaltyPoints;
    if (finalScore < 0) finalScore = 0;
    
    const finalMark = calculateGrade(finalScore);

    // Добавляем маркер попытки в строку Класса для идентификации в таблице
    if (penaltyPoints > 0) {
        classField += ` [ПОВТОР: -${penaltyPoints}]`;
    }

    // Сборка FormData для скрытого fetch-запроса
    const formData = new FormData();
    formData.append(ENTRY_FIO, fio);
    formData.append(ENTRY_CLASS, classField);
    formData.append(ENTRY_SCORE, finalScore);
    formData.append(ENTRY_MARK, finalMark);

    // Отправка пакета на сервер Google
    fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors", // Блокировка CORS-ошибок в мобильных браузерах
        body: formData
    })
    .then(() => {
        displayFinalHUDReport(finalScore, finalMark);
    })
    .catch((error) => {
        console.error("Критический сбой синхронизации:", error);
        alert("ОШИБКА СВЯЗИ. Попробуйте отправить отчет заново.");
    });
}

// Вывод итогового экрана на мобильном устройстве
function displayFinalHUDReport(score, mark) {
    const contentBlock = document.getElementById("biology-container");
    contentBlock.innerHTML = `
        <div style="border: 2px solid #ff5500; padding: 20px; text-align: center; background: rgba(255,85,0,0.05);">
            <h2 style="color: #ff5500; margin-bottom: 15px; letter-spacing: 2px;">ТЕСТИРОВАНИЕ ЗАВЕРШЕНО</h2>
            <p style="margin-bottom: 10px;">ДАННЫЕ УСПЕШНО СИНХРОНИЗИРОВАНЫ С СЕРВЕРОМ</p>
            <div style="font-size: 1.2rem; margin: 15px 0;">НАБРАНО БАЛЛОВ: <span style="color: #ff5500; font-weight:bold;">${score} из ${totalPointsPossible}</span></div>
            <div style="font-size: 2rem; border: 1px solid #00ff66; display: inline-block; padding: 10px 30px; color: #00ff66;">ОЦЕНКА: ${mark}</div>
            <p style="font-size: 0.8rem; color: #888; margin-top: 20px;">Идентификатор сессии: ${studentUID}</p>
        </div>
    `;
}
