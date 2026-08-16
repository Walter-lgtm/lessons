// Конфигурация шлюза Google Form (Сюда вносятся данные экстрактора v4.0)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSflzsUDeyn1iy_MmntYXqidByaLAW8OCAXOoyzjQDPj2Tm4Qw/formResponse";
const ENTRY_FIO = "entry.1090962318";       // ID поля ФИО
const ENTRY_CLASS = "entry.1911978175";     // ID поля Класс (передача маркера штрафа)
const ENTRY_SCORE = "entry.232773798";     // ID поля Баллы
const ENTRY_MARK = "entry.173383969";      // ID поля Оценка

// Глобальное состояние сессии терминала контроля
let studentUID = "";
let penaltyPoints = 0;
const totalPointsPossible = 6; // В итоговом тесте всегда ровно 6 заданий
let activeVariantTasks = [];   // Здесь будут храниться 6 выбранных на текущую сессию задач

// Инициализация при первичной загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-trigger").addEventListener("click", executeBiometricAuth);
});

// Протокол Авторизации и Защиты "Анти-брутфорс v2.0"
function executeBiometricAuth() {
    window.onerror = function(msg, url, line) { alert("КРИТИЧЕСКИЙ СБОЙ: " + msg + "\nСтрока: " + line); };
    const fioInput = document.getElementById("student-fio").value.trim();
    const classInput = document.getElementById("student-class").value.trim();
    const alertBox = document.getElementById("auth-alert");

    if (fioInput.length < 5 || classInput.length < 2) {
        alertBox.textContent = "ОШИБКА: ДАННЫЕ ВВЕДЕНЫ НЕКОРРЕКТНО. ОПОРНЫЕ СИМВОЛЫ НЕ ОПОЗНАНЫ.";
        alertBox.style.display = "block";
        return;
    }

    studentUID = btoa(unescape(encodeURIComponent(`${fioInput}_${classInput}`)));
    const savedUID = localStorage.getItem("bme_g1_control_uid");

    if (savedUID === studentUID) {
        let currentPenalty = parseInt(localStorage.getItem("bme_g1_control_penalty") || "0", 10);
        penaltyPoints = currentPenalty + 1;
        localStorage.setItem("bme_g1_control_penalty", penaltyPoints);
        
        alertBox.textContent = `ВНИМАНИЕ: ОБНАРУЖЕН ПОВТОРНЫЙ ВХОД. АКТИВИРОВАН ШТРАФ: -${penaltyPoints} БАЛЛ.`;
        alertBox.style.color = "#ff5500";
        alertBox.style.display = "block";
    } else {
        localStorage.setItem("bme_g1_control_uid", studentUID);
        localStorage.setItem("bme_g1_control_penalty", "0");
        penaltyPoints = 0;
    }

    document.getElementById("auth-block").style.display = "none";
    
    // Запуск интеллектуального генератора вариантов перед показом интерфейса
    generateAndRenderVariant();

    const bioContent = document.getElementById("biology-content");
    bioContent.style.removeProperty("display");
    bioContent.classList.remove("hidden-module");

    const submitBtn = document.getElementById("submit-tasks");
    if (submitBtn) {
        submitBtn.addEventListener("click", collectAndVerifyAnswers);
    }
}

