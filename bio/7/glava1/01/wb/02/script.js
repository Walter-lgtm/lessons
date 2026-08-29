// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScUPel2B-79GKKi1EFR3F_0PS7s_isTff3sDXq4wR2I--z_CA/formResponse";
const ENTRY_FIO = "entry.1465139855";       // ID поля ФИО
const ENTRY_CLASS = "entry.1102272827";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.1738113280";     // ID поля Баллы
const ENTRY_MARK = "entry.1646269555";      // ID поля Оценка

// Глобальное состояние сессии терминала
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 10; // Всего 10 заданий в данном модуле

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
    
    // Запуск первой группы обработчиков интерактива
    initializeInlineDragAndDrop();
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

    // Генерация уникального Base64 идентификатора устройства для 7 класса (§2)
    studentUID = btoa(unescape(encodeURIComponent(fioInput + "_" + classInput)));
    const savedUID = localStorage.getItem("bme_7cl_p2_plants_sys_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_7cl_p2_plants_sys_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_7cl_p2_plants_sys_penalty", penaltyPoints);
        
        alertBox.textContent = "ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -" + penaltyPoints + " БАЛЛ.";
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_7cl_p2_plants_sys_uid", studentUID);
        localStorage.setItem("bme_7cl_p2_plants_sys_penalty", "0");
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

// Механика Заданий 1, 2 и 5: Кроссплатформенный инлайновый Drag-and-Drop
function initializeInlineDragAndDrop() {
    const dragItems = document.querySelectorAll('[draggable="true"]');
    const dropZones = document.querySelectorAll('.inline-drop-target');

    dragItems.forEach(function(item) {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', item.dataset.word);
            // Сохраняем ID банка, чтобы токен не улетел в чужую карточку
            e.dataTransfer.setData('source-bank', item.parentElement.id);
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
            if (zone.children.length > 0) return; // Одна ячейка — один токен

            const wordData = e.dataTransfer.getData('text/plain');
            const sourceBank = e.dataTransfer.getData('source-bank');
            
            // Защитная проверка совпадения контекста задания (t1, t2 или t5)
            const targetTaskId = zone.id.substring(0, 2);
            if (!sourceBank.startsWith(targetTaskId)) return;

            const draggedNode = document.querySelector('#' + sourceBank + ' [data-word="' + wordData + '"]');
            if (draggedNode) {
                zone.appendChild(draggedNode);
                draggedNode.style.margin = "0";
                draggedNode.style.border = "none";
                draggedNode.style.display = "inline-block";
                draggedNode.style.padding = "2px 6px";
                draggedNode.style.fontSize = "0.85rem";
            }
        });
    });
}
// Запуск второй группы обработчиков при инициализации (вызывается из DOMContentLoaded)
document.addEventListener("DOMContentLoaded", function() {
    initMatchMechanicT8();
    initializeOrderDragAndDrop();
});

// Механика Задания 8: Сенсорное сопоставление пар (Тап слева -> Тап справа)
function initMatchMechanicT8() {
    let selectedLeftT8 = null;
    const leftItemsT8 = document.querySelectorAll(".t8-left");
    const rightTargetsT8 = document.querySelectorAll(".t8-right");

    leftItemsT8.forEach(function(item) {
        item.addEventListener("click", function() {
            if (item.classList.contains("matched")) return;
            leftItemsT8.forEach(function(i) { i.classList.remove("selected"); });
            selectedLeftT8 = item;
            item.classList.add("selected");
        });
    });

    rightTargetsT8.forEach(function(target) {
        target.addEventListener("click", function() {
            if (target.classList.contains("matched") || !selectedLeftT8) return;
            
            // Фиксируем ID выбранного таксона в дата-атрибут ответа
            target.dataset.userAnswer = selectedLeftT8.dataset.id;
            
            // Визуально фиксируем связанные элементы
            target.classList.add("matched");
            selectedLeftT8.classList.add("matched");
            selectedLeftT8.classList.remove("selected");
            
            selectedLeftT8 = null;
        });
    });
}

