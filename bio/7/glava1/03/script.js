// ============================================================
//  ДАННЫЕ ЗАДАНИЙ
// ============================================================

// Задание 1: Соотнесение (части клетки спирогиры → их функции)
const matchingData = [
    {
        term: "Хлоропласт (лентовидный, спиральный)",
        correct: "Фотосинтез — образование органических веществ",
        options: [
            "Защита и придание формы клетке",
            "Фотосинтез — образование органических веществ",
            "Управление жизнедеятельностью клетки",
            "Запас питательных веществ",
        ],
    },
    {
        term: "Клеточная стенка (из целлюлозы)",
        correct: "Защита и придание формы клетке",
        options: [
            "Защита и придание формы клетке",
            "Фотосинтез — образование органических веществ",
            "Управление жизнедеятельностью клетки",
            "Запас питательных веществ",
        ],
    },
    {
        term: "Ядро",
        correct: "Управление жизнедеятельностью клетки",
        options: [
            "Защита и придание формы клетке",
            "Фотосинтез — образование органических веществ",
            "Управление жизнедеятельностью клетки",
            "Запас питательных веществ",
        ],
    },
    {
        term: "Пиреноиды (утолщения на хлоропласте)",
        correct: "Запас питательных веществ",
        options: [
            "Защита и придание формы клетке",
            "Фотосинтез — образование органических веществ",
            "Управление жизнедеятельностью клетки",
            "Запас питательных веществ",
        ],
    },
];

// Задание 2: Тест по улотриксу
const quizData = [
    {
        question: "Какую форму имеет хлоропласт у улотрикса?",
        options: ["Спиральную лентовидную", "Кольцевую (пояском)", "Звёздчатую", "Чашевидную"],
        correct: 1,
    },
    {
        question: "Чем отличается базальная (нижняя) клетка нити улотрикса?",
        options: [
            "Она крупнее остальных",
            "Не имеет хлоропласта и выполняет функцию прикрепления",
            "Содержит два ядра",
            "Не имеет клеточной стенки",
        ],
        correct: 1,
    },
    {
        question: "Сколько хлоропластов в клетке улотрикса?",
        options: ["Один", "Два", "Три-пять", "Более десяти"],
        correct: 0,
    },
    {
        question: "К какому отделу водорослей относятся спирогира и улотрикс?",
        options: ["Бурые водоросли", "Красные водоросли", "Зелёные водоросли", "Диатомеи"],
        correct: 2,
    },
    {
        question: "Какие клетки нити спирогиры способны к делению?",
        options: [
            "Только клетки на концах нити",
            "Все клетки нити, кроме базальной",
            "Только центральные клетки",
            "Только базальные клетки",
        ],
        correct: 1,
    },
];

// Задание 3: Заполнение пропусков
const fillBlanksData = {
    text: "Спирогира — многоклеточная {{0}} водоросль, тело которой представляет собой неп ветвящуюся {{1}}, состоящую из {{2}} клеток. Хлоропласты имеют вид {{3}} ленты, расположенной {{4}}. В клетках улотрикса находится {{5}} кольцевидный хлоропласт. Нить улотрикса прикрепляется к субстрату с помощью {{6}} клетки.",
    blanks: [
        { answer: ["нитчатая", "нитчатую"], placeholder: "тип водоросли" },
        { answer: ["нить", "нитью", "нити"], placeholder: "форма тела" },
        { answer: ["одинаковых", "одинаковых"], placeholder: "какие клетки?" },
        { answer: ["спиральной", "спирально", "лентовидной"], placeholder: "форма хлоропласта" },
        { answer: ["спирально", "спирали", "по спирали"], placeholder: "как расположены?" },
        { answer: ["один"], placeholder: "количество хлоропластов" },
        { answer: ["базальной", "нижней", "ризоидальной"], placeholder: "какая клетка?" },
    ],
};

// Задание 4: Истина/Ложь
const trueFalseData = [
    { statement: "Спирогира и улотрикс относятся к зелёным водорослям.", correct: true },
    { statement: "Нить спирогиры ветвится.", correct: false },
    { statement: "Хлоропласты спирогиры расположены по спирали.", correct: true },
    { statement: "Улотрикс прикрепляется к субстрату с помощью базальной клетки.", correct: true },
    { statement: "В клетке улотрикса несколько хлоропластов спиральной формы.", correct: false },
    { statement: "Тело спирогиры состоит из одинаковых клеток, каждая из которых может делиться.", correct: true },
    { statement: "Пиреноиды — это места накопления крахмала в хлоропластах спирогиры.", correct: true },
];

