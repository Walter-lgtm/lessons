document.addEventListener("DOMContentLoaded", () => {

    // ====== Глобальные переменные ======
    let studentName = "";
    let studentClass = "";

    const authScreen = document.getElementById("auth-screen");
    const quizContainer = document.getElementById("quiz-container");
    const startBtn = document.getElementById("start-btn");
    const inputName = document.getElementById("student-name");
    const inputClass = document.getElementById("student-class");
    const resultScreen = document.getElementById("result-screen");
    const backBtn = document.getElementById("back-btn");

    // ====== 1. Регистрация и старт ======
    startBtn.addEventListener("click", () => {
        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();

        if (!studentName || !studentClass) {
            alert("Пожалуйста, заполните фамилию, имя и класс.");
            return;
        }

        authScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        window.scrollTo(0, 0);
    });

    // ====== 2. Сопоставление пар (Задание 1) ======
    let selectedLeftItem = null;
    const leftItems = document.querySelectorAll("#left-col .match-item");
    const rightTargets = document.querySelectorAll("#right-col .match-target");

    leftItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return;
            leftItems.forEach(i => i.classList.remove("selected"));
            selectedLeftItem = item;
            item.classList.add("selected");
        });
    });

    rightTargets.forEach(target => {
        target.addEventListener("click", () => {
            if (target.classList.contains("matched") || !selectedLeftItem) return;
            target.dataset.userAnswer = selectedLeftItem.dataset.id;
            target.classList.add("matched");
            selectedLeftItem.classList.add("matched");
            selectedLeftItem.classList.remove("selected");
            selectedLeftItem = null;
        });

        target.addEventListener("dblclick", () => {
            if (!target.classList.contains("matched")) return;
            const savedId = target.dataset.userAnswer;
            const relatedLeftItem = document.querySelector(
                `#left-col .match-item[data-id="${savedId}"]`
            );
            if (relatedLeftItem) {
                relatedLeftItem.classList.remove("matched");
            }
            target.classList.remove("matched");
            delete target.dataset.userAnswer;
        });
    });

    // ====== 3. Drag-and-drop (Задание 4) — с возвратом слов ======
    let draggedElement = null;

    function makeDraggable(word) {
        word.addEventListener("dragstart", (e) => {
            draggedElement = word;
            word.classList.add("dragging");
            e.dataTransfer.setData("text/plain", word.dataset.word);
            e.dataTransfer.effectAllowed = "move";
        });
        word.addEventListener("dragend", () => {
            word.classList.remove("dragging");
            draggedElement = null;
        });
    }

    function initDragAndDrop() {
        const wordsContainer = document.getElementById("words-t4");
        const words = document.querySelectorAll(".drag-word");
        const gaps = document.querySelectorAll(".drop-gap");

        words.forEach(w => makeDraggable(w));

        // Контейнер слов — принимаем возврат
        wordsContainer.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            wordsContainer.classList.add("drag-over");
        });
        wordsContainer.addEventListener("dragleave", () => {
            wordsContainer.classList.remove("drag-over");
        });
        wordsContainer.addEventListener("drop", (e) => {
            e.preventDefault();
            wordsContainer.classList.remove("drag-over");
            if (!draggedElement) return;
            // Перемещаем элемент обратно в контейнер
            wordsContainer.appendChild(draggedElement);
            draggedElement = null;
        });

        gaps.forEach(gap => {
            gap.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                gap.classList.add("drag-over");
            });
            gap.addEventListener("dragleave", () => {
                gap.classList.remove("drag-over");
            });
            gap.addEventListener("drop", (e) => {
                e.preventDefault();
                gap.classList.remove("drag-over");
                if (!draggedElement) return;

                // Если в пропуске уже было слово — возвращаем его в контейнер
                if (gap.classList.contains("filled")) {
                    const oldWord = gap.querySelector(".drag-word");
                    if (oldWord) {
                        oldWord.classList.remove("in-gap");
                        wordsContainer.appendChild(oldWord);
                    }
                    gap.classList.remove("filled");
                }

                // Помещаем новое слово в пропуск
                gap.appendChild(draggedElement);
                draggedElement.classList.add("in-gap");
                gap.classList.add("filled");
                draggedElement = null;
            });
        });
    }

    initDragAndDrop();

    // ====== 4. Проверка ответов и подсчёт ======
    const submitBtn = document.getElementById("submit-quiz-btn");

    // Данные правильных ответов и пояснений
    const taskData = {
        task1: {
            title: "Задание 1. Соотнеси науки с объектами изучения",
            type: "match",
            correct: {
                botany: "Растения",
                genetics: "Наследственность и изменчивость",
                zoology: "Животные",
                mycology: "Грибы",
                cytology: "Клетка"
            },
            explanation: "Ботаника — растения, зоология — животные, микология — грибы, цитология — клетка, генетика — наследственность и изменчивость. Каждая наука изучает свою группу живых организмов или их свойство."
        },
        task2: {
            title: "Задание 2. Выбери верный ответ",
            type: "select",
            correct: { s1: "Биология", s2: "учёными", s3: "наука" },
            explanation: "Биология изучает живую природу. Людей, занимающихся наукой, называют учёными. Наука — способ познания окружающего мира."
        },
        task3: {
            title: "Задание 3. Какая наука изучает индивидуальное развитие организмов?",
            type: "radio",
            correct: "Эмбриология",
            explanation: "Эмбриология изучает развитие зародыша — от оплодотворения до рождения. Это индивидуальное развитие организма."
        },
        task4: {
            title: "Задание 4. Вставь названия профессий",
            type: "drag",
            correct: { gap1: "Ветеринар", gap2: "Агроном" },
            explanation: "Ветеринар лечит животных и занимается их разведением. Агроном — специалист в области земледелия, выращивания растений."
        },
        task5: {
            title: "Задание 5. Наука, наиболее связанная с биологией",
            type: "radio",
            correct: "Химия",
            explanation: "Химия тесно связана с биологией: все живые организмы состоят из химических веществ, и процессы жизнедеятельности — это химические реакции."
        },
        task6: {
            title: "Задание 6. Лабораторная посуда для измерения объёма",
            type: "checkbox",
            correct: ["Мерный цилиндр"],
            explanation: "Для измерения объёма жидкости используют мерный цилиндр — на нём есть деления с указанием объёма. Воронка, колба, чашки Петри не предназначены для точного измерения."
        },
        task7: {
            title: "Задание 7. Правила поведения в лаборатории",
            type: "checkbox",
            correct: ["2", "3", "5"],
            explanation: "В лаборатории нельзя нюхать незнакомые вещества (2), после работы приборы нужно вернуть на место (3), а во время практической — точно следовать указаниям учителя (5). Принимать пищу, пить из лабораторной посуды и трогать приборы без разрешения — нельзя."
        },
        task8: {
            title: "Задание 8. Факты о лабораторной посуде и оборудовании",
            type: "checkbox",
            correct: ["2", "4", "5"],
            explanation: "Воронки используют для переливания жидкостей (2), пипетки — для отбора определённого количества жидкости (4), шпатели — для перенесения твёрдых веществ (5). Оборудование делают не только из металла, посуду — не только из обычного стекла, а чашка Петри — плоская, а не высокая."
        },
        task9: {
            title: "Задание 9. Заполни пропуски",
            type: "text",
            correct: {
                i1: "изнь",
                i2: ["уше", "уши"],
                i3: ["оде", "одной", "одушно-наземной"],
                i4: "очве",
                i5: ["иосферу", "иосфера"]
            },
            explanation: "Биология изучает живую природу (жизнь). Живые организмы обитают на суше, в воде, в почве. Область распространения жизни — биосфера."
        }
    };

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;
        const results = {};

        // --- Задание 1 ---
        let t1Correct = true;
        let t1Matched = 0;
        let t1UserAnswers = {};
        document.querySelectorAll("#right-col .match-target").forEach(target => {
            if (target.classList.contains("matched")) {
                t1Matched++;
                t1UserAnswers[target.dataset.id] = target.dataset.userAnswer || "—";
                if (target.dataset.id !== target.dataset.userAnswer) t1Correct = false;
            } else {
                t1Correct = false;
                t1UserAnswers[target.dataset.id] = "—";
            }
        });
        if (t1Matched === 5 && t1Correct) totalScore += 1;
        results.task1 = { correct: t1Correct, userAnswers: t1UserAnswers };

        // --- Задание 2 ---
        const s1 = document.getElementById("t2-select1").value;
        const s2 = document.getElementById("t2-select2").value;
        const s3 = document.getElementById("t2-select3").value;
        let t2Correct = (s1 === "Биология" && s2 === "учёными" && s3 === "наука");
        if (t2Correct) totalScore += 1;
        results.task2 = { correct: t2Correct, userAnswers: { s1: s1 || "—", s2: s2 || "—", s3: s3 || "—" } };

        // --- Задание 3 ---
        const t3Selected = document.querySelector('input[name="q3"]:checked');
        let t3Val = t3Selected ? t3Selected.value : "—";
        let t3Correct = (t3Val === "Эмбриология");
        if (t3Correct) totalScore += 1;
        results.task3 = { correct: t3Correct, userAnswer: t3Val };

        // --- Задание 4 ---
        let t4Correct = true;
        let t4UserAnswers = [];
        let t4Gaps = document.querySelectorAll("#task4 .drop-gap");
        t4Gaps.forEach((gap, idx) => {
            const word = gap.querySelector(".drag-word");
            const val = word ? word.dataset.word : "—";
            t4UserAnswers.push(val);
            if (val !== gap.dataset.answer) t4Correct = false;
        });
        if (t4Correct) totalScore += 1;
        results.task4 = { correct: t4Correct, userAnswers: t4UserAnswers };

        // --- Задание 5 ---
        const t5Selected = document.querySelector('input[name="q5"]:checked');
        let t5Val = t5Selected ? t5Selected.value : "—";
        let t5Correct = (t5Val === "Химия");
        if (t5Correct) totalScore += 1;
        results.task5 = { correct: t5Correct, userAnswer: t5Val };

        // --- Задание 6 ---
        const t6Answers = Array.from(document.querySelectorAll('input[name="q6"]:checked')).map(el => el.value);
        let t6Correct = (t6Answers.length === 1 && t6Answers[0] === "Мерный цилиндр");
        if (t6Correct) totalScore += 1;
        results.task6 = { correct: t6Correct, userAnswers: t6Answers };

        // --- Задание 7 ---
        const t7Answers = Array.from(document.querySelectorAll('input[name="q7"]:checked')).map(el => el.value);
        const t7CorrectSet = ["2", "3", "5"];
        let t7Correct = (t7Answers.length === 3 && t7Answers.every(v => t7CorrectSet.includes(v)));
        if (t7Correct) totalScore += 1;
        results.task7 = { correct: t7Correct, userAnswers: t7Answers };

        // --- Задание 8 ---
        const t8Answers = Array.from(document.querySelectorAll('input[name="q8"]:checked')).map(el => el.value);
        const t8CorrectSet = ["2", "4", "5"];
        let t8Correct = (t8Answers.length === 3 && t8Answers.every(v => t8CorrectSet.includes(v)));
        if (t8Correct) totalScore += 1;
        results.task8 = { correct: t8Correct, userAnswers: t8Answers };

        // --- Задание 9 ---
        const i1 = document.getElementById("t9-i1").value.trim().toLowerCase();
        const i2 = document.getElementById("t9-i2").value.trim().toLowerCase();
        const i3 = document.getElementById("t9-i3").value.trim().toLowerCase();
        const i4 = document.getElementById("t9-i4").value.trim().toLowerCase();
        const i5 = document.getElementById("t9-i5").value.trim().toLowerCase();

        const ok1 = (i1 === "изнь");
        const ok2 = (i2 === "уше" || i2 === "уши");
        const ok3 = (i3 === "оде" || i3 === "одной" || i3 === "одушно-наземной");
        const ok4 = (i4 === "очве");
        const ok5 = (i5 === "иосферу" || i5 === "иосфера");

        let t9Correct = (ok1 && ok2 && ok3 && ok4 && ok5);
        if (t9Correct) totalScore += 1;
        results.task9 = {
            correct: t9Correct,
            userAnswers: {
                i1: i1 || "—",
                i2: i2 || "—",
                i3: i3 || "—",
                i4: i4 || "—",
                i5: i5 || "—"
            }
        };

        // --- Оценка ---
        let finalGrade = "2 (Неудовл.)";
        if (totalScore >= 8) finalGrade = "5 (Отлично)";
        else if (totalScore >= 6) finalGrade = "4 (Хорошо)";
        else if (totalScore >= 4) finalGrade = "3 (Удовл.)";

        // --- Вывод результатов ---
        quizContainer.classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;
        document.getElementById("res-grade").textContent = finalGrade;

        // --- Детальный разбор ---
        renderDetailedResults(results, taskData);

        resultScreen.classList.remove("hidden");
        window.scrollTo(0, 0);

        // --- Отправка в Google Таблицу ---
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    // ====== 5. Отрисовка детального разбора ======
    function renderDetailedResults(results, data) {
        const container = document.getElementById("detailed-results");
        container.innerHTML = "";

        for (let i = 1; i <= 9; i++) {
            const key = "task" + i;
            const r = results[key];
            const d = data[key];
            const statusClass = r.correct ? "correct" : "incorrect";
            const statusIcon = r.correct ? "✓" : "✗";
            const statusText = r.correct ? "Верно" : "Ошибка";

            let bodyHtml = "";

            if (d.type === "match") {
                bodyHtml = "<div>";
                for (const [science, object] of Object.entries(d.correct)) {
                    const userAns = r.userAnswers[science] || "—";
                    // Находим текст выбранного ответа
                    let userText = "—";
                    if (userAns !== "—") {
                        const target = document.querySelector(`#right-col .match-target[data-id="${userAns}"]`);
                        userText = target ? target.textContent : "—";
                    }
                    const isOk = (userAns === science);
                    bodyHtml += `<span class="${isOk ? "correct-answer" : "user-answer"}"><strong>${object}</strong>: ваш ответ — ${userText}${isOk ? " ✓" : " ✗"}</span>`;
                }
                bodyHtml += "</div>";
            } else if (d.type === "select") {
                bodyHtml = "<div>";
                const labels = { s1: "1-й пропуск", s2: "2-й пропуск", s3: "3-й пропуск" };
                for (const [k, label] of Object.entries(labels)) {
                    const uVal = r.userAnswers[k];
                    const cVal = d.correct[k];
                    const isOk = (uVal === cVal);
                    bodyHtml += `<span class="${isOk ? "correct-answer" : "user-answer"}"><strong>${label}</strong>: вы выбрали «${uVal}»${isOk ? " ✓" : `, правильно — «${cVal}» ✗`}</span>`;
                }
                bodyHtml += "</div>";
            } else if (d.type === "radio") {
                const isOk = r.correct;
                bodyHtml = `<span class="${isOk ? "correct-answer" : "user-answer"}">Ваш ответ: ${r.userAnswer}${isOk ? " ✓" : ""}</span>`;
                if (!isOk) {
                    bodyHtml += `<span class="correct-answer">Правильный ответ: ${d.correct}</span>`;
                }
            } else if (d.type === "drag") {
                bodyHtml = "<div>";
                const labels = ["1-й пропуск", "2-й пропуск"];
                r.userAnswers.forEach((val, idx) => {
                    const cVal = Object.values(d.correct)[idx];
                    const isOk = (val === cVal);
                    bodyHtml += `<span class="${isOk ? "correct-answer" : "user-answer"}"><strong>${labels[idx]}</strong>: ${val}${isOk ? " ✓" : `, правильно — ${cVal} ✗`}</span>`;
                });
                bodyHtml += "</div>";
            } else if (d.type === "checkbox") {
                const labels = {
                    q6: { "Воронку": "Воронку", "Колбу плоскодонную": "Колбу плоскодонную", "Пипетку": "Пипетку", "Мерный цилиндр": "Мерный цилиндр", "Чашки Петри": "Чашки Петри" },
                    q7: { "1": "В лаборатории можно принимать пищу", "2": "В лаборатории нельзя нюхать незнакомые вещества", "3": "По окончании работы все приборы должны быть возвращены на своё место", "4": "Для питья можно использовать лабораторную посуду", "5": "При проведении практической работы нужно точно следовать всем указаниям учителя", "6": "Приборы и вещества в лаборатории можно трогать без разрешения учителя" },
                    q8: { "1": "Лабораторное оборудование изготавливают только из металла", "2": "Для переливания жидкостей применяют воронки", "3": "Для изготовления лабораторной посуды применяют только обычное стекло", "4": "Для отбора определённого количества жидкости используют пипетки", "5": "Для перенесения твёрдых веществ берут шпатели", "6": "Чашка Петри имеет форму высокого цилиндра" }
                };
                const qKey = "q" + i;
                const labelMap = labels[qKey] || {};
                const userSet = new Set(r.userAnswers);
                const correctSet = new Set(d.correct);
                bodyHtml = "<div>";
                for (const [val, text] of Object.entries(labelMap)) {
                    const userChecked = userSet.has(val);
                    const shouldBeChecked = correctSet.has(val);
                    if (userChecked && shouldBeChecked) {
                        bodyHtml += `<span class="correct-answer">✓ ${text}</span>`;
                    } else if (userChecked && !shouldBeChecked) {
                        bodyHtml += `<span class="user-answer">✗ ${text} (отмечено неверно)</span>`;
                    } else if (!userChecked && shouldBeChecked) {
                        bodyHtml += `<span class="user-answer">✗ ${text} (нужно было отметить)</span>`;
                    }
                }
                bodyHtml += "</div>";
            } else if (d.type === "text") {
                bodyHtml = "<div>";
                const labels = ["ж... (жизнь)", "с... (суше)", "в... (воде)", "п... (почве)", "б... (биосфера)"];
                const correctVals = [d.correct.i1, d.correct.i2, d.correct.i3, d.correct.i4, d.correct.i5];
                const userVals = [r.userAnswers.i1, r.userAnswers.i2, r.userAnswers.i3, r.userAnswers.i4, r.userAnswers.i5];
                for (let j = 0; j < 5; j++) {
                    const correctVal = Array.isArray(correctVals[j]) ? correctVals[j].join(" / ") : correctVals[j];
                    const isOk = Array.isArray(correctVals[j])
                        ? correctVals[j].includes(userVals[j])
                        : (userVals[j] === correctVals[j]);
                    bodyHtml += `<span class="${isOk ? "correct-answer" : "user-answer"}"><strong>${labels[j]}</strong>: вы ввели «${userVals[j]}»${isOk ? " ✓" : `, правильно — «${correctVal}» ✗`}</span>`;
                }
                bodyHtml += "</div>";
            }

            bodyHtml += `<div class="explanation"><strong>Пояснение:</strong> ${d.explanation}</div>`;

            const cardHtml = `
                <div class="result-task ${statusClass}">
                    <div class="result-task-header">
                        <div class="result-task-badge">${statusIcon}</div>
                        <h4>${d.title}</h4>
                    </div>
                    <div class="result-task-body">
                        ${bodyHtml}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", cardHtml);
        }
    }

    // ====== 6. Кнопка "Пройти заново" ======
    backBtn.addEventListener("click", () => {
        location.reload();
    });

    // ====== 7. Отправка в Google Таблицу ======
    function sendToGoogleForm(name, className, score, finalGrade) {
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfcJRxHJRNI6kHYeHasVX4kQN7PMKJAmmXiFRLyt9tLZ0DbHg/formResponse";
        const formData = new FormData();
        formData.append("entry.1875858208", name);
        formData.append("entry.362770474", className);
        formData.append("entry.1542758248", score);
        formData.append("entry.1917083737", finalGrade);

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});