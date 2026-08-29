// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfwQhWzSjvRF1hfJcZ4xMuRrIRrHknpX8Nwiqblw3f0od4N8g/formResponse";
const ENTRY_FIO = "entry.712022518";       // ID поля ФИО
const ENTRY_CLASS = "entry.632766845";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.655399110";     // ID поля Баллы
const ENTRY_MARK = "entry.1051149994";      // ID поля Оценка

// Глобальное состояние сессии терминала 7 класса
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 6; // Всего 6 заданий в данном модуле

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
    
    // Запуск обработчиков интерактива
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

    // Генерация уникального Base64 идентификатора устройства для 7 класса (§1)
    studentUID = btoa(unescape(encodeURIComponent(fioInput + "_" + classInput)));
    const savedUID = localStorage.getItem("bme_7cl_p1_diversity_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_7cl_p1_diversity_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_7cl_p1_diversity_penalty", penaltyPoints);
        
        alertBox.textContent = "ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -" + penaltyPoints + " БАЛЛ.";
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_7cl_p1_diversity_uid", studentUID);
        localStorage.setItem("bme_7cl_p1_diversity_penalty", "0");
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

// Механика Задания 4: Кроссплатформенный Drag-and-Drop (Вставка токенов в текст)
function initializeDragAndDrop() {
    const dragItems = document.querySelectorAll('#t4-drag-bank [draggable="true"]');
    const dropZones = [document.getElementById('t4-drop1'), document.getElementById('t4-drop2'), document.getElementById('t4-drop3')];

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
            // Предотвращаем накопление нескольких элементов в одной ячейке текста
            if (zone.children.length > 0) return;

            const wordData = e.dataTransfer.getData('text/plain');
            const draggedNode = document.querySelector('#t4-drag-bank [data-word="' + wordData + '"]');
            if (draggedNode) {
                zone.appendChild(draggedNode);
                draggedNode.style.margin = "0";
                draggedNode.style.border = "none";
                draggedNode.style.display = "inline-block";
                draggedNode.style.padding = "2px 6px";
            }
        });
    });
}

// Механика Задания 5: Сенсорное сопоставление пар (Тап слева -> Тап справа)
function initMatchMechanic() {
    let selectedLeftT5 = null;
    const leftItemsT5 = document.querySelectorAll(".t5-left");
    const rightTargetsT5 = document.querySelectorAll(".t5-right");

    leftItemsT5.forEach(function(item) {
        item.addEventListener("click", function() {
            if (item.classList.contains("matched")) return;
            leftItemsT5.forEach(function(i) { i.classList.remove("selected"); });
            selectedLeftT5 = item;
            item.classList.add("selected");
        });
    });

    rightTargetsT5.forEach(function(target) {
        target.addEventListener("click", function() {
            if (target.classList.contains("matched") || !selectedLeftT5) return;
            
            // Фиксируем ID выбранного таксона в дата-атрибут ответа
            target.dataset.userAnswer = selectedLeftT5.dataset.id;
            
            // Визуально скрепляем элементы
            target.classList.add("matched");
            selectedLeftT5.classList.add("matched");
            selectedLeftT5.classList.remove("selected");
            
            selectedLeftT5 = null;
        });
    });
}
// Функция сбора, верификации ответов и сверки с матрицей §1
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Выпадающий список (Систематика)
    const sel1 = document.getElementById("task1-sel").value;
    answersReport.push({ isCorrect: sel1 === "Систематика" });

    // Задание 2: Текстовый ввод (Ботаника)
    const t2 = document.getElementById("task2-ans").value.trim().toLowerCase();
    answersReport.push({ isCorrect: t2.startsWith("ботаник") });

    // Задание 3: Текстовый ввод по опорным буквам (10 полей)
    const t3_1 = document.getElementById("task3-in1").value.trim().toLowerCase();
    const t3_2 = document.getElementById("task3-in2").value.trim().toLowerCase();
    const t3_3 = document.getElementById("task3-in3").value.trim().toLowerCase();
    const t3_4 = document.getElementById("task3-in4").value.trim().toLowerCase();
    const t3_5 = document.getElementById("task3-in5").value.trim().toLowerCase();
    const t3_6 = document.getElementById("task3-in6").value.trim().toLowerCase();
    const t3_7 = document.getElementById("task3-in7").value.trim().toLowerCase();
    const t3_8 = document.getElementById("task3-in8").value.trim().toLowerCase();
    const t3_9 = document.getElementById("task3-in9").value.trim().toLowerCase();
    const t3_10 = document.getElementById("task3-in10").value.trim().toLowerCase();
    
    const t3Correct = t3_1.startsWith("вид") && t3_2.startsWith("род") && t3_3.startsWith("семейств") && 
                      t3_4.startsWith("отряд") && t3_5.startsWith("класс") && t3_6.startsWith("тип") && 
                      t3_7.startsWith("царств") && t3_8.startsWith("систематическ") && 
                      t3_9.startsWith("групп") && t3_10.startsWith("категори");
    answersReport.push({ isCorrect: t3Correct });

    // Задание 4: Drag-and-Drop (Проверка вложенных токенов)
    const d1 = document.querySelector("#t4-drop1 [data-word]");
    const d2 = document.querySelector("#t4-drop2 [data-word]");
    const d3 = document.querySelector("#t4-drop3 [data-word]");
    const t4Correct = d1 && d1.dataset.word === "Ботаника" && 
                      d2 && d2.dataset.word === "Ткань" && 
                      d3 && d3.dataset.word === "Орган";
    answersReport.push({ isCorrect: t4Correct });

    // Задание 5: Сенсорное сопоставление пар
    const rightItemsT5 = document.querySelectorAll(".t5-right");
    let t5Correct = true;
    rightItemsT5.forEach(function(target) {
        if (!target.dataset.userAnswer || target.dataset.userAnswer !== target.dataset.correct) {
            t5Correct = false;
        }
    });
    answersReport.push({ isCorrect: t5Correct });

    // Задание 6: Радиокнопка (Линней)
    const rad6 = document.querySelector('input[name="task6"]:checked');
    answersReport.push({ isCorrect: rad6 && rad6.value === "Линней" });

    // Запуск трансляции пакета
    transmitDataToLambda(answersReport);
}

// Подсчет результатов по 5-балльной шкале (для 6 заданий)
function calculateGrade(score) {
    const percentage = (score / totalPointsPossible) * 100;
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    return 2;
}

// Бесшовная отправка FormData на шлюз Google Form
function transmitDataToLambda(studentAnswers) {
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