// ============================================================
//  РЕЗУЛЬТАТЫ
// ============================================================
let results = {
    task1: null, // score 0-4
    task2: null, // score 0-5
    task3: null, // score 0-7
    task4: null, // score 0-7
    total: null,
    maxTotal: 23,
};

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ МИКРОСКОПА
// ============================================================
let zoomLevel = 1.0;
let lensSize = 180;

function initMicroscope() {
    const stage = document.getElementById("microscopeStage");
    const lens = document.getElementById("microscopeLens");
    const img = document.getElementById("algaeImage");
    const wrapper = stage.parentElement;

    // Базовое затемнённое изображение виден весь препарат
    // Линза показывает увеличенный участок

    function updateLens(e) {
        const rect = wrapper.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // Ограничиваем координаты внутри рамки
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        // Позиционируем линзу
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        lens.style.transform = "translate(-50%, -50%)";

        // Фоновое изображение в линзе
        const bgX = -(x * zoomLevel - lensSize / 2);
        const bgY = -(y * zoomLevel - lensSize / 2);
        lens.style.backgroundImage = `url(spirogira.jpg)`;
        lens.style.backgroundSize = `${rect.width * zoomLevel}px ${rect.height * zoomLevel}px`;
        lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }

    wrapper.addEventListener("mousemove", updateLens);
    wrapper.addEventListener("touchmove", function (e) {
        e.preventDefault();
        const touch = e.touches[0];
        updateLens(touch);
    });

    // Кнопки зума
    document.getElementById("zoomIn").addEventListener("click", function () {
        if (zoomLevel < 4.0) {
            zoomLevel = +(zoomLevel + 0.5).toFixed(1);
            lensSize = Math.round(180 + zoomLevel * 10);
            lens.style.width = lensSize + "px";
            lens.style.height = lensSize + "px";
            document.getElementById("zoomLevel").textContent = zoomLevel;
        }
    });

    document.getElementById("zoomOut").addEventListener("click", function () {
        if (zoomLevel > 1.0) {
            zoomLevel = +(zoomLevel - 0.5).toFixed(1);
            lensSize = Math.round(180 + zoomLevel * 10);
            lens.style.width = lensSize + "px";
            lens.style.height = lensSize + "px";
            document.getElementById("zoomLevel").textContent = zoomLevel;
        }
    });
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ ЗАДАНИЯ 1 (Соотнесение)
// ============================================================
function initMatching() {
    const container = document.getElementById("matchingTask1");
    let html = "";
    matchingData.forEach(function (item, i) {
        // Перемешиваем варианты ответов
        const shuffled = shuffle(item.options.slice());
        html += '<div class="match-row">';
        html += '<div class="match-item"><strong>' + (i + 1) + ". " + item.term + "</strong></div>";
        html += '<span class="match-arrow">→</span>';
        html += '<select class="match-select" data-index="' + i + '">';
        html += '<option value="">— выберите —</option>';
        shuffled.forEach(function (opt) {
            html += '<option value="' + opt + '">' + opt + "</option>";
        });
        html += "</select>";
        html += "</div>";
    });
    container.innerHTML = html;
}

function checkMatching() {
    let score = 0;
    matchingData.forEach(function (item, i) {
        const sel = document.querySelector('.match-select[data-index="' + i + '"]');
        if (sel.value === item.correct) {
            score++;
            sel.style.borderColor = "#43a047";
            sel.style.background = "#e8f5e9";
        } else {
            sel.style.borderColor = "#e53935";
            sel.style.background = "#ffebee";
        }
    });
    results.task1 = score;
    const fb = document.getElementById("feedback1");
    fb.textContent = "Верно: " + score + " из " + matchingData.length;
    fb.className = "feedback " + (score === matchingData.length ? "correct" : "incorrect");
    updateResults();
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ ЗАДАНИЯ 2 (Тест)
// ============================================================
function initQuiz() {
    const container = document.getElementById("quizContainer");
    let html = "";
    quizData.forEach(function (q, qi) {
        html += '<div class="quiz-question">';
        html += "<p>" + (qi + 1) + ". " + q.question + "</p>";
        q.options.forEach(function (opt, oi) {
            html += '<label class="quiz-option" data-q="' + qi + '" data-o="' + oi + '">';
            html += '<input type="radio" name="q' + qi + '" value="' + oi + '" style="display:none">';
            html += opt + "</label>";
        });
        html += "</div>";
    });
    container.innerHTML = html;

    // Обработка кликов
    document.querySelectorAll(".quiz-option").forEach(function (el) {
        el.addEventListener("click", function () {
            const q = this.getAttribute("data-q");
            // Снимаем выделение с других вариантов этого вопроса
            document.querySelectorAll('.quiz-option[data-q="' + q + '"]').forEach(function (o) {
                o.classList.remove("selected");
            });
            this.classList.add("selected");
            this.querySelector("input").checked = true;
        });
    });
}

function checkQuiz() {
    let score = 0;
    quizData.forEach(function (q, qi) {
        const selected = document.querySelector('.quiz-option[data-q="' + qi + '"].selected');
        if (selected && parseInt(selected.getAttribute("data-o")) === q.correct) {
            score++;
            selected.style.borderColor = "#43a047";
            selected.style.background = "#e8f5e9";
        } else {
            // Подсветить правильный ответ
            const correctOpt = document.querySelector('.quiz-option[data-q="' + qi + '"][data-o="' + q.correct + '"]');
            if (correctOpt) {
                correctOpt.style.borderColor = "#43a047";
                correctOpt.style.background = "#e8f5e9";
            }
            if (selected) {
                selected.style.borderColor = "#e53935";
                selected.style.background = "#ffebee";
            }
        }
    });
    results.task2 = score;
    const fb = document.getElementById("feedback2");
    fb.textContent = "Верно: " + score + " из " + quizData.length;
    fb.className = "feedback " + (score === quizData.length ? "correct" : "incorrect");
    updateResults();
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ ЗАДАНИЯ 3 (Заполнение пропусков)
// ============================================================
function initFillBlanks() {
    const container = document.getElementById("fillBlanksTask");
    // Разбиваем текст по шаблону {{N}}
    const parts = fillBlanksData.text.split(/\{\{(\d+)\}\}/);
    let html = "";
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            html += parts[i];
        } else {
            const blankIdx = parseInt(parts[i]);
            const blank = fillBlanksData.blanks[blankIdx];
            html += '<input type="text" class="blank-input" data-index="' + blankIdx + '" placeholder="' + blank.placeholder + '">';
        }
    }
    container.innerHTML = html;
}

function checkFillBlanks() {
    let score = 0;
    fillBlanksData.blanks.forEach(function (blank, i) {
        const inp = document.querySelector('.blank-input[data-index="' + i + '"]');
        const val = inp.value.trim().toLowerCase();
        if (blank.answer.some(function (a) { return a.toLowerCase() === val; })) {
            score++;
            inp.style.borderColor = "#43a047";
            inp.style.background = "#e8f5e9";
        } else {
            inp.style.borderColor = "#e53935";
            inp.style.background = "#ffebee";
        }
    });
    results.task3 = score;
    const fb = document.getElementById("feedback3");
    fb.textContent = "Верно: " + score + " из " + fillBlanksData.blanks.length;
    fb.className = "feedback " + (score === fillBlanksData.blanks.length ? "correct" : "incorrect");
    updateResults();
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ ЗАДАНИЯ 4 (Истина/Ложь)
// ============================================================
let tfAnswers = {};

function initTrueFalse() {
    const container = document.getElementById("trueFalseTask");
    let html = "";
    trueFalseData.forEach(function (item, i) {
        html += '<div class="tf-item">';
        html += "<p>" + (i + 1) + ". " + item.statement + "</p>";
        html += '<div class="tf-group">';
        html += '<button class="tf-btn" data-index="' + i + '" data-value="true">Верно</button>';
        html += '<button class="tf-btn" data-index="' + i + '" data-value="false">Неверно</button>';
        html += "</div>";
        html += "</div>";
    });
    container.innerHTML = html;

    // Обработка кликов
    document.querySelectorAll(".tf-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const idx = this.getAttribute("data-index");
            const val = this.getAttribute("data-value");
            tfAnswers[idx] = val === "true";
            // Снимаем выделение с других кнопок
            document.querySelectorAll('.tf-btn[data-index="' + idx + '"]').forEach(function (b) {
                b.classList.remove("tf-selected-true", "tf-selected-false");
            });
            this.classList.add(val === "true" ? "tf-selected-true" : "tf-selected-false");
        });
    });
}

