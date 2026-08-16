// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScUM9sOfns4lY2-Y7KriWdyIat2yjXDK7nOOGRrFJUR2XlL8A/formResponse";
const ENTRY_FIO = "entry.2132893866";       // ID поля ФИО
const ENTRY_CLASS = "entry.2130643692";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.1827419648";     // ID поля Баллы
const ENTRY_MARK = "entry.1326298519";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 12; // По 1 баллу на каждое из 12 заданий

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
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

    // Генерация уникального Base64 идентификатора устройства для текущего параграфа
    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_p4_life_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_p4_life_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_p4_life_penalty", penaltyPoints);
        
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_p4_life_uid", studentUID);
        localStorage.setItem("bme_p4_life_penalty", "0");
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
// Функция сбора, верификации ответов и сверки с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Текстовый ввод терминов по опорным буквам (6 полей)
    const t1_1 = document.getElementById("task1-in1").value.trim().toLowerCase();
    const t1_2 = document.getElementById("task1-in2").value.trim().toLowerCase();
    const t1_3 = document.getElementById("task1-in3").value.trim().toLowerCase();
    const t1_4 = document.getElementById("task1-in4").value.trim().toLowerCase();
    const t1_5 = document.getElementById("task1-in5").value.trim().toLowerCase();
    const t1_6 = document.getElementById("task1-in6").value.trim().toLowerCase();
    
    const t1Correct = (t1_1.startsWith("цитоплазм") && t1_2.startsWith("органоид") && 
                        t1_3.startsWith("движен") && t1_4.startsWith("цитоплазм") && 
                        t1_5.startsWith("вод") && t1_6.startsWith("жизнедеятельн"));
    answersReport.push({ isCorrect: t1Correct });

    // Задание 2: Радиокнопка (В митохондриях)
    const rad2 = document.querySelector('input[name="task2"]:checked');
    answersReport.push({ isCorrect: rad2 && rad2.value === "В митохондриях" });

    // Задание 3: Радиокнопка (Жизненным циклом)
    const rad3 = document.querySelector('input[name="task3"]:checked');
    answersReport.push({ isCorrect: rad3 && rad3.value === "Жизненным циклом" });

    // Задание 4: Радиокнопка (Вирхов)
    const rad4 = document.querySelector('input[name="task4"]:checked');
    answersReport.push({ isCorrect: rad4 && rad4.value === "Вирхов" });

    // Задание 5: Выпадающий список (межклетники)
    const sel5 = document.getElementById("task5-sel").value;
    answersReport.push({ isCorrect: sel5 === "межклетники" });

    // Задание 6: Радиокнопка (Раздражимость)
    const rad6 = document.querySelector('input[name="task6"]:checked');
    answersReport.push({ isCorrect: rad6 && rad6.value === "Раздражимость" });

    // Задание 7: Графический тест cell.png (4)
    const rad7 = document.querySelector('input[name="task7"]:checked');
    answersReport.push({ isCorrect: rad7 && rad7.value === "4" });

    // Задание 8: Графический тест cell_01.png (3, 5, 1, 4, 2)
    const rad8 = document.querySelector('input[name="task8"]:checked');
    answersReport.push({ isCorrect: rad8 && rad8.value === "3, 5, 1, 4, 2" });

    // Задание 9: Графический тест dell.png (2, 1, 3, 5, 6, 4)
    const rad9 = document.querySelector('input[name="task9"]:checked');
    answersReport.push({ isCorrect: rad9 && rad9.value === "2, 1, 3, 5, 6, 4" });

    // Задание 10: Графический тест cell.png повтор (1)
    const rad10 = document.querySelector('input[name="task10"]:checked');
    answersReport.push({ isCorrect: rad10 && rad10.value === "1" });

    // Задание 11: Графический тест dell.png повтор (5)
    const rad11 = document.querySelector('input[name="task11"]:checked');
    answersReport.push({ isCorrect: rad11 && rad11.value === "5" });

    // Задание 12: Графический тест cell_02.png (Митохондрия)
    const rad12 = document.querySelector('input[name="task12"]:checked');
    answersReport.push({ isCorrect: rad12 && rad12.value === "Митохондрия" });

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
