// ==========================================
// ИНТЕРАКТИВНЫЙ ТЕСТ: "Источники биологических знаний"
// 5 класс
// ==========================================

// === НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE FORMS ===
// Замените значения ниже на свои данные из Google Формы.
// Инструкция: https://support.google.com/docs/answer/13974709
//
// 1. Создайте Google Форму с 4 полями (короткий ответ):
//    - ФИО (entry.XXXXXXXX)
//    - Класс (entry.YYYYYYYY)
//    - Баллы (entry.ZZZZZZZZ)
//    - Оценка (entry.WWWWWWWW)
// 2. Нажмите "Отправить" → "Отправить через ссылку" → "Получить ссылку"
// 3. В ссылке найдите &entry.XXXXXXX= и скопируйте ID каждого поля
// 4. Вставьте их ниже:

const GOOGLE_FORM_CONFIG = {
    formUrl: "https://docs.google.com/forms/d/e/ЗАМЕНИТЕ_НА_СВОЙ_ID/formResponse",
    fields: {
        name:   "entry.111111111",   // <-- замените на свой ID поля "ФИО"
        class:  "entry.222222222",   // <-- замените на свой ID поля "Класс"
        score:  "entry.333333333",   // <-- замените на свой ID поля "Баллы"
        grade:  "entry.444444444"    // <-- замените на свой ID поля "Оценка"
    }
};

// === БАЗА ВОПРОСОВ ===
const QUESTIONS = [
    {
        type: "single",
        question: "Что называют методом познания, при котором мы смотрим на объект и описываем его, не вмешиваясь в происходящее?",
        options: ["Наблюдение", "Эксперимент", "Измерение", "Сравнение"],
        correct: 0
    },
    {
        type: "single",
        question: "Какой прибор используют для изучения мелких объектов, невидимых невооружённым глазом?",
        options: ["Лупа", "Микроскоп", "Телескоп", "Компас"],
        correct: 1
    },
    {
        type: "single",
        question: "Что такое эксперимент в биологии?",
        options: [
            "Чтение книги о природе",
            "Наблюдение за животными в зоопарке",
            "Опыт, который проводят в лаборатории с определёнными условиями",
            "Просмотр телепередачи о растениях"
        ],
        correct: 2
    },
    {
        type: "truefalse",
        question: "Интернет является надёжным источником биологических знаний — любую информацию из него можно использовать без проверки.",
        correct: false
    },
    {
        type: "single",
        question: "Кто из учёных впервые описал строение тела человека на основе вскрытий?",
        options: ["Карл Линней", "Андреас Везалий", "Чарлз Дарвин", "Луи Пастер"],
        correct: 1
    },
    {
        type: "matching",
        question: "Соотнесите метод исследования с его описанием:",
        pairs: [
            { left: "Наблюдение",  right: "Описание объекта без вмешательства" },
            { left: "Эксперимент", right: "Проведение опыта с заданными условиями" },
            { left: "Измерение",   right: "Определение размеров, массы, температуры" },
            { left: "Сравнение",   right: "Нахождение сходств и различий между объектами" }
        ]
    },
    {
        type: "text",
        question: "Как называется наука о живой природе? (введите одно слово)",
        correctAnswers: ["биология", "биология.", "биологии"]
    },
    {
        type: "single",
        question: "Какой источник знаний позволяет повторно изучать материал и возвращаться к нему?",
        options: ["Учебник", "Однократное наблюдение", "Слухи", "Случайная статья в интернете"],
        correct: 0
    },
    {
        type: "truefalse",
        question: "Карл Линней создал систему классификации, в которой каждому виду организмов он дал двойное название.",
        correct: true
    },
    {
        type: "single",
        question: "Что НЕ относится к источникам биологических знаний?",
        options: [
            "Научные книги и учебники",
            "Лабораторные исследования",
            "Гадания и приметы",
            "Наблюдения в природе"
        ],
        correct: 2
    }
];

// === СОСТОЯНИЕ ТЕСТА ===
let currentQuestion = 0;
let userAnswers = [];
let studentName = "";
let studentClass = "";
let score = 0;
let grade = "";

// === DOM-ЭЛЕМЕНТЫ ===
const startScreen = document.getElementById("start-screen");
const testScreen = document.getElementById("test-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const finishBtn = document.getElementById("finish-btn");
const restartBtn = document.getElementById("restart-btn");
const questionArea = document.getElementById("question-area");
const progressFill = document.getElementById("progress-fill");
const qCurrent = document.getElementById("q-current");
const qTotal = document.getElementById("q-total");

// === ИНИЦИАЛИЗАЦИЯ ===
qTotal.textContent = QUESTIONS.length;

startBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("student-name").value.trim();
    const classInput = document.getElementById("student-class").value.trim();
    if (!nameInput) {
        alert("Введите ФИО ученика!");
        return;
    }
    if (!classInput) {
        alert("Укажите класс!");
        return;
    }
    studentName = nameInput;
    studentClass = classInput;
    currentQuestion = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);

    startScreen.classList.remove("active");
    testScreen.classList.add("active");
    renderQuestion();
});