function checkTrueFalse() {
    let score = 0;
    trueFalseData.forEach(function (item, i) {
        const btns = document.querySelectorAll('.tf-btn[data-index="' + i + '"]');
        btns.forEach(function (b) {
            b.style.borderColor = "";
            b.style.background = "";
        });
        if (tfAnswers[i] === item.correct) {
            score++;
            // Подсветить зелёным выбранную правильную кнопку
            const correctVal = item.correct ? "true" : "false";
            const correctBtn = document.querySelector('.tf-btn[data-index="' + i + '"][data-value="' + correctVal + '"]');
            if (correctBtn) {
                correctBtn.style.borderColor = "#43a047";
                correctBtn.style.background = "#e8f5e9";
            }
        } else {
            // Подсветить красным выбранную неверную
            const selectedVal = tfAnswers[i] === true ? "true" : (tfAnswers[i] === false ? "false" : null);
            if (selectedVal) {
                const selBtn = document.querySelector('.tf-btn[data-index="' + i + '"][data-value="' + selectedVal + '"]');
                if (selBtn) {
                    selBtn.style.borderColor = "#e53935";
                    selBtn.style.background = "#ffebee";
                }
            }
            // Показать правильный ответ
            const correctVal = item.correct ? "true" : "false";
            const correctBtn = document.querySelector('.tf-btn[data-index="' + i + '"][data-value="' + correctVal + '"]');
            if (correctBtn) {
                correctBtn.style.borderColor = "#43a047";
                correctBtn.style.background = "#e8f5e9";
            }
        }
    });
    results.task4 = score;
    const fb = document.getElementById("feedback4");
    fb.textContent = "Верно: " + score + " из " + trueFalseData.length;
    fb.className = "feedback " + (score === trueFalseData.length ? "correct" : "incorrect");
    updateResults();
}