// РАСПРЕДЕЛЕННАЯ БАЗА ДАННЫХ ЗАДАНИЙ ГЛАВЫ 1 (ТЕМЫ 1-2 ИЗ 6)
const TASKS_DATABASE = {
    // ТЕМА 1: Введение в ботанику (Параграф "Наука ботаника")
    theme1: [
        {
            id: "t1_q1",
            type: "radio",
            title: "Контроль Темы 1 // Выбери верный ответ",
            text: "Для озеленения в городах НЕ используются такие растения, как:",
            options: ["Ясень", "Карликовая берёза", "Дуб", "Ирисы", "Бархатцы", "Сирень"],
            verify: (card) => {
                const rad = card.querySelector('input[type="radio"]:checked');
                return rad && rad.value === "Карликовая берёза";
            }
        },
        {
            id: "t1_q2",
            type: "radio",
            title: "Контроль Темы 1 // Выбери верный ответ",
            text: "В парках городов много растений. Их вытаптывание отдыхающими — это пример фактора:",
            options: ["Абиотического", "Биотического", "Антропогенного"],
            verify: (card) => {
                const rad = card.querySelector('input[type="radio"]:checked');
                return rad && rad.value === "Антропогенного";
            }
        }
    ],

    // ТЕМА 2: Строение растительной клетки (§2)
    theme2: [
        {
            id: "t2_q1",
            type: "image-radio",
            title: "Контроль Темы 2 // Анализ схемы [cell.png]",
            text: "Какой цифрой на рисунке строения растительной клетки указано, где располагаются поры для взаимодействия клеток между собой?",
            image: "cell.png",
            options: ["4", "5", "7", "2"],
            verify: (card) => {
                const rad = card.querySelector('input[type="radio"]:checked');
                return rad && rad.value === "4";
            }
        },
        {
            id: "t2_q2",
            type: "image-radio",
            title: "Контроль Темы 2 // Анализ стадий развития [cell_01.png]",
            text: "Выбери правильную последовательность расположения клеток от самой молодой до самой старой.",
            image: "cell_01.png",
            options: ["3, 5, 1, 4, 2", "5, 2, 1, 3, 4", "1, 2, 3, 4, 5"],
            verify: (card) => {
                const rad = card.querySelector('input[type="radio"]:checked');
                return rad && rad.value === "3, 5, 1, 4, 2";
            }
        }
    ]
};
// ПРОДОЛЖЕНИЕ РАСПРЕДЕЛЕННОЙ БАЗЫ ДАННЫХ (ТЕМЫ 3-4 ИЗ 6)
// Добавляется строго внутрь объекта TASKS_DATABASE после theme2

    // ТЕМА 3: Химический состав клетки (§3)
    theme3: [
        {
            id: "t3_q1",
            type: "text-inputs",
            title: "Контроль Темы 3 // Вставь верные биологические термины",
            text: `Приблизительно 1–1,5% общей массы клетки составляют <span style="color:#ff5500;">[М...]</span> <input type="text" data-idx="0" class="hud-input" style="display:inline-block; width:120px; padding:4px;" autocomplete="off"> <span style="color:#ff5500;">[с...]</span> <input type="text" data-idx="1" class="hud-input" style="display:inline-block; width:80px; padding:4px;" autocomplete="off">, в частности соли кальция, калия, фосфора.`,
            verify: (card) => {
                const inputs = card.querySelectorAll('input[type="text"]');
                const val1 = inputs[0].value.trim().toLowerCase();
                const val2 = inputs[1].value.trim().toLowerCase();
                return val1.startsWith("минераль") && val2.startsWith("сол");
            }
        },
        {
            id: "t3_q2",
            type: "radio",
            title: "Контроль Темы 3 // Выбери верный ответ",
            text: "Какие органические вещества являются хранилищем наследственной информации для клетки?",
            options: ["Белки", "Жиры", "Углеводы", "Нуклеиновые кислоты"],
            verify: (card) => {
                const rad = card.querySelector('input[type="radio"]:checked');
                return rad && rad.value === "Нуклеиновые кислоты";
            }
        }
    ],

    // ТЕМА 4: Общие признаки, разнообразие, распространение растений (§1)
    theme4: [
        {
            id: "t4_q1",
            type: "drag-drop-3",
            title: "Контроль Темы 4 // Распредели растения по группам",
            text: "Перетащите элементы флоры в соответствующие технологические ячейки:",
            bank: ["улотрикс", "папоротник", "лилии", "хвощ", "груша", "ольха"],
            groups: ["Низшие растения", "Высшие споровые", "Высшие семенные"],
            verify: (card) => {
                const g1 = Array.from(card.querySelectorAll("[data-group='0'] [data-word]")).map(el => el.dataset.word);
                const g2 = Array.from(card.querySelectorAll("[data-group='1'] [data-word]")).map(el => el.dataset.word);
                const g3 = Array.from(document.querySelectorAll("[data-group='2'] [data-word]")).map(el => el.dataset.word);
                
                const exp1 = ["улотрикс"];
                const exp2 = ["папоротник", "хвощ"];
                const exp3 = ["лилии", "груша", "ольха"];
                
                return g1.length === exp1.length && g1.every(v => exp1.includes(v)) &&
                       g2.length === exp2.length && g2.every(v => exp2.includes(v)) &&
                       g3.length === exp3.length && g3.every(v => exp3.includes(v));
            }
        },
        {
            id: "t4_q2",
            type: "match-pairs",
            title: "Контроль Темы 4 // Соотнеси группы растений с представителями",
            text: "Нажмите на группу слева, затем на представителя справа:",
            left: [
                { id: "семенные", txt: "ВЫСШИЕ СЕМЕННЫЕ" },
                { id: "низшие", txt: "НИЗШИЕ РАСТЕНИЯ" },
                { id: "споровые", txt: "ВЫСШИЕ СПОРОВЫЕ" }
            ],
            right: [
                { corr: "низшие", txt: "ВОДОРОСЛИ" },
                { corr: "семенные", txt: "ПОКРЫТОСЕМЕННЫЕ" },
                { corr: "споровые", txt: "МОХОВИДНЫЕ" }
            ],
            verify: (card) => {
                const rights = card.querySelectorAll(".t2-right");
                let correct = true;
                let count = 0;
                rights.forEach(r => {
                    if (r.dataset.userAnswer) count++;
                    if (r.dataset.userAnswer !== r.getAttribute("data-correct")) correct = false;
                });
                return correct && count === 3;
            }
        }
    ]