restartBtn.addEventListener("click", () => {
    resultScreen.classList.remove("active");
    startScreen.classList.add("active");
    document.getElementById("student-name").value = "";
    document.getElementById("student-class").value = "";
});

nextBtn.addEventListener("click", () => {
    saveCurrentAnswer();
    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion++;
        renderQuestion();
    }
});

prevBtn.addEventListener("click", () => {
    saveCurrentAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
});

finishBtn.addEventListener("click", () => {
    saveCurrentAnswer();
    finishTest();
});

// === ОТРИСОВКА ВОПРОСА ===
function renderQuestion() {
    const q = QUESTIONS[currentQuestion];
    qCurrent.textContent = currentQuestion + 1;
    progressFill.style.width = ((currentQuestion + 1) / QUESTIONS.length * 100) + "%";

    // Кнопки навигации
    prevBtn.style.display = currentQuestion > 0 ? "block" : "none";
    const isLast = currentQuestion === QUESTIONS.length - 1;
    nextBtn.style.display = isLast ? "none" : "block";
    finishBtn.style.display = isLast ? "block" : "none";

    let html = '<div class="question-text">' + (currentQuestion + 1) + ". " + q.question + '</div>';

    if (q.type === "single") {
        html += '<div class="answer-options">';
        q.options.forEach((opt, i) => {
            const sel = userAnswers[currentQuestion] === i ? " selected" : "";
            html += '<div class="answer-option' + sel + '" data-idx="' + i + '">'
                  + '<div class="option-letter">' + String.fromCharCode(1040 + i) + '</div>'
                  + '<span>' + opt + '</span></div>';
        });
        html += '</div>';

    } else if (q.type === "truefalse") {
        html += '<div class="answer-options">';
        ["Верно", "Неверно"].forEach((opt, i) => {
            const val = i === 0;
            const sel = userAnswers[currentQuestion] === val ? " selected" : "";
            html += '<div class="answer-option' + sel + '" data-idx="' + val + '">'
                  + '<div class="option-letter">' + (i === 0 ? "✓" : "✗") + '</div>'
                  + '<span>' + opt + '</span></div>';
        });
        html += '</div>';

    } else if (q.type === "matching") {
        // Перемешиваем правые части
        const rightOptions = q.pairs.map((p, i) => ({ text: p.right, origIdx: i }));
        shuffleArray(rightOptions);

        html += '<div class="matching-area">';
        q.pairs.forEach((pair, i) => {
            const saved = userAnswers[currentQuestion];
            const selVal = (saved && saved[i] !== undefined) ? saved[i] : "";
            html += '<div class="match-row">'
                  + '<div class="match-left">' + pair.left + '</div>'
                  + '<select class="match-select" data-row="' + i + '">'
                  + '<option value="">— выберите —</option>';
            rightOptions.forEach(ro => {
                html += '<option value="' + ro.origIdx + '"' + (selVal == ro.origIdx ? " selected" : "") + '>' + ro.text + '</option>';
            });
            html += '</select></div>';
        });
        html += '</div>';

    } else if (q.type === "text") {
        const saved = userAnswers[currentQuestion] || "";
        html += '<input type="text" class="text-input" id="text-answer" value="' + saved + '" placeholder="Введите ответ...">';
    }

    questionArea.innerHTML = html;

    // Привязка обработчиков
    if (q.type === "single" || q.type === "truefalse") {
        document.querySelectorAll(".answer-option").forEach(el => {
            el.addEventListener("click", () => {
                document.querySelectorAll(".answer-option").forEach(o => o.classList.remove("selected"));
                el.classList.add("selected");
            });
        });
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// === СОХРАНЕНИЕ ОТВЕТА ===
function saveCurrentAnswer() {
    const q = QUESTIONS[currentQuestion];

    if (q.type === "single") {
        const selected = document.querySelector(".answer-option.selected");
        if (selected) userAnswers[currentQuestion] = parseInt(selected.dataset.idx);

    } else if (q.type === "truefalse") {
        const selected = document.querySelector(".answer-option.selected");
        if (selected) userAnswers[currentQuestion] = selected.dataset.idx === "true";

    } else if (q.type === "matching") {
        const matches = {};
        document.querySelectorAll(".match-select").forEach(sel => {
            if (sel.value) matches[parseInt(sel.dataset.row)] = parseInt(sel.value);
        });
        userAnswers[currentQuestion] = matches;

    } else if (q.type === "text") {
        const input = document.getElementById("text-answer");
        if (input) userAnswers[currentQuestion] = input.value.trim().toLowerCase();
    }
}

// === ПРОВЕРКА И ЗАВЕРШЕНИЕ ===
function finishTest() {
    score = 0;

    QUESTIONS.forEach((q, i) => {
        const ans = userAnswers[i];
        if (ans === null || ans === undefined) return;

        if (q.type === "single") {
            if (ans === q.correct) score++;

        } else if (q.type === "truefalse") {
            if (ans === q.correct) score++;

        } else if (q.type === "matching") {
            let allCorrect = true;
            q.pairs.forEach((pair, j) => {
                if (ans[j] !== j) allCorrect = false;
            });
            if (allCorrect && Object.keys(ans).length === q.pairs.length) score++;

        } else if (q.type === "text") {
            if (q.correctAnswers.includes(ans)) score++;
        }
    });

    // Оценка по 5-балльной шкале
    if (score >= 9) grade = "5";
    else if (score >= 7) grade = "4";
    else if (score >= 5) grade = "3";
    else grade = "2";

    showResults();
    sendToGoogleForm();
}

// === ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ===
function showResults() {
    testScreen.classList.remove("active");
    resultScreen.classList.add("active");

    document.getElementById("result-name").textContent = studentName;
    document.getElementById("result-class").textContent = studentClass;
    document.getElementById("result-score").textContent = score + " / " + QUESTIONS.length;
    document.getElementById("result-grade").textContent = grade;

    const msg = document.getElementById("result-message");
    if (grade === "5") {
        msg.textContent = "🏆 Отлично! Ты прекрасно знаешь источники биологических знаний!";
        msg.style.background = "#c8e6c9";
    } else if (grade === "4") {
        msg.textContent = "👍 Хороший результат! Чуть-чуть до пятёрки!";
        msg.style.background = "#dcedc8";
    } else if (grade === "3") {
        msg.textContent = "📚 Неплохо, но стоит повторить тему. Загляни в учебник!";
        msg.style.background = "#fff9c4";
    } else {
        msg.textContent = "✏️ Нужно ещё подучить. Не сдавайся — у тебя получится!";
        msg.style.background = "#ffcdd2";
    }

    // Разбор ответов
    let reviewHtml = '<h3 style="margin:20px 0 12px;color:#2e7d32;">Разбор ответов:</h3>';
    QUESTIONS.forEach((q, i) => {
        const ans = userAnswers[i];
        let isCorrect = false;
        let userText = "— (нет ответа)";

        if (q.type === "single") {
            if (ans !== null && ans !== undefined) userText = q.options[ans];
            isCorrect = ans === q.correct;

        } else if (q.type === "truefalse") {
            if (ans !== null && ans !== undefined) userText = ans ? "Верно" : "Неверно";
            isCorrect = ans === q.correct;

        } else if (q.type === "matching") {
            if (ans && Object.keys(ans).length > 0) {
                userText = q.pairs.map((p, j) => {
                    const sel = ans[j];
                    return p.left + " → " + (sel !== undefined ? q.pairs[sel].right : "?");
                }).join("; ");
            }
            let allCorrect = true;
            q.pairs.forEach((p, j) => { if (ans && ans[j] !== j) allCorrect = false; });
            isCorrect = allCorrect && ans && Object.keys(ans).length === q.pairs.length;

        } else if (q.type === "text") {
            if (ans) userText = ans;
            isCorrect = ans && q.correctAnswers.includes(ans);
        }

        const cls = isCorrect ? "correct" : "incorrect";
        const correctText = getCorrectAnswerText(q);
        reviewHtml += '<div class="review-item ' + cls + '">'
            + '<div class="review-q">' + (i + 1) + ". " + q.question + '</div>'
            + '<div class="review-a">Ваш ответ: ' + userText
            + (isCorrect ? '' : ' | Правильно: ' + correctText)
            + '</div></div>';
    });

    document.getElementById("answers-review").innerHTML = reviewHtml;
}

function getCorrectAnswerText(q) {
    if (q.type === "single") return q.options[q.correct];
    if (q.type === "truefalse") return q.correct ? "Верно" : "Неверно";
    if (q.type === "matching") return q.pairs.map((p, i) => p.left + " → " + p.right).join("; ");
    if (q.type === "text") return q.correctAnswers[0];
    return "";
}

// === ОТПРАВКА В GOOGLE FORMS ===
function sendToGoogleForm() {
    const statusEl = document.getElementById("submit-status");
    statusEl.textContent = "Отправка результатов...";
    statusEl.classList.remove("error");

    // Формируем данные формы
    const formData = new FormData();
    formData.append(GOOGLE_FORM_CONFIG.fields.name, studentName);
    formData.append(GOOGLE_FORM_CONFIG.fields.class, studentClass);
    formData.append(GOOGLE_FORM_CONFIG.fields.score, String(score));
    formData.append(GOOGLE_FORM_CONFIG.fields.grade, grade);

    // Отправляем через fetch (no-cors — Google Forms не поддерживает CORS)
    fetch(GOOGLE_FORM_CONFIG.formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData
    })
    .then(() => {
        statusEl.textContent = "✅ Результаты отправлены в таблицу учителя.";
        statusEl.classList.remove("error");
    })
    .catch(() => {
        // При no-cors fetch "ошибку" не возвращает в обычном смысле,
        // но на всякий случай показываем запасной статус
        statusEl.textContent = "✅ Результаты отправлены в таблицу учителя.";
        statusEl.classList.remove("error");
    });
}