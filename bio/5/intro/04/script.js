document.addEventListener("DOMContentLoaded", () => {
    let studentName = "";
    let studentClass = "";
    let activeQuestions = [];

    const authScreen = document.getElementById("auth-screen");
    const quizContainer = document.getElementById("quiz-container");
    const startBtn = document.getElementById("start-btn");
    const tasksArea = document.getElementById("dynamic-tasks-area");

    // ==========================================
    // ПОЛНАЯ БАЗА ДАННЫХ КОНТРОЛЬНОЙ (35 ВОПРОСОВ)
    // ==========================================
    const questionBank = [
        {
            id: 1,
            type: "radio",
            question: "Что изучает ботаника?",
            options: ["Грибы", "Животных", "Растения", "Бактерии"],
            answer: "Растения"
        },
        {
            id: 2,
            type: "radio",
            question: "Что изучает микология?",
            options: ["Грибы", "Животных", "Растения", "Бактерии"],
            answer: "Грибы"
        },
        {
            id: 3,
            type: "radio",
            question: "Какая наука изучает особенности жизнедеятельности живых организмов?",
            options: ["Анатомия", "Генетика", "Физиология", "Зоология", "Микология", "Ботаника", "Цитология", "Эмбриология"],
            answer: "Физиология"
        },
        {
            id: 4,
            type: "radio",
            question: "Водная оболочка Земли, заселённая живыми организмами, называется:",
            options: ["Атмосфера", "Биосфера", "Гидросфера", "Литосфера"],
            answer: "Гидросфера"
        },
        {
            id: 5,
            type: "radio",
            question: "Оболочка Земли, в состав которой входит почва, называется:",
            options: ["Атмосфера", "Биосфера", "Гидросфера", "Литосфера"],
            answer: "Литосфера"
        },
        {
            id: 6,
            type: "select",
            question: "Выберите верный термин из выпадающего списка:",
            textBefore: "",
            textAfter: " изучает отношения между организмами и окружающей средой.",
            options: ["цитология", "генетика", "ботаника", "зоология", "этология", "экология"],
            answer: "экология"
        },
        {
            id: 7,
            type: "radio",
            question: "Наука, изучающая строение и жизнедеятельность клетки, называется:",
            options: ["Анатомия", "Генетика", "Эмбриология", "Зоология", "Микология", "Ботаника", "Цитология", "Физиология"],
            answer: "Цитология"
        },
        {
            id: 8,
            type: "text",
            question: "Самостоятельно впишите пропущенный термин (первая буква служит подсказкой):",
            textBefore: "Разделом биологии является наука, которая изучает особенности строения объектов живой природы. Наука, изучающая общее строение организма, строение систем органов и каждого органа отдельно, называется а",
            textAfter: ".",
            answer: "натомия"
        },
        {
            id: 9,
            type: "radio_img",
            question: "Наука, объектом изучения которой является живой организм, изображённый на фотографии, называется:",
            img: "flower.jpg",
            options: ["Зоология", "Цитология", "Вирусология", "Микология", "Ботаника"],
            answer: "Ботаника"
        },
        {
            id: 10,
            type: "radio",
            question: "Наука, изучающая строение и жизнедеятельность растения, называется:",
            options: ["Анатомия", "Генетика", "Физиология", "Зоология", "Микология", "Ботаника", "Эмбриология"],
            answer: "Ботаника"
        },
        {
            id: 11,
            type: "radio_img",
            question: "Наука, объектом изучения которой является живой организм, изображённый на фотографии, называется:",
            img: "bird.png",
            options: ["Зоология", "Цитология", "Вирусология", "Микология", "Ботаника"],
            answer: "Зоология"
        },
        {
            id: 12,
            type: "radio_img",
            question: "Какие жизненные свойства объекта живой природы иллюстрирует фотография?",
            img: "rost.png",
            options: ["Рост и развитие", "Обмен веществ и дыхание", "Выделение и питание"],
            answer: "Рост и развитие"
        },
        {
            id: 13,
            type: "radio_img",
            question: "Какое жизненное свойство объекта живой природы иллюстрирует рисунок?",
            img: "cycle.png",
            options: ["Развитие", "Обмен веществ и дыхание", "Выделение и питание", "Рост"],
            answer: "Развитие"
        },
        {
            id: 14,
            type: "radio_img",
            question: "Какое жизненное свойство объекта живой природы иллюстрирует фотография?",
            img: "pit.png",
            options: ["Развитие", "Обмен веществ и дыхание", "Выделение", "Питание"],
            answer: "Питание"
        },
        {
            id: 15,
            type: "radio",
            question: "При выполнении эксперимента необходимо взять воды объёмом 100 мл, какое лабораторное оборудование можно использовать?",
            options: ["Весы", "Мензурка", "Воронка", "Предметное стекло"],
            answer: "Мензурка"
        },
        {
            id: 16,
            type: "strikeout",
            question: "Нажимайте на кнопки, чтобы вычеркнуть лишние элементы. Оставьте только единицы измерения роста (длины):",
            words: ["сантиметры", "литры", "метры", "граммы", "миллиметры", "килограммы", "миллилитры"],
            wrongAnswers: ["литры", "граммы", "килограммы", "миллилитры"]
        },
        {
            id: 17,
            type: "radio_img",
            question: "Определи единицу измерения величины, которую измеряет лабораторное оборудование, изображённое на фотографии:",
            img: "ves.png",
            options: ["Граммы", "Сантиметры", "Литры", "Метры"],
            answer: "Граммы"
        },
        {
            id: 18,
            type: "select",
            question: "Выберите верный термин из выпадающего списка:",
            textBefore: "Белого медведя в качестве объекта исследования изучает наука ",
            textAfter: ".",
            options: ["микология", "зоология", "ботаника", "цитология"],
            answer: "зоология"
        },
        {
            id: 19,
            type: "text",
            question: "Впишите термин самостоятельно (первая буква служит подсказкой):",
            textBefore: "В лесу часто можно встретить животных, которые в нём обитают. Можно увидеть зайца или найти следы волка. Всё в лесу взаимосвязано. Наука, которая изучает связи между всеми живыми организмами называется э",
            textAfter: ".",
            answer: "кология"
        },
        {
            id: 20,
            type: "match",
            question: "Соотнесите объекты живой природы и биологические науки (последовательными кликами):",
            pairs: {
                "клетки крови": "цитология",
                "ромашки": "ботаника",
                "цапля и лягушка": "экология",
                "барсук": "зоология"
            }
        },
        {
            id: 21,
            type: "radio",
            question: "Как называется непрерывный процесс, который обеспечивает поток энергии и веществ для жизнедеятельности организма?",
            options: ["Рост", "Развитие", "Дыхание", "Размножение", "Обмен веществ", "Раздражимость"],
            answer: "Обмен веществ"
        },
        {
            id: 22,
            type: "checkbox",
            question: "Выберите ВСЕ верные ответы. Какие свойства живого организма можно определить по увеличению размера и массы организма с возможным изменением его внешнего и внутреннего строения?",
            options: ["Выделение", "Рост", "Питание", "Развитие", "Дыхание"],
            answers: ["Рост", "Развитие"]
        },
        {
            id: 23,
            type: "radio",
            question: "Какое свойство живого организма можно определить при превращении гусеницы в бабочку?",
            options: ["Выделение", "Рост", "Питание", "Развитие", "Дыхание"],
            answer: "Развитие"
        },
        {
            id: 24,
            type: "sort_groups",
            question: "Распределите объекты по двум группам (кликните по слову, затем по нужной группе):",
            groups: ["Живая природа", "Неживая природа"],
            items: {
                "майский жук": "Живая природа",
                "дождевой червь": "Живая природа",
                "сова": "Живая природа",
                "камыш": "Живая природа",
                "лев": "Живая природа",
                "вода": "Неживая природа",
                "лёд": "Неживая природа",
                "кислород": "Неживая природа",
                "гранит": "Неживая природа",
                "скала": "Неживая природа",
                "мрамор": "Неживая природа"
            }
        },
        {
            id: 25,
            type: "radio",
            question: "Выберите объект НЕЖИВОЙ природы:",
            options: ["Вода", "Аист", "Антилопа", "Рожь"],
            answer: "Вода"
        },
        {
            id: 26,
            type: "sort_groups",
            question: "Распределите объекты по двум группам (кликните по слову, затем по нужной группе):",
            groups: ["Живая природа", "Неживая природа"],
            items: {
                "рыба в реке": "Живая природа",
                "лист на дереве": "Живая природа",
                "полынь в степи": "Живая природа",
                "песок": "Неживая природа",
                "галька": "Неживая природа",
                "гранит": "Неживая природа"
            }
        },
        {
            id: 27,
            type: "radio",
            question: "Какая наука изучает наследственность и изменчивость организмов?",
            options: ["Ботаника", "Зоология", "Генетика", "Физиология"],
            answer: "Генетика"
        },
        {
            id: 28,
            type: "radio",
            question: "Какая наука объясняет механизмы наследования цвета глаз у людей?",
            options: ["Анатомия", "Этология", "Генетика", "Физиология"],
            answer: "Генетика"
        },
        {
            id: 29,
            type: "match",
            question: "Соотнесите названия наук и их определения (последовательными кликами):",
            pairs: {
                "генетика": "наследственность и изменчивость",
                "эмбриология": "особенности индивидуального развития организмов",
                "физиология": "функции организмов и органов",
                "экология": "взаимодействие объектов живой и неживой природы"
            }
        },
        {
            id: 30,
            type: "checkbox",
            question: "Выберите ВСЕ верные ответы. К телам живой природы относятся:",
            options: ["Галька", "Собака", "Снежинки", "Бабочка", "Гусеница", "Песок"],
            answers: ["Собака", "Бабочка", "Гусеница"]
        },
        {
            id: 31,
            type: "match",
            question: "Соотнесите номер с порядком появления методов биологии (последовательными кликами):",
            pairs: {
                "1": "описание",
                "2": "наблюдение",
                "3": "эксперимент",
                "4": "моделирование"
            }
        },
        {
            id: 32,
            type: "lab_dropdowns",
            question: "Соотнесите изображения лабораторной посуды и подписи к ним, начиная с левого верхнего угла рисунка:",
            img: "lab_all.png",
            options: ["Штатив с пробирками", "Препаровальная игла", "Пипетка", "Воронка", "Колба плоскодонная", "Чашка Петри", "Мерный цилиндр"],
            answers: ["Штатив с пробирками", "Препаровальная игла", "Пипетка", "Воронка", "Колба плоскодонная", "Чашка Петри", "Мерный цилиндр"]
        },
        {
            id: 33,
            type: "radio",
            question: "Биология — это наука, изучающая:",
            options: ["строение объектов живой и неживой природы", "взаимодействие объектов живой и неживой природы", "жизнь во всех её проявлениях", "рациональные пути использования природных ресурсов"],
            answer: "жизнь во всех её проявлениях"
        },
        {
            id: 34,
            type: "radio",
            question: "Область распространения жизни на нашей планете составляет оболочка Земли, которую называют:",
            options: ["атмосферой", "гидросферой", "литосферой", "биосферой"],
            answer: "биосферой"
        },
        {
            id: 35,
            type: "radio_img",
            question: "Под какой цифрой изображён объект лабораторной посуды, с помощью которого можно измерить необходимый объём 30 мл?",
            img: "volume.png",
            options: ["5", "2", "3", "4"],
            answer: "3"
        }
    ];

    // ==========================================
    // ДИНАМИЧЕСКИЙ РЕНДЕРИНГ И ГЕНЕРАЦИЯ ВАРИАНТА
    // ==========================================
    startBtn.addEventListener("click", () => {
        studentName = document.getElementById("student-name").value.trim();
        studentClass = document.getElementById("student-class").value.trim();

        if (!studentName || !studentClass) {
            alert("Пожалуйста, заполните фамилию, имя и класс.");
            return;
        }

        authScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        window.scrollTo(0, 0);

        let shuffled = [...questionBank];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        activeQuestions = shuffled.slice(0, 15);
        renderQuiz();
    });

    function renderQuiz() {
        tasksArea.innerHTML = "";

        activeQuestions.forEach((q, index) => {
            const section = document.createElement("section");
            section.className = "task-card";
            section.id = `dynamic-task-${q.id}`;

            const h3 = document.createElement("h3");
            h3.textContent = `🌿 Задание ${index + 1}`;
            section.appendChild(h3);

            const pText = document.createElement("p");
            pText.className = "question-text";
            pText.textContent = q.question;
            section.appendChild(pText);

            // Подключение иллюстрации с обработкой ошибки загрузки
            if (q.img) {
                const imgWrap = document.createElement("div");
                imgWrap.className = "image-wrapper";
                const img = document.createElement("img");
                img.src = q.img;
                img.alt = "Иллюстрация к заданию";
                img.onerror = function() {
                    this.style.display = "none";
                    const placeholder = document.createElement("p");
                    placeholder.className = "img-placeholder";
                    placeholder.textContent = "🖼 Изображение недоступно";
                    imgWrap.appendChild(placeholder);
                };
                imgWrap.appendChild(img);
                section.appendChild(imgWrap);
            }

            // --- Радиокнопки ---
            if (q.type === "radio" || q.type === "radio_img") {
                const group = document.createElement("div");
                group.className = "radio-group";
                q.options.forEach(opt => {
                    const lbl = document.createElement("label");
                    lbl.className = "hl-radio";
                    lbl.innerHTML = `<input type="radio" name="q-${q.id}" value="${opt}"><span></span> ${opt}`;
                    group.appendChild(lbl);
                });
                section.appendChild(group);

            // --- Чекбоксы ---
            } else if (q.type === "checkbox") {
                const group = document.createElement("div");
                group.className = "checkbox-group";
                q.options.forEach(opt => {
                    const lbl = document.createElement("label");
                    lbl.className = "hl-checkbox";
                    lbl.innerHTML = `<input type="checkbox" name="q-${q.id}" value="${opt}"><span></span> ${opt}`;
                    group.appendChild(lbl);
                });
                section.appendChild(group);

            // --- Выпадающие списки ---
            } else if (q.type === "select") {
                const div = document.createElement("div");
                div.className = "select-gaps";
                let selectHtml = `<select class="hl-select" id="select-${q.id}"><option value="" disabled selected>...</option>`;
                q.options.forEach(opt => { selectHtml += `<option value="${opt}">${opt}</option>`; });
                selectHtml += `</select>`;
                div.innerHTML = `<p>${q.textBefore}${selectHtml}${q.textAfter}</p>`;
                section.appendChild(div);

            // --- Текстовый ввод ---
            } else if (q.type === "text") {
                const div = document.createElement("div");
                div.className = "text-inputs-block";
                div.innerHTML = `<p>${q.textBefore}<input type="text" class="hl-input-inline" id="input-${q.id}" placeholder="..." autocomplete="off">${q.textAfter}</p>`;
                section.appendChild(div);

            // --- Вычёркивание слов ---
            } else if (q.type === "strikeout") {
                const div = document.createElement("div");
                div.className = "drag-words-container";
                q.words.forEach(word => {
                    const btn = document.createElement("span");
                    btn.className = "drag-word";
                    btn.textContent = word;
                    btn.addEventListener("click", () => {
                        btn.classList.toggle("matched");
                    });
                    div.appendChild(btn);
                });
                section.appendChild(div);

            // --- Сопоставление пар ---
            } else if (q.type === "match") {
                const container = document.createElement("div");
                container.className = "match-container";

                const leftCol = document.createElement("div");
                leftCol.className = "match-col";
                const rightCol = document.createElement("div");
                rightCol.className = "match-col";

                const leftKeys = Object.keys(q.pairs);
                const rightVals = [...Object.values(q.pairs)].sort(() => Math.random() - 0.5);

                let selectedLeft = null;

                leftKeys.forEach(k => {
                    const item = document.createElement("div");
                    item.className = "match-item";
                    item.textContent = k;
                    item.addEventListener("click", () => {
                        if (item.classList.contains("matched")) return;
                        leftCol.querySelectorAll(".match-item").forEach(i => i.classList.remove("selected"));
                        selectedLeft = item;
                        item.classList.add("selected");
                    });
                    leftCol.appendChild(item);
                });

                rightVals.forEach(v => {
                    const target = document.createElement("div");
                    target.className = "match-target";
                    target.textContent = v;

                    target.addEventListener("click", () => {
                        // Повторный клик по соединённому элементу — отменяем пару
                        if (target.classList.contains("matched")) {
                            const prevLeft = target.dataset.userAnswer;
                            target.classList.remove("matched");
                            delete target.dataset.userAnswer;
                            leftCol.querySelectorAll(".match-item").forEach(li => {
                                if (li.textContent.trim() === prevLeft) {
                                    li.classList.remove("matched");
                                }
                            });
                            return;
                        }
                        if (!selectedLeft) return;

                        target.dataset.userAnswer = selectedLeft.textContent.trim();
                        target.classList.add("matched");
                        selectedLeft.classList.add("matched");
                        selectedLeft.classList.remove("selected");
                        selectedLeft = null;
                    });
                    rightCol.appendChild(target);
                });

                container.appendChild(leftCol);
                container.appendChild(rightCol);
                section.appendChild(container);

            // --- Распределение по группам ---
            } else if (q.type === "sort_groups") {
                const wrap = document.createElement("div");

                const wordsDiv = document.createElement("div");
                wordsDiv.className = "drag-words-container";
                wordsDiv.style.marginBottom = "15px";

                const groupsDiv = document.createElement("div");
                groupsDiv.className = "match-container";

                let selectedWordBtn = null;

                // Перемешиваем слова для разнообразия
                const shuffledWords = [...Object.keys(q.items)].sort(() => Math.random() - 0.5);

                shuffledWords.forEach(word => {
                    const btn = document.createElement("span");
                    btn.className = "drag-word";
                    btn.textContent = word;
                    btn.addEventListener("click", () => {
                        wordsDiv.querySelectorAll(".drag-word").forEach(w => w.classList.remove("selected"));
                        selectedWordBtn = btn;
                        btn.classList.add("selected");
                    });
                    wordsDiv.appendChild(btn);
                });

                q.groups.forEach(gName => {
                    const box = document.createElement("div");
                    box.className = "sort-group-box";
                    box.innerHTML = `<strong>${gName}</strong><div class="box-content"></div>`;

                    box.addEventListener("click", () => {
                        if (!selectedWordBtn) return;
                        const txt = selectedWordBtn.textContent;
                        if (!box.dataset.answers) box.dataset.answers = "";
                        box.dataset.answers += txt + "|";
                        box.querySelector(".box-content").innerHTML += txt + "<br>";
                        selectedWordBtn.remove();
                        selectedWordBtn = null;
                    });
                    groupsDiv.appendChild(box);
                });

                wrap.appendChild(wordsDiv);
                wrap.appendChild(groupsDiv);
                section.appendChild(wrap);

            // --- Лабораторная посуда со списками ---
            } else if (q.type === "lab_dropdowns") {
                const div = document.createElement("div");
                div.className = "select-gaps lab-dropdowns-block";

                q.answers.forEach((ans, aIdx) => {
                    let shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
                    let selectHtml = `<select class="hl-select" id="lab-sel-${q.id}-${aIdx}">`;
                    selectHtml += `<option value="" disabled selected>...</option>`;
                    shuffledOptions.forEach(opt => {
                        selectHtml += `<option value="${opt}">${opt}</option>`;
                    });
                    selectHtml += `</select>`;
                    div.innerHTML += `<p>№${aIdx + 1}: ${selectHtml}</p>`;
                });
                section.appendChild(div);
            }

            tasksArea.appendChild(section);
        });
    }

    // ==========================================
    // ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        activeQuestions.forEach(q => {
            if (q.type === "radio" || q.type === "radio_img") {
                const selected = document.querySelector(`input[name="q-${q.id}"]:checked`);
                if (selected && selected.value === q.answer) totalScore += 1;

            } else if (q.type === "checkbox") {
                const checked = Array.from(document.querySelectorAll(`input[name="q-${q.id}"]:checked`)).map(el => el.value);
                if (checked.length === q.answers.length && checked.every(val => q.answers.includes(val))) totalScore += 1;

            } else if (q.type === "select") {
                const val = document.getElementById(`select-${q.id}`).value;
                if (val === q.answer) totalScore += 1;

            } else if (q.type === "text") {
                const val = document.getElementById(`input-${q.id}`).value.trim().toLowerCase();
                if (val === q.answer) totalScore += 1;

            } else if (q.type === "strikeout") {
                const cards = document.querySelectorAll(`#dynamic-task-${q.id} .drag-word`);
                let correctStrikeout = true;
                cards.forEach(card => {
                    const txt = card.textContent;
                    const isStruck = card.classList.contains("matched");
                    const isWrongWord = q.wrongAnswers.includes(txt);
                    if ((isWrongWord && !isStruck) || (!isWrongWord && isStruck)) {
                        correctStrikeout = false;
                    }
                });
                if (correctStrikeout) totalScore += 1;

            } else if (q.type === "match") {
                let correctMatch = true;
                const targets = document.querySelectorAll(`#dynamic-task-${q.id} .match-target`);
                let count = 0;
                targets.forEach(t => {
                    if (t.classList.contains("matched")) {
                        count++;
                        const uAns = (t.dataset.userAnswer || "").trim();
                        const tText = t.textContent.trim();
                        if (q.pairs[uAns] !== tText) correctMatch = false;
                    } else {
                        correctMatch = false;
                    }
                });
                if (count === Object.keys(q.pairs).length && correctMatch) totalScore += 1;

            } else if (q.type === "sort_groups") {
                let correctSort = true;
                const targets = document.querySelectorAll(`#dynamic-task-${q.id} .sort-group-box`);
                targets.forEach(box => {
                    const gName = box.querySelector("strong").textContent;
                    const rawAnswers = box.dataset.answers || "";
                    const userItems = rawAnswers.split("|").filter(x => x !== "");
                    const expectedItems = Object.keys(q.items).filter(k => q.items[k] === gName);
                    if (userItems.length !== expectedItems.length || !userItems.every(item => q.items[item] === gName)) {
                        correctSort = false;
                    }
                });
                if (correctSort) totalScore += 1;

            } else if (q.type === "lab_dropdowns") {
                let correctLab = true;
                q.answers.forEach((ans, aIdx) => {
                    const val = document.getElementById(`lab-sel-${q.id}-${aIdx}`).value;
                    if (val !== ans) correctLab = false;
                });
                if (correctLab) totalScore += 1;
            }
        });

        let finalGrade = "2";
        if (totalScore >= 14) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 11) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore >= 8) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }

        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;
        document.getElementById("res-grade").textContent = finalGrade;
        document.getElementById("result-screen").classList.remove("hidden");

        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    // ==========================================
    // ПЕРЕДАЧА ДАННЫХ В GOOGLE ТАБЛИЦУ
    // ==========================================
    function sendToGoogleForm(name, className, score, finalGrade) {
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSeQYfLz5xdvx5gYuFMm1yQVzwXXZnaXez20M0Rn25SAo9HhSg/formResponse";
        const formData = new FormData();
        formData.append("entry.1912567859", name);
        formData.append("entry.564776308", className);
        formData.append("entry.797116085", score);
        formData.append("entry.1610844367", finalGrade);

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