// ============================================================
//  ОБНОВЛЕНИЕ РЕЗУЛЬТАТОВ
// ============================================================
function updateResults() {
    const summary = document.getElementById("resultsSummary");
    const allChecked = results.task1 !== null && results.task2 !== null && results.task3 !== null && results.task4 !== null;

    if (!allChecked) {
        summary.innerHTML = "<p>Проверьте все задания, чтобы увидеть итоговые результаты.</p>";
        return;
    }

    results.total = (results.task1 || 0) + (results.task2 || 0) + (results.task3 || 0) + (results.task4 || 0);
    const percent = Math.round((results.total / results.maxTotal) * 100);
    let grade = "2";
    if (percent >= 90) grade = "5";
    else if (percent >= 75) grade = "4";
    else if (percent >= 50) grade = "3";

    summary.innerHTML =
        '<div class="result-row"><span>Задание 1 (Соотнесение)</span><span class="score">' + results.task1 + " / " + matchingData.length + "</span></div>" +
        '<div class="result-row"><span>Задание 2 (Тест)</span><span class="score">' + results.task2 + " / " + quizData.length + "</span></div>" +
        '<div class="result-row"><span>Задание 3 (Пропуски)</span><span class="score">' + results.task3 + " / " + fillBlanksData.blanks.length + "</span></div>" +
        '<div class="result-row"><span>Задание 4 (Истина/Ложь)</span><span class="score">' + results.task4 + " / " + trueFalseData.length + "</span></div>" +
        '<div class="total-row"><span>Итого</span><span>' + results.total + " / " + results.maxTotal + " (" + percent + "%) — Оценка: " + grade + "</span></div>";

    document.getElementById("submitSection").style.display = "block";
}

// ============================================================
//  ПРОВЕРКА ВСЕХ ЗАДАНИЙ
// ============================================================
function checkAll() {
    if (results.task1 === null) checkMatching();
    if (results.task2 === null) checkQuiz();
    if (results.task3 === null) checkFillBlanks();
    if (results.task4 === null) checkTrueFalse();
    // Если уже проверено — обновить
    checkMatching();
    checkQuiz();
    checkFillBlanks();
    checkTrueFalse();
    updateResults();

    // Прокрутка к результатам
    document.querySelector(".results-card").scrollIntoView({ behavior: "smooth" });
}