// ЗАВЕРШЕНИЕ РАСПРЕДЕЛЕННОЙ БАЗЫ ДАННЫХ (ТЕМЫ 5-6 ИЗ 6)
// Добавляется строго внутрь объекта TASKS_DATABASE после theme4

    // ТЕМА 5: Особенности строения и функции растительных тканей (§5)
    theme5: [
        {
            id: "t5_q1",
            type: "drag-drop-5",
            title: "Контроль Темы 5 // Распредели по группам ткани согласно их функциям",
            text: "Перетащите структуры в соответствующие технологические контейнеры:",
            bank: ["пробка", "сосуды", "конус нарастания", "фотосинтезирующая", "камбий"],
            groups: ["Образовательная", "Основная", "Покровная", "Проводящая", "Механическая"],
            verify: (card) => {
                const g1 = Array.from(card.querySelectorAll("[data-group='0'] [data-word]")).map(el => el.dataset.word);
                const g2 = Array.from(card.querySelectorAll("[data-group='1'] [data-word]")).map(el => el.dataset.word);
                const g3 = Array.from(card.querySelectorAll("[data-group='2'] [data-word]")).map(el => el.dataset.word);
                const g4 = Array.from(card.querySelectorAll("[data-group='3'] [data-word]")).map(el => el.dataset.word);
                const g5 = Array.from(card.querySelectorAll("[data-group='4'] [data-word]")).map(el => el.dataset.word);

                const exp1 = ["конус нарастания", "камбий"];
                const exp2 = ["фотосинтезирующая"];
                const exp3 = ["пробка"];
                const exp4 = ["сосуды"];
                const exp5 = []; // Пустая группа

                return g1.length === exp1.length && g1.every(v => exp1.includes(v)) &&
                       g2.length === exp2.length && g2.every(v => exp2.includes(v)) &&
                       g3.length === exp3.length && g3.every(v => exp3.includes(v)) &&
                       g4.length === exp4.length && g4.every(v => exp4.includes(v)) &&
                       g5.length === exp5.length;
            }
        },
        {
            id: "t5_q2",
            type: "radio",
            title: "Контроль Темы 5 // Выбери верный ответ",
            text: "Учёный, который впервые ввёл термин «ткань» в ботанику:",
            options: ["Мальпиги", "Гук", "Грю", "Левенгук"],
            verify: (card) => {
                const rad = card.querySelector('input[type="radio"]:checked');
                return rad && rad.value === "Грю";
            }
        }
    ],

    // ТЕМА 6: Органы растения (§6)
    theme6: [
        {
            id: "t6_q1",
            type: "image-checkbox",
            title: "Контроль Темы 6 // Анализ графической схемы [bio_flower.png]",
            text: "Наличие каких органов указывает, что на рисунке изображено цветковое растение? (Несколько вариантов)",
            image: "bio_flower.png",
            options: ["Стебель", "Листья", "Побег", "Цветок", "Плод", "Корень", "Семена"],
            verify: (card) => {
                const checked = Array.from(card.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
                const expected = ["Цветок", "Плод", "Семена"];
                return checked.length === expected.length && checked.every(v => expected.includes(v));
            }
        },
        {
            id: "t6_q2",
            type: "text-inputs",
            title: "Контроль Темы 6 // Вставь верный биологический термин",
            text: `У некоторых растений, таких как свёкла, морковь, репа, редис, корни служат местом запасания питательных веществ. Такие корни называют к <input type="text" data-idx="0" class="hud-input" style="display:inline-block; width:150px; padding:4px;" autocomplete="off">.`,
            verify: (card) => {
                const input = card.querySelector('input[type="text"]');
                const val = input.value.trim().toLowerCase();
                return val.startsWith("орнеплод"); // С учетом опорной "к" перед полем
            }
        }
    ]
}; // КОРНЕВОЙ ОБЪЕКТ БАЗЫ ДАННЫХ ЗАКРЫТ ШТАТНО
// Интеллектуальный генератор случайных вариантов (По 1 задаче из 6 тем)
function generateAndRenderVariant() {
    activeVariantTasks = [];
    const container = document.getElementById("dynamic-tasks-container");
    container.innerHTML = ""; // Очистка шлюза контейнера

    // Извлекаем по одному случайному вопросу из пула каждой темы
    const themes = ["theme1", "theme2", "theme3", "theme4", "theme5", "theme6"];
    themes.forEach(themeKey => {
        const pool = TASKS_DATABASE[themeKey];
        const randomTask = pool[Math.floor(Math.random() * pool.length)];
        activeVariantTasks.push(randomTask);
    });

    // На лету генерируем HTML-карточки и внедряем их в DOM
    activeVariantTasks.forEach((task, index) => {
        const cardNode = document.createElement("section");
        cardNode.className = "task-card";
        cardNode.id = `rendered-card-${task.id}`;
        cardNode.dataset.taskIndex = index;

        let innerContent = `<div class="task-title">№${index + 1} // ${task.title}</div>`;

        // Рендеринг в зависимости от типа механики вопроса
        if (task.type === "radio" || task.type === "image-radio") {
            innerContent += `<div class="task-text">${task.text}</div>`;
            if (task.image) {
                innerContent += `<div style="text-align:center; margin:10px 0;"><img src="${task.image}" style="max-width:100%; height:auto; border:1px solid #00ff66;"></div>`;
            }
            innerContent += `<div class="option-group">`;
            task.options.forEach(opt => {
                innerContent += `<label class="option-label"><input type="radio" name="variant_rad_${task.id}" value="${opt}"> ${opt}</label>`;
            });
            innerContent += `</div>`;
        } 
        else if (task.type === "image-checkbox") {
            innerContent += `<div class="task-text">${task.text}</div>`;
            innerContent += `<div style="text-align:center; margin:10px 0;"><img src="${task.image}" style="max-width:100%; height:auto; border:1px solid #00ff66;"></div>`;
            innerContent += `<div class="option-group">`;
            task.options.forEach(opt => {
                innerContent += `<label class="option-label"><input type="checkbox" value="${opt}"> ${opt}</label>`;
            });
            innerContent += `</div>`;
        } 
        else if (task.type === "text-inputs") {
            innerContent += `<div class="task-text">${task.text}</div>`;
        } 
        else if (task.type === "match-pairs") {
            innerContent += `<div class="task-text" style="margin-bottom:10px;">${task.text}</div>`;
            innerContent += `<div class="match-grid-container">
                <div class="match-column">`;
            task.left.forEach(l => {
                innerContent += `<div class="match-element ctrl-left" data-id="${l.id}">${l.txt}</div>`;
            });
            innerContent += `</div><div style="border-top:1px dashed rgba(0,255,102,0.2); margin:5px 0;"></div><div class="match-column">`;
            task.right.forEach(r => {
                innerContent += `<div class="match-element ctrl-right" data-correct="${r.corr}">${r.txt}</div>`;
            });
            innerContent += `</div></div>`;
        } 
        else if (task.type === "drag-drop-3" || task.type === "drag-drop-5") {
            innerContent += `<div class="task-text" style="margin-bottom:10px;">${task.text}</div>`;
            // Банк слов
            innerContent += `<div class="ctrl-drag-bank" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; padding:10px; background:rgba(0,255,102,0.02); border:1px dashed rgba(0,255,102,0.3);">`;
            task.bank.forEach(word => {
                innerContent += `<div class="match-element" draggable="true" data-word="${word}" style="padding:6px 10px; font-size:0.85rem;">${word}</div>`;
            });
            innerContent += `</div><div style="display:flex; flex-direction:column; gap:15px;">`;
            // Контейнеры сброса
            task.groups.forEach((groupName, gIdx) => {
                innerContent += `<div style="border:1px dashed #00ff66; padding:10px;">
                    <div style="font-size:0.9rem; color:#ff5500; font-weight:bold; margin-bottom:8px;">${groupName}</div>
                    <div class="ctrl-drop-zone" data-group="${gIdx}" style="min-height:50px; background:rgba(0,255,102,0.03); display:flex; flex-wrap:wrap; gap:6px; padding:5px;"></div>
                </div>`;
            });
            innerContent += `</div>`;
        }

        cardNode.innerHTML = innerContent;
        container.appendChild(cardNode);
    });

    // После инжекции разметки инициализируем динамические интерактивные обработчики
    attachDynamicInteractions();
}
// Активация интерактивных обработчиков событий для динамических карточек
function attachDynamicInteractions() {
    // 1. Механика динамического сенсорного сопоставления пар (Тап слева -> Тап справа)
    document.querySelectorAll(".task-card").forEach(card => {
        let selectedLeft = null;
        const leftItems = card.querySelectorAll(".ctrl-left");
        const rightTargets = card.querySelectorAll(".ctrl-right");

        leftItems.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("matched")) return;
                leftItems.forEach(i => i.classList.remove("selected"));
                selectedLeft = item;
                item.classList.add("selected");
            });
        });

        rightTargets.forEach(target => {
            target.addEventListener("click", () => {
                if (target.classList.contains("matched") || !selectedLeft) return;
                target.dataset.userAnswer = selectedLeft.dataset.id;
                target.classList.add("matched");
                selectedLeft.classList.add("matched");
                selectedLeft.classList.remove("selected");
                selectedLeft = null;
            });
        });
    });

    // 2. Механика динамического Drag-and-Drop (на 3 или 5 зон сброса)
    document.querySelectorAll(".task-card").forEach(card => {
        const dragItems = card.querySelectorAll('.ctrl-drag-bank [draggable="true"]');
        const dropZones = card.querySelectorAll('.ctrl-drop-zone');

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
                const draggedNode = card.querySelector(`[data-word="${wordData}"]`);
                if (draggedNode) {
                    zone.appendChild(draggedNode);
                    draggedNode.style.margin = "2px";
                    draggedNode.style.border = "1px solid rgba(0, 255, 102, 0.4)";
                }
            });
        });
    });
}