// Механика Задания 10: Вертикальная Drag-and-Drop сортировка по слотам иерархии
function initializeOrderDragAndDrop() {
    const dragItems = document.querySelectorAll('#t10-drag-bank [draggable="true"]');
    const dropZones = document.querySelectorAll('.order-drop-zone');

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
            if (zone.children.length > 0) return; // Один слот — один таксон

            const wordData = e.dataTransfer.getData('text/plain');
            const draggedNode = document.querySelector('#t10-drag-bank [data-word="' + wordData + '"]');
            if (draggedNode) {
                zone.appendChild(draggedNode);
                draggedNode.style.margin = "0";
                draggedNode.style.width = "100%";
                draggedNode.style.textAlign = "center";
            }
        });
    });
}
// Главная управляющая функция сбора и сличения ответов с эталонной матрицей
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Задание 1: Вложенные токены (Растения, Систематика)
    const d1_1 = document.querySelector("#t1-drop1 [data-word]");
    const d1_2 = document.querySelector("#t1-drop2 [data-word]");
    answersReport.push({ isCorrect: d1_1 && d1_1.dataset.word === "Растения" && d1_2 && d1_2.dataset.word === "Систематика" });

    // Задание 2: Вложенные токены (Вид, критериями вида)
    const d2_1 = document.querySelector("#t2-drop1 [data-word]");
    const d2_2 = document.querySelector("#t2-drop2 [data-word]");
    answersReport.push({ isCorrect: d2_1 && d2_1.dataset.word === "Вид" && d2_2 && d2_2.dataset.word === "критериями вида" });

    // Задание 3: Радиокнопка (автотрофами)
    const rad3 = document.querySelector('input[name="task3"]:checked');
    answersReport.push({ isCorrect: rad3 && rad3.value === "автотрофами" });

    // Задание 4: Радиокнопка (род)
    const rad4 = document.querySelector('input[name="task4"]:checked');
    answersReport.push({ isCorrect: rad4 && rad4.value === "род" });

    // Задание 5: Одиночный вложенный токен (Отдел)
    const d5_1 = document.querySelector("#t5-drop1 [data-word]");
    answersReport.push({ isCorrect: d5_1 && d5_1.dataset.word === "Отдел" });

    // Задание 6: Радиокнопка (цветковые)
    const rad6 = document.querySelector('input[name="task6"]:checked');
    answersReport.push({ isCorrect: rad6 && rad6.value === "цветковые" });

    // Задание 7: Радиокнопка (антропогенные)
    const rad7 = document.querySelector('input[name="task7"]:checked');
    answersReport.push({ isCorrect: rad7 && rad7.value === "антропогенные" });

    // Задание 8: Сенсорное сопоставление ромашки (9 пар)
    const rightItemsT8 = document.querySelectorAll(".t8-right");
    let t8Correct = true;
    let t8Count = 0;
    rightItemsT8.forEach(function(target) {
        if (target.dataset.userAnswer) t8Count++;
        if (target.dataset.userAnswer !== target.getAttribute("data-correct")) t8Correct = false;
    });
    answersReport.push({ isCorrect: t8Correct && t8Count === 9 });

    // Задание 9: Чекбоксы (НЕ высшие семенные: Спирогира, Кукушкин лён, Хвощ)
    const checked9 = Array.from(document.querySelectorAll('input[name="task9"]:checked')).map(function(el) { return el.value; });
    const expected9 = ["Спирогира", "Кукушкин лён", "Хвощ"];
    answersReport.push({ isCorrect: checked9.length === expected9.length && checked9.every(function(v) { return expected9.includes(v); }) });

    // Задание 10: Вертикальная иерархическая сортировка слотов от НАИМЕНЬШЕЙ к НАИБОЛЬШЕЙ
    // Слоты 1-7 должны строго содержать таксоны: Вид, Род, Семейство, Порядок, Класс, Отдел, Царство
    const s1 = document.querySelector("#t10-slot1 [data-word]");
    const s2 = document.querySelector("#t10-slot2 [data-word]");
    const s3 = document.querySelector("#t10-slot3 [data-word]");
    const s4 = document.querySelector("#t10-slot4 [data-word]");
    const s5 = document.querySelector("#t10-slot5 [data-word]");
    const s6 = document.querySelector("#t10-slot6 [data-word]");
    const s7 = document.querySelector("#t10-slot7 [data-word]");

    const t10Correct = s1 && s1.dataset.word === "Вид" &&
                       s2 && s2.dataset.word === "Род" &&
                       s3 && s3.dataset.word === "Семейство" &&
                       s4 && s4.dataset.word === "Порядок" &&
                       s5 && s5.dataset.word === "Класс" &&
                       s6 && s6.dataset.word === "Отдел" &&
                       s7 && s7.dataset.word === "Царство";
    answersReport.push({ isCorrect: t10Correct });

    // Передача массива на модуль трансляции данных
    transmitDataToBlackMesa(answersReport);
}

// Подсчет результатов по 5-балльной шкале (для 10 заданий)
function calculateGrade(score) {
    const percentage = (score / totalPointsPossible) * 100;
    if (percentage >= 90) return 5; // 9-10 баллов
    if (percentage >= 70) return 4; // 7-8 баллов
    if (percentage >= 50) return 3; // 5-6 баллов
    return 2;                       // Менее 5 баллов
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