// ============================================================
//  ОТПРАВКА РЕЗУЛЬТАТОВ В GOOGLE ТАБЛИЦУ
// ============================================================
// ВАЖНО: Замените значения ниже на реальные данные вашей Google Формы!
// 1. Создайте Google Форму с полями: "ФИО", "Класс", "Задание1", "Задание2",
//    "Задание3", "Задание4", "Итого", "Оценка", "Процент"
// 2. Откройте форму, посмотрите HTML-код, найдите атрибуты name="entry.XXXXX"
//    для каждого поля и заполните их ниже.
// 3. Найдите URL отправки формы (атрибут action у тега form) — он выглядит как
//    https://docs.google.com/forms/d/e/XXXXX/formResponse

const GOOGLE_FORM_CONFIG = {
    formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe8Xa78odsCnFOyYalmIYi4bnbqD_AfWIeCFE8jQXJW9BLNMg/formResponse",
    fields: {
        name:    "entry.309062002",   // ← замените на реальные ID
        class:   "entry.237189406",
        task1:   "entry.1810626333",
        task2:   "entry.1881275398",
        task3:   "entry.1778708186",
        task4:   "entry.1281354805",
        total:   "entry.1709965527",
        grade:   "entry.1189436329",
        percent: "entry.1244618852",
    },
};

function submitResults() {
    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();

    if (!name) {
        showSubmitFeedback("Пожалуйста, укажите фамилию и имя.", "error");
        return;
    }
    if (!studentClass) {
        showSubmitFeedback("Пожалуйста, укажите класс.", "error");
        return;
    }
    if (results.total === null) {
        showSubmitFeedback("Сначала проверьте все задания!", "error");
        return;
    }

    const percent = Math.round((results.total / results.maxTotal) * 100);
    let grade = "2";
    if (percent >= 90) grade = "5";
    else if (percent >= 75) grade = "4";
    else if (percent >= 50) grade = "3";

    // Формируем данные для отправки
    const formData = new FormData();
    formData.append(GOOGLE_FORM_CONFIG.fields.name, name);
    formData.append(GOOGLE_FORM_CONFIG.fields.class, studentClass);
    formData.append(GOOGLE_FORM_CONFIG.fields.task1, results.task1 + " из " + matchingData.length);
    formData.append(GOOGLE_FORM_CONFIG.fields.task2, results.task2 + " из " + quizData.length);
    formData.append(GOOGLE_FORM_CONFIG.fields.task3, results.task3 + " из " + fillBlanksData.blanks.length);
    formData.append(GOOGLE_FORM_CONFIG.fields.task4, results.task4 + " из " + trueFalseData.length);
    formData.append(GOOGLE_FORM_CONFIG.fields.total, results.total + " из " + results.maxTotal);
    formData.append(GOOGLE_FORM_CONFIG.fields.grade, grade);
    formData.append(GOOGLE_FORM_CONFIG.fields.percent, percent + "%");

    showSubmitFeedback("Отправка результатов...", "");

    // Отправка через fetch с CORS (Google Forms принимает POST)
    fetch(GOOGLE_FORM_CONFIG.formActionUrl, {
        method: "POST",
        mode: "no-cors", // Google Forms не поддерживает CORS, используем no-cors
        body: formData,
    })
    .then(function () {
        showSubmitFeedback(
            "✅ Результаты успешно отправлены! " + name + " (" + studentClass + "): оценка " + grade + ", " + percent + "%",
            "success"
        );
    })
    .catch(function (err) {
        // Резервный способ через iframe
        submitViaIframe(formData);
        showSubmitFeedback(
            "✅ Результаты отправлены (через iframe)! " + name + " (" + studentClass + "): оценка " + grade + ", " + percent + "%",
            "success"
        );
    });
}

// Резервный метод отправки через скрытый iframe (для обхода CORS)
function submitViaIframe(formData) {
    const iframeName = "hidden_iframe_" + Date.now();
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_FORM_CONFIG.formActionUrl;
    form.target = iframeName;

    for (var pair of formData.entries()) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = pair[0];
        input.value = pair[1];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    setTimeout(function () {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
    }, 3000);
}

function showSubmitFeedback(msg, type) {
    const fb = document.getElementById("submitFeedback");
    fb.textContent = msg;
    fb.className = "submit-feedback " + type;
}

// ============================================================
//  УТИЛИТЫ
// ============================================================
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    initMicroscope();
    initMatching();
    initQuiz();
    initFillBlanks();
    initTrueFalse();
});