// Главная управляющая функция сбора и сличения ответов сгенерированного варианта
function collectAndVerifyAnswers() {
    const answersReport = [];

    // Бежим строго по тем 6 заданиям, которые были сгенерированы в текущую сессию
    activeVariantTasks.forEach(task => {
        const cardContainer = document.getElementById(`rendered-card-${task.id}`);
        if (cardContainer) {
            // Запускаем встроенную в объект задачи функцию изолированной проверки verify()
            const isCorrect = task.verify(cardContainer);
            answersReport.push({ isCorrect: isCorrect });
        } else {
            answersReport.push({ isCorrect: false });
        }
    });

    // Передача массива на модуль трансляции данных
    transmitDataToBlackMesa(answersReport);
}

// Подсчет результатов по строгой 5-балльной шкале для контроля (Всего вопросов: 6)
function calculateGrade(score) {
    if (score === 6) return 5; // 100% результат
    if (score === 5) return 4; // 83% результат
    if (score === 4) return 4; // 66% результат
    if (score === 3) return 3; // 50% результат
    return 2;                  // Менее 3 баллов — неудовлетворительно
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
        submitBtn.textContent = "СИНХРОНИЗАЦИЯ КОНТРОЛЯ...";
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
        console.error("Критический сбой синхронизации контроля:", error);
        alert("ОШИБКА СВЯЗИ. Данные контроля не переданы. Попробуйте еще раз.");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Синхронизировать отчет контроля";
            submitBtn.style.background = "#ff5500";
        }
    });
}

// Отрисовка итогового отчета с жесткой привязкой к λ-CORE
function displayFinalHUDReport(score, mark) {
    const mainContent = document.getElementById("biology-content");
    mainContent.innerHTML = `
        <div style="border: 2px solid #ff5500; padding: 25px 15px; text-align: center; background: rgba(255,85,0,0.05); margin-top: 10px;">
            <h2 style="color: #ff5500; margin-bottom: 15px; letter-spacing: 2px; font-size: 1.1rem;">ИТОГОВЫЙ КОНТРОЛЬ ГЛАВЫ 1 ЗАВЕРШЕН</h2>
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
