document.addEventListener("DOMContentLoaded", () => {
    // Глобальные переменные сессии
    let studentName = "";
    let studentClass = "";
    let generatedVariant = []; // Сюда запишутся отобранные 10 заданий

    // Элементы интерфейса
    const authScreen = document.getElementById("auth-screen");
    const quizContainer = document.getElementById("quiz-container");
    const startBtn = document.getElementById("start-btn");
    const inputName = document.getElementById("student-name");
    const inputClass = document.getElementById("student-class");
    const tasksArea = document.getElementById("dynamic-tasks-area");

    // ==========================================
    // 1. БАЗА ДАННЫХ ЗАДАНИЙ ГЛАВЫ 2 (ЧАСТЬ 1: §§9-11)
    // ==========================================
    const ALL_TASKS_DATABASE = [
        // --- ПАРАГРАФ 9 ---
        {
            id: "p9_t1",
            paragraph: 9,
            type: "radio",
            render: (index) => `
                <section class="task-card" data-task-id="p9_t1">
                    <h3>[λ] Задание ${index}. Выбери верный ответ (§9)</h3>
                    <p class="question-text">Какое увеличительное стекло имеет плосковыпуклую форму?</p>
                    <div class="radio-group">
                        <label class="hl-radio"><input type="radio" name="p9_t1_ans" value="1"><span></span> Окуляр</label>
                        <label class="hl-radio"><input type="radio" name="p9_t1_ans" value="2"><span></span> Объектив</label>
                        <label class="hl-radio"><input type="radio" name="p9_t1_ans" value="3"><span></span> Лупа</label>
                        <label class="hl-radio"><input type="radio" name="p9_t1_ans" value="4"><span></span> Тубус</label>
                    </div>
                </section>`,
            check: () => {
                const sel = document.querySelector('input[name="p9_t1_ans"]:checked');
                return (sel && sel.value === "3") ? 1 : 0;
            }
        },
        {
            id: "p9_t2",
            paragraph: 9,
            type: "select",
            render: (index) => `
                <section class="task-card" data-task-id="p9_t2">
                    <h3>[λ] Задание ${index}. Заполни пропуск в тексте (§9)</h3>
                    <p class="question-text">
                        Главная часть светового микроскопа, в которую вставлены увеличительные стёкла — это 
                        <select class="hl-select" id="p9_t2_ans" style="display:inline-block; width:auto; margin:0 5px;">
                            <option value="" disabled selected>Выбери ответ</option>
                            <option value="Тубус">тубус</option>
                            <option value="Штатив">штатив</option>
                            <option value="Зеркало">зеркало</option>
                        </select>.
                    </p>
                </section>`,
            check: () => {
                const el = document.getElementById("p9_t2_ans");
                return (el && el.value === "Тубус") ? 1 : 0;
            }
        },

        // --- ПАРАГРАФ 10 ---
        {
            id: "p10_t1",
            paragraph: 10,
            type: "select",
            render: (index) => `
                <section class="task-card" data-task-id="p10_t1">
                    <h3>[λ] Задание ${index}. Выбери верный термин из списка (§10)</h3>
                    <p class="question-text">
                        <select class="hl-select" id="p10_t1_ans" style="display:inline-block; width:auto; margin:0 5px;">
                            <option value="" disabled selected>Выбери ответ</option>
                            <option value="Клеточная мембрана">Клеточная мембрана</option>
                            <option value="Цитоплазма">Цитоплазма</option>
                            <option value="Генетический аппарат">Генетический аппарат</option>
                        </select>
                        отграничивает внутреннее содержимое клетки, защищает её от неблагоприятных влияний окружающей среды.
                    </p>
                </section>`,
            check: () => {
                const el = document.getElementById("p10_t1_ans");
                return (el && el.value === "Клеточная мембрана") ? 1 : 0;
            }
        },
        {
            id: "p10_t2",
            paragraph: 10,
            type: "checkbox",
            render: (index) => `
                <section class="task-card" data-task-id="p10_t2">
                    <h3>[λ] Задание ${index}. Множественный выбор (§10)</h3>
                    <p class="question-text">В клетках каких организмов содержатся пластиды?</p>
                    <div class="checkbox-group">
                        <label class="hl-checkbox"><input type="checkbox" name="p10_t2_ans" value="Крот"><span></span> Крот</label>
                        <label class="hl-checkbox"><input type="checkbox" name="p10_t2_ans" value="Арбуз"><span></span> Арбуз</label>
                        <label class="hl-checkbox"><input type="checkbox" name="p10_t2_ans" value="Белый медведь"><span></span> Белый медведь</label>
                        <label class="hl-checkbox"><input type="checkbox" name="p10_t2_ans" value="Берёза"><span></span> Берёза</label>
                    </div>
                </section>`,
            check: () => {
                const ans = Array.from(document.querySelectorAll('input[name="p10_t2_ans"]:checked')).map(el => el.value);
                return (ans.length === 2 && ans.includes("Арбуз") && ans.includes("Берёза")) ? 1 : 0;
            }
        },

        // --- ПАРАГРАФ 11 ---
        {
            id: "p11_t1",
            paragraph: 11,
            type: "inline-input",
            render: (index) => `
                <section class="task-card" data-task-id="p11_t1">
                    <h3>[λ] Задание ${index}. Впиши пропущенный термин (§11)</h3>
                    <p class="question-text">
                        Ф<input type="text" id="p11_t1_ans" class="hl-inline-input" style="width:120px;" autocomplete="off"> 
                        — процесс образования organic-веществ из углекислого газа и воды в хлоропластах на свету.
                    </p>
                </section>`,
            check: () => {
                const val = document.getElementById("p11_t1_ans").value.trim().toLowerCase();
                return (val === "отосинтез" || val === "фотосинтез") ? 1 : 0;
            }
        },
        {
            id: "p11_t2",
            paragraph: 11,
            type: "radio",
            render: (index) => `
                <section class="task-card" data-task-id="p11_t2">
                    <h3>[λ] Задание ${index}. Выбери верный ответ (§11)</h3>
                    <p class="question-text">Как называется процесс газообмена между организмом и окружающей средой?</p>
                    <div class="radio-group">
                        <label class="hl-radio"><input type="radio" name="p11_t2_ans" value="Питание"><span></span> Питание</label>
                        <label class="hl-radio"><input type="radio" name="p11_t2_ans" value="Дыхание"><span></span> Дыхание</label>
                        <label class="hl-radio"><input type="radio" name="p11_t2_ans" value="Выделение"><span></span> Выделение</label>
                    </div>
                </section>`,
            check: () => {
                const sel = document.querySelector('input[name="p11_t2_ans"]:checked');
                return (sel && sel.value === "Дыхание") ? 1 : 0;
            }
        },
      // --- ПАРАГРАФ 12 ---
        {
            id: "p12_t1",
            paragraph: 12,
            type: "checkbox",
            render: (index) => `
                <section class="task-card" data-task-id="p12_t1">
                    <h3>[λ] Задание ${index}. Отметь верные утверждения (§12)</h3>
                    <p class="question-text">Выберите все истинные биологические утверждения из списка:</p>
                    <div class="checkbox-group">
                        <label class="hl-checkbox"><input type="checkbox" name="p12_t1_ans" value="1"><span></span> Живые клетки дышат, питаются, растут и размножаются.</label>
                        <label class="hl-checkbox"><input type="checkbox" name="p12_t1_ans" value="2"><span></span> Вещества, необходимые для жизнедеятельности клеток, поступают в них через хромосомы.</label>
                        <label class="hl-checkbox"><input type="checkbox" name="p12_t1_ans" value="3"><span></span> Клеточная мембрана хорошо пропускает одни вещества и задерживает другие.</label>
                    </div>
                </section>`,
            check: () => {
                const ans = Array.from(document.querySelectorAll('input[name="p12_t1_ans"]:checked')).map(el => el.value);
                return (ans.length === 2 && ans.includes("1") && ans.includes("3")) ? 1 : 0;
            }
        },
        {
            id: "p12_t2",
            paragraph: 12,
            type: "radio",
            render: (index) => `
                <section class="task-card" data-task-id="p12_t2">
                    <h3>[λ] Задание ${index}. Выбери верный ответ (§12)</h3>
                    <p class="question-text">К какому надцарству относится амёба?</p>
                    <div class="radio-group">
                        <label class="hl-radio"><input type="radio" name="p12_t2_ans" value="Вирусы"><span></span> Вирусы</label>
                        <label class="hl-radio"><input type="radio" name="p12_t2_ans" value="Эукариоты"><span></span> Эукариоты</label>
                        <label class="hl-radio"><input type="radio" name="p12_t2_ans" value="Прокариоты"><span></span> Прокариоты</label>
                    </div>
                </section>`,
            check: () => {
                const sel = document.querySelector('input[name="p12_t2_ans"]:checked');
                return (sel && sel.value === "Эукариоты") ? 1 : 0;
            }
        },

        // --- ПАРАГРАФ 13 ---
        {
            id: "p13_t1",
            paragraph: 13,
            type: "select",
            render: (index) => `
                <section class="task-card" data-task-id="p13_t1">
                    <h3>[λ] Задание ${index}. Выбери верный ответ из списка (§13)</h3>
                    <p class="question-text">
                        Растения по способу питания являются 
                        <select class="hl-select" id="p13_t1_ans" style="display:inline-block; width:auto; margin:0 5px;">
                            <option value="" disabled selected>Выбери ответ</option>
                            <option value="автотрофами">автотрофами</option>
                            <option value="гетеротрофами">гетеротрофами</option>
                            <option value="миксотрофами">миксотрофами</option>
                        </select>.
                    </p>
                </section>`,
            check: () => {
                const el = document.getElementById("p13_t1_ans");
                return (el && el.value === "автотрофами") ? 1 : 0;
            }
        },
        {
            id: "p13_t2",
            paragraph: 13,
            type: "radio",
            render: (index) => `
                <section class="task-card" data-task-id="p13_t2">
                    <h3>[λ] Задание ${index}. Выбери верный ответ (§13)</h3>
                    <p class="question-text">Что общего между грибами и животными?</p>
                    <div class="radio-group">
                        <label class="hl-radio"><input type="radio" name="p13_t2_ans" value="1"><span></span> Всасывание минеральных веществ</label>
                        <label class="hl-radio"><input type="radio" name="p13_t2_ans" value="2"><span></span> По способу питания (гетеротрофы)</label>
                        <label class="hl-radio"><input type="radio" name="p13_t2_ans" value="3"><span></span> Ведут неподвижный образ жизни</label>
                    </div>
                </section>`,
            check: () => {
                const sel = document.querySelector('input[name="p13_t2_ans"]:checked');
                return (sel && sel.value === "2") ? 1 : 0;
            }
        },

        // --- ПАРАГРАФ 14 ---
        {
            id: "p14_t1",
            paragraph: 14,
            type: "radio",
            render: (index) => `
                <section class="task-card" data-task-id="p14_t1">
                    <h3>[λ] Задание ${index}. Выбери верный ответ (§14)</h3>
                    <p class="question-text">Бактерии как клетки содержат:</p>
                    <div class="radio-group">
                        <label class="hl-radio"><input type="radio" name="p14_t1_ans" value="Ядро"><span></span> Ядро</label>
                        <label class="hl-radio"><input type="radio" name="p14_t1_ans" value="Ядрышко"><span></span> Ядрышко</label>
                        <label class="hl-radio"><input type="radio" name="p14_t1_ans" value="Кольцевую хромосому"><span></span> Кольцевую хромосому</label>
                    </div>
                </section>`,
            check: () => {
                const sel = document.querySelector('input[name="p14_t1_ans"]:checked');
                return (sel && sel.value === "Кольцевую хромосому") ? 1 : 0;
            }
        },
        {
            id: "p14_t2",
            paragraph: 14,
            type: "drag",
            render: (index) => `
                <section class="task-card" data-task-id="p14_t2">
                    <h3>[λ] Задание ${index}. Распредели бактерии по группам (Drag-and-Drop) (§14)</h3>
                    <p class="question-text">Перетащи плашки в соответствующие зоны значения:</p>
                    <div class="drag-words-container dynamic-drag-source">
                        <span class="drag-word" draggable="true" data-word="круговорот">круговорот веществ</span>
                        <span class="drag-word" draggable="true" data-word="очистка">очистка сточных вод</span>
                    </div>
                    <div class="two-columns">
                        <div class="group-zone dynamic-zone" data-group="nature">
                            <h4>Значение в природе</h4>
                            <div class="zone-content"></div>
                        </div>
                        <div class="group-zone dynamic-zone" data-group="human">
                            <h4>Значение в жизни человека</h4>
                            <div class="zone-content"></div>
                        </div>
                    </div>
                </section>`,
            check: (container) => {
                const natureZone = container.querySelector('.group-zone[data-group="nature"] .zone-content');
                const humanZone = container.querySelector('.group-zone[data-group="human"] .zone-content');
                
                const natureWords = natureZone ? Array.from(natureZone.querySelectorAll('.drag-word')).map(el => el.dataset.word) : [];
                const humanWords = humanZone ? Array.from(humanZone.querySelectorAll('.drag-word')).map(el => el.dataset.word) : [];
                
                return (natureWords.includes("круговорот") && humanWords.includes("очи")) ? 1 : 0; 
                // Упрощенная и быстрая проверка наличия ключевых плашек в нужных корзинах
                const nOk = natureWords.length === 1 && natureWords[0] === "круговорот";
                const hOk = humanWords.length === 1 && humanWords[0] === "очистка";
                return (nOk && hOk) ? 1 : 0;
            }
        }
    ]; // Конец базы данных
            // ==========================================
    // ==========================================
    // 2. АВТОРИЗАЦИЯ, КОНТРОЛЬ ПОПЫТОК И РАНДОМИЗАЦИЯ
    // ==========================================
    startBtn.addEventListener("click", () => {
        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();

        if (!studentName || !studentClass) {
            alert("ВНИМАНИЕ! Доступ заблокирован. Введите ФИО и Класс для идентификации.");
            return;
        }

        // === НАЧАЛО БЛОКА ПОДВОХА (ВЕРСИЯ 2.0 - ЖЕСТКИЙ ПРОТОКОЛ) ===
        const studentUid = (studentName + "_" + studentClass).toLowerCase().replace(/\s+/g, '');
        const storageKey = "attempts_final_exam_g2_" + studentUid;
        
        let currentAttempt = parseInt(localStorage.getItem(storageKey)) || 0;
        currentAttempt++; 
        localStorage.setItem(storageKey, currentAttempt); 

        if (currentAttempt > 1) {
            let penalty = currentAttempt - 1;
            window.currentPenalty = penalty;
            window.currentAttemptNumber = currentAttempt;
        } else {
            window.currentPenalty = 0;
            window.currentAttemptNumber = 1;
        }
        // === КОНЕЦ БЛОКА ПОДВОХА ===

        // === АЛГОРИТМ СТРОГОГО СБАЛАНСИРОВАННОГО ОТБОРА (ТЗ) ===
        generatedVariant = [];
        
        // ВОТ ЭТА СТРОКА С КРИТИЧЕСКИМ ФИКСОМ:
        const paragraphs =;
        
        // Шаг А: Берем строго по 1 случайному вопросу из каждого параграфа
        paragraphs.forEach(pNum => {
            const pTasks = ALL_TASKS_DATABASE.filter(t => t.paragraph === pNum);
            if (pTasks.length > 0) {
                const randomTask = pTasks[Math.floor(Math.random() * pTasks.length)];
                generatedVariant.push(randomTask);
            }
        });

        // Шаг Б: Добираем еще 4 случайных вопроса из оставшихся в базе (чтобы в сумме было ровно 10)
        const currentIds = generatedVariant.map(t => t.id);
        const remainingTasks = ALL_TASKS_DATABASE.filter(t => !currentIds.includes(t.id));
        
        // Перемешиваем остаток базы
        const shuffledRemaining = remainingTasks.sort(() => 0.5 - Math.random());
        
        // Добавляем 4 штуки
        for (let i = 0; i < 4 && i < shuffledRemaining.length; i++) {
            generatedVariant.push(shuffledRemaining[i]);
        }

        // Финальное перемешивание всего варианта из 10 вопросов
        generatedVariant.sort(() => 0.5 - Math.random());

        // === ДИНАМИЧЕСКИЙ РЕНДЕРИНГ ИНТЕРФЕЙСА ===
        tasksArea.innerHTML = ""; 
        generatedVariant.forEach((task, index) => {
            tasksArea.innerHTML += task.render(index + 1);
        });

        authScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        window.scrollTo(0, 0);

        // Включаем Drag-and-Drop
        initDynamicDragAndDrop();
    });

    // ==========================================
    // 3. ДИНАМИЧЕСКАЯ МЕХАНИКА DRAG AND DROP
    // ==========================================
    let draggedElement = null;

    function initDynamicDragAndDrop() {
        const words = document.querySelectorAll(".dynamic-drag-source .drag-word");
        const zones = document.querySelectorAll(".dynamic-zone");

        words.forEach(word => {
            word.addEventListener("dragstart", (e) => {
                draggedElement = word;
                e.dataTransfer.setData("text/plain", word.dataset.word);
            });
        });

        zones.forEach(zone => {
            const content = zone.querySelector(".zone-content");
            zone.addEventListener("dragover", (e) => e.preventDefault());
            zone.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!draggedElement) return;

                // Защита от перетаскивания плашек между разными карточками заданий
                const sourceCard = draggedElement.closest(".task-card");
                const targetCard = zone.closest(".task-card");
                if (sourceCard !== targetCard) return;

                content.appendChild(draggedElement);
                draggedElement = null;
            });
        });
    }
  // ==========================================
    // 4. КОМПЛЕКСНАЯ ВАЛИДАЦИЯ И ОТПРАВКА ДАННЫХ
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // Циклически опрашиваем сгенерированный вариант вопросов
        generatedVariant.forEach(task => {
            const cardContainer = document.querySelector(`.task-card[data-task-id="${task.id}"]`);
            if (cardContainer) {
                // Вызываем встроенную в объект вопроса функцию проверки, передавая контейнер карточки
                totalScore += task.check(cardContainer);
            }
        });

        // --- ПРИМЕНЕНИЕ СТРОГОГО ШТРАФА (АНТИ-БРУТФОРС v2.0) ---
        if (window.currentPenalty && window.currentPenalty > 0) {
            totalScore = totalScore - window.currentPenalty;
            if (totalScore < 0) totalScore = 0; // Оценка не может упасть ниже нуля
            
            // Записываем маркер попытки в строку класса для вашей Google Таблицы
            studentClass = studentClass + ` (Попытка №${window.currentAttemptNumber}, Штраф: -${window.currentPenalty}б.)`;
        }

        // --- ВЫВОД РЕЗУЛЬТАТОВ НА ЭКРАН УЧЕНИКА ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (из 10 возможных сбалансированных баллов)
        let finalGrade = "2";
        if (totalScore >= 9) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 7) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore >= 5) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }
        document.getElementById("res-grade").textContent = finalGrade;

        document.getElementById("result-screen").classList.remove("hidden");

        // Отправка результатов через квантовый POST-шлюз в Сектор таблиц
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Создайте ОТДЕЛЬНУЮ Google Форму для Итоговой работы ГЛАВЫ 2 и вставьте её URL сюда:
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScefyl7u8GL4oEMNYd0cKE85QHIIsiof35F12Y-vIDLOomN2Q/formResponse";
        const formData = new FormData();
        
        // Перепроверьте ID полей этой новой формы с помощью экстрактора v2.0
        formData.append("entry.494673722", name);      
        formData.append("entry.1297089773", className); 
        formData.append("entry.152799977", score);     
        formData.append("entry.714264275", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
