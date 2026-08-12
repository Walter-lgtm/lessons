document.addEventListener("DOMContentLoaded", () => {
    // Данные ученика и рабочий пул теста
    let studentName = "";
    let studentClass = "";
    let currentVariantTasks = [];

    // Элементы интерфейса
    const authScreen = document.getElementById("auth-screen");
    const quizContainer = document.getElementById("quiz-container");
    const startBtn = document.getElementById("start-btn");
    const inputName = document.getElementById("student-name");
    const inputClass = document.getElementById("student-class");
    const tasksHolder = document.getElementById("dynamic-tasks-holder");
    const submitBtn = document.getElementById("submit-quiz-btn");

    // ========================================================
    // ПОЛНАЯ БАЗА ДАННЫХ ЗАДАНИЙ (ЧАСТЬ 1)
    // ========================================================
    const tasksData = [
        // --- Вопросы типа RADIO (Одиночный выбор) ---
        {
            id: "src_1",
            type: "radio",
            question: "Для измерения массы тела используют:",
            options: ["термометр", "часы", "весы", "линейку"],
            answer: "весы"
        },
        {
            id: "src_2",
            type: "radio",
            question: "С помощью какого метода биологии можно изучать сезонные явления в природе, например листопад?",
            options: ["Измерения", "Наблюдения", "Моделирования", "Проведения опытов", "Эксперимента", "Палеонтологического"],
            answer: "Наблюдения"
        },
        {
            id: "src_3",
            type: "radio",
            question: "Полученные в ходе наблюдения ответы на поставленные вопросы отмечают:",
            options: ["в дневнике погоды", "в дневнике наблюдений", "в тетради измерений"],
            answer: "в дневнике наблюдений"
        },
        {
            id: "src_4",
            type: "radio",
            question: "Какой метод биологии основан на определении числового значения величины объекта или явления?",
            options: ["Наблюдение", "Измерение", "Описание", "Эксперимент"],
            answer: "Измерение"
        },
        {
            id: "src_5",
            type: "radio",
            question: "Для измерения массы семян пшеницы используют лабораторное оборудование:",
            options: ["Линейка", "Секундомер", "Мерный стакан", "Термометр", "Весы", "Мерный цилиндр"],
            image: "bio_01.jpeg",
            answer: "Весы"
        },
        {
            id: "src_6",
            type: "radio",
            question: "Определи по рисунку объём яблока, если изначально в мерном стакане было воды 200 мл.",
            options: ["150 мл", "200 мл", "300 мл"],
            image: "bio_03.jpeg",
            answer: "150 мл"
        },
        {
            id: "src_7",
            type: "radio",
            question: "Исследование, проводимое в специально созданных и контролируемых условиях, которые позволяют установить, как эти условия влияют на объект или явление:",
            options: ["Наблюдение", "Описание", "Эксперимент", "Измерение"],
            answer: "Эксперимент"
        },
        {
            id: "src_8",
            type: "radio",
            question: "С каким учёным связано понятие «эксперимент»?",
            options: ["Дарвин", "Аристотель", "Гарвей", "Гиппократ"],
            answer: "Гарвей"
        },
        {
            id: "src_9",
            type: "radio",
            question: "С какого этапа начинается научное исследование?",
            options: ["Обобщение полученных результатов", "Выдвижение гипотезы", "Разработка и проведение эксперимента", "Наблюдение за объектом или явлением", "Постановка проблемы"],
            answer: "Наблюдение за объектом или явлением"
        },
        {
            id: "src_10",
            type: "radio",
            question: "Какой метод биологии позволяет показать наглядно климатические изменения на Земле в будущем?",
            options: ["Описание", "Эксперимент", "Измерение", "Моделирование"],
            answer: "Моделирование"
        }
    ];
  // ========================================================
    // ПОЛНАЯ БАЗА ДАННЫХ ЗАДАНИЙ (ЧАСТЬ 2 — ДОПИСЫВАЕМ В МАССИВ tasksData)
    // ========================================================
    tasksData.push(
        // --- Вопросы типа CHECKBOX (Множественный выбор) ---
        {
            id: "src_11",
            type: "checkbox",
            question: "Что из перечисленного биологи относят к фиксированным объектам?",
            options: ["Чучела животных", "Белый медведь в зоопарке", "Гербарий", "Цветы на клумбе", "Постоянные препараты", "Куст жасмина в саду"],
            answer: ["Чучела животных", "Гербарий", "Постоянные препараты"]
        },
        {
            id: "src_12",
            type: "checkbox",
            question: "Какое оборудование НЕ используют при измерении объёма?",
            options: ["Линейка", "Весы", "Мерный стакан", "Мензурка", "Колба с делениями", "Рулетка"],
            answer: ["Линейка", "Весы", "Рулетка"]
        },
        {
            id: "src_13",
            type: "checkbox",
            question: "Гипотеза, которая была проверена и оказалась соответствующей фактам, может стать:",
            options: ["Теорией", "Предположением", "Законом", "Выводом"],
            answer: ["Теорией", "Законом"]
        },

        // --- Вопросы типа SELECT (Выпадающие списки в тексте) ---
        {
            id: "src_14",
            type: "select",
            question: "Выбери верные биологические термины для заполнения пропусков:",
            textTemplate: "Научные предположения — {gap_0}. Гипотезы могут быть {gap_1}. Гипотезы могут быть {gap_2}. Гипотезы могут быть основанием для проведения {gap_3}.",
            gaps: [
                { options: ["гипотезы", "теоремы", "законы"], correct: "гипотезы" },
                { options: ["подтверждены", "нарисованы", "прорешены"], correct: "подтверждены" },
                { options: ["нарисованы", "прорешены", "опровергнуты"], correct: "опровергнуты" },
                { options: ["наблюдения", "эксперимента", "измерения"], correct: "эксперимента" }
            ]
        },
        {
            id: "src_15",
            type: "select",
            question: "Определи фундаментальное научное понятие:",
            textTemplate: "{gap_0} — это расчленение, разделение целого на составные части, выделение отдельных сторон и свойств объекта или явления.",
            gaps: [
                { options: ["Анализ", "Гипотеза", "Теория"], correct: "Анализ" }
            ]
        },
        {
            id: "src_16",
            type: "select",
            question: "Вставь пропущенный термин в определение метода:",
            textTemplate: "Исследование, проводимое в специально созданных и контролируемых условиях, которые позволяют установить, как эти условия влияют на объект или явление, называют {gap_0}.",
            gaps: [
                { options: ["экспериментом", "наблюдением", "описанием", "измерением"], correct: "экспериментом" }
            ]
        },

        // --- Вопросы типа TEXT (Ручной ввод в инлайновые текстовые инпуты) ---
        {
            id: "src_17",
            type: "text",
            question: "Допиши верные термины самостоятельно:",
            textTemplate: "Научный эксперимент должен непременно сопровождаться {input_0} {input_1}, условия которого отличаются от условий эксперимента одним фактором.",
            inputs: [
                { placeholder: "контрольным...", correctStart: "контрол" },
                { placeholder: "опытом...", correctStart: "опыт" }
            ]
        },
        {
            id: "src_18",
            type: "text",
            question: "Заполни пропуски в научных понятиях:",
            textTemplate: "{input_0} — графическое представление данных, позволяющее оценить соотношение нескольких величин. Способы оформления результатов наблюдений называются {input_1} {input_2}.",
            image: "bio_04.jpeg",
            inputs: [
                { placeholder: "д...", correctStart: "диаграмм" },
                { placeholder: "б...", correctStart: "биолог" }, // Примет "биологических", "биологическим" и т.д.
                { placeholder: "р...", correctStart: "результат" } // Примет "результатов"
            ]
        }
    );
  // ========================================================
    // 3. АЛГОРИТМ РАНДОМИЗАЦИИ И СТАРТ ТЕСТА
    // ========================================================
    // Функция перемешивания массива (Алгоритм Фишера-Йетса)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startBtn.addEventListener("click", () => {
        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();

        if (!studentName || !studentClass) {
            alert("ВНИМАНИЕ! Доступ заблокирован. Введите ФИО и Класс для генерации варианта.");
            return;
        }

        // Перемешиваем всю базу данных и забираем первые 10 уникальных заданий
        const shuffled = shuffleArray([...tasksData]);
        currentVariantTasks = shuffled.slice(0, 10);

        // Отрисовываем вариант на экране
        renderVariant(currentVariantTasks);

        authScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        window.scrollTo(0, 0);
    });

    // ========================================================
    // 4. ДВИЖОК ДИНАМИЧЕСКОГО РЕНДЕРИНГА UI
    // ========================================================
    function renderVariant(tasks) {
        tasksHolder.innerHTML = ""; // Очищаем контейнер

        tasks.forEach((task, index) => {
            // Создаем карточку задания
            const card = document.createElement("section");
            card.className = "task-card";
            card.dataset.id = task.id;
            card.dataset.type = task.type;

            // Формируем заголовок вопроса
            let htmlContent = `<h3>[λ] Задание ${index + 1}. ${task.question}</h3>`;

            // Если у задания есть изображение, подтягиваем его
            if (task.image) {
                htmlContent += `
                    <div class="image-host-container">
                        <img src="${task.image}" alt="Иллюстрация к заданию" class="task-img">
                    </div>
                `;
            }

            // Генерируем интерактивную часть в зависимости от типа механики
            if (task.type === "radio") {
                htmlContent += `<div class="radio-group">`;
                task.options.forEach(opt => {
                    htmlContent += `
                        <label class="hl-radio">
                            <input type="radio" name="dynamic_q_${index}" value="${opt}">
                            <span></span> ${opt}
                        </label>
                    `;
                });
                htmlContent += `</div>`;

            } else if (task.type === "checkbox") {
                htmlContent += `<div class="checkbox-group">`;
                task.options.forEach(opt => {
                    htmlContent += `
                        <label class="hl-checkbox">
                            <input type="checkbox" name="dynamic_q_${index}" value="${opt}">
                            <span></span> ${opt}
                        </label>
                    `;
                });
                htmlContent += `</div>`;

            } else if (task.type === "select") {
                htmlContent += `<div class="select-text-gaps"><p>`;
                let replacedText = task.textTemplate;
                
                task.gaps.forEach((gap, gapIdx) => {
                    let selectHtml = `
                        <select class="hl-select" data-correct="${gap.correct}">
                            <option value="" selected disabled>-- выбрать --</option>
                    `;
                    gap.options.forEach(opt => {
                        selectHtml += `<option value="${opt}">${opt}</option>`;
                    });
                    selectHtml += `</select>`;
                    
                    replacedText = replacedText.replace(`{gap_${gapIdx}}`, selectHtml);
                });
                
                htmlContent += replacedText + `</p></div>`;

            } else if (task.type === "text") {
                htmlContent += `<div class="select-text-gaps"><p>`;
                let replacedText = task.textTemplate;
                
                task.inputs.forEach((inputData, inputIdx) => {
                    const inputHtml = `
                        <input type="text" class="hl-inline-input" 
                               placeholder="${inputData.placeholder}" 
                               data-start="${inputData.correctStart}" 
                               autocomplete="off">
                    `;
                    replacedText = replacedText.replace(`{input_${inputIdx}}`, inputHtml);
                });
                
                htmlContent += replacedText + `</p></div>`;
            }

            card.innerHTML = htmlContent;
            tasksHolder.appendChild(card);
        });
    }
  // ========================================================
    // 5. УНИВЕРСАЛЬНЫЙ ВАЛИДАТОР И ОТПРАВКА НА СЕРВЕР
    // ========================================================
    submitBtn.addEventListener("click", () => {
        let totalScore = 0;
        const cards = document.querySelectorAll(".task-card");

        cards.forEach((card, index) => {
            const type = card.dataset.type;

            if (type === "radio") {
                // Валидация одиночного выбора
                const selected = card.querySelector('input[type="radio"]:checked');
                const taskData = currentVariantTasks[index];
                if (selected && selected.value === taskData.answer) {
                    totalScore += 1;
                }

            } else if (type === "checkbox") {
                // Валидация множественного выбора
                const checkedValues = Array.from(card.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
                const taskData = currentVariantTasks[index];
                
                if (checkedValues.length === taskData.answer.length && 
                    checkedValues.every(val => taskData.answer.includes(val))) {
                    totalScore += 1;
                }

            } else if (type === "select") {
                // Валидация всех выпадающих списков внутри карточки
                let allSelectsCorrect = true;
                const selects = card.querySelectorAll(".hl-select");
                
                selects.forEach(select => {
                    if (select.value !== select.dataset.correct) {
                        allSelectsCorrect = false;
                    }
                });
                
                // Если хоть один список не выбран или выбран неверно — балл не даем
                if (selects.length > 0 && allSelectsCorrect) {
                    totalScore += 1;
                }

            } else if (type === "text") {
                // Валидация всех инлайновых текстовых полей с защитой от падежей
                let allInputsCorrect = true;
                const inputs = card.querySelectorAll(".hl-inline-input");
                
                inputs.forEach(input => {
                    const userVal = input.value.trim().toLowerCase();
                    const correctStart = input.dataset.start;
                    
                    if (!userVal.startsWith(correctStart)) {
                        allInputsCorrect = false;
                    }
                });
                
                if (inputs.length > 0 && allInputsCorrect) {
                    totalScore += 1;
                }
            }
        });

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Классическая шкала Чёрной Мезы для 10-балльной проверочной работы
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

        // Отправка зашифрованного пакета логов в Google Формы
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL вашей опубликованной Google Формы в кавычках ниже
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfE1OQQKRk4HZOcxn4uRWhx63cy544tohnEpyKSnBQYMXWqVw/formResponse";
        const formData = new FormData();
        
        // Замените "entry.XXXXX" на реальные ID полей, собранные через F12
        formData.append("entry.1707461033", name);      
        formData.append("entry.1135356935", className); 
        formData.append("entry.2046045047", score);     
        formData.append("entry.697717829", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
