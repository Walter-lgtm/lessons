// ==========================================================================
// 1. АВТОМАТИЧЕСКАЯ АДАПТАЦИЯ МАСШТАБА ПОД РАЗМЕРЫ ЭКРАНА ПК
// ==========================================================================
function adjustPresentationScale() {
    const scalerElement = document.getElementById("presentation-scaler");
    if (!scalerElement) return;

    // Базовые зафиксированные размеры приложения
    const baseWidth = 1280;
    const baseHeight = 720;

    // Текущие размеры окна браузера на ПК или проекторе
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Вычисляем коэффициенты масштабирования по ширине и высоте
    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;

    // Выбираем минимальный коэффициент, чтобы приложение гарантированно поместилось без прокрутки
    const finalScale = Math.min(scaleX, scaleY);

    // Применяем CSS-трансформацию масштабирования и центрирования
    scalerElement.style.transform = `scale(${finalScale})`;
}

// Запускаем расчет масштаба при загрузке и при каждом изменении размеров окна
window.addEventListener("resize", adjustPresentationScale);
document.addEventListener("DOMContentLoaded", adjustPresentationScale);

// ==========================================================================
// 2. РАСШИРЕННАЯ БАЗА ДАННЫХ ДЛЯ ИГРЫ «БИО-ЗНАТОКИ» (5 КЛАСС)
// ==========================================================================
const gameQuestions = [
    {
        question: "На лесной опушке школьники нашли белый гриб, подберезовик и лисичку. Какая наука изучает эти организмы?",
        options: ["Ботаника", "Зоология", "Микология", "Экология"],
        correct: "Микология",
        hint: "Потому что это царство Грибов!"
    },
    {
        question: "Ученый рассматривает в микроскоп каплю воды и видит там крошечные двигающиеся бактерии. Какая наука ему помогает?",
        options: ["Микробиология", "Анатомия", "Зоология", "Ботаника"],
        correct: "Микробиология",
        hint: "Микроорганизмы и бактерии — это поле работы микробиологии!"
    },
    {
        question: "Юннаты вешают на деревья скворечники и наблюдают за поведением перелетных птиц весной. Какая наука исследует птиц и других животных?",
        options: ["Ботаника", "Зоология", "Цитология", "Микология"],
        correct: "Зоология",
        hint: "Животных изучает зоология!"
    },
    {
        question: "В лаборатории изучают, как устроена тонкая кожица лука под сильным увеличением, исследуя каждую отдельную клетку. Что это за наука?",
        options: ["Цитология", "Анатомия", "Экология", "Микология"],
        correct: "Цитология",
        hint: "Клетка по-гречески — «цитос», значит это цитология!"
    },
    {
        question: "Экологи заметили, что из-за загрязнения реки в ней стало меньше рыбы, и это нарушило жизнь всех обитателей водоема. Какая наука изучает связи организмов с домом?",
        options: ["Анатомия", "Ботаника", "Микробиология", "Экология"],
        correct: "Экология",
        hint: "Связи с окружающей средой изучает экология!"
    },
    {
        question: "Ученики на уроке рассматривали гербарий: листья дуба, хвоинки сосны и цветки ромашки. Какая наука разложила их по папкам?",
        options: ["Зоология", "Ботаника", "Микология", "Цитология"],
        correct: "Ботаника",
        hint: "Растения — это главная тема ботаники!"
    },
    {
        question: "На раскопках в древних слоях земли ученые обнаружили отпечаток гигантского папоротника и кости динозавра. Какая наука изучает вымершие организмы прошлого?",
        options: ["Палеонтология", "Анатомия", "Микробиология", "Экология"],
        correct: "Палеонтология",
        hint: "Ископаемые остатки древней жизни изучает палеонтология!"
    },
    {
        question: "Доктор изучает, как устроено сердце человека, из каких камер оно состоит и как расположены кровеносные сосуды. К какой науке он обращается?",
        options: ["Микология", "Ботаника", "Анатомия", "Цитология"],
        correct: "Анатомия",
        hint: "Внутреннее строение организма и органов — это анатомия!"
    },
    {
        question: "Исследователи отправились в тайгу, чтобы составить карту целебных трав, мхов и ягодных кустарников. Какая наука руководит этой экспедицией?",
        options: ["Зоология", "Ботаника", "Микробиология", "Цитология"],
        correct: "Ботаника",
        hint: "Дикорастущие травы и мхи относятся к царству Растений, поэтому это ботаника!"
    },
    {
        question: "Ученые выясняют, почему белый медведь не мёрзнет в ледяной воде Арктики и как его густой мех помогает ему выживать. Какая наука ищет ответы?",
        options: ["Экология", "Микология", "Ботаника", "Анатомия"],
        correct: "Экология",
        hint: "Приспособленность организмов к суровой среде обитания изучает экология!"
    }
];

// Глобальное состояние урока
let lessonState = {
    currentSlide: 1,
    totalSlides: 4,
    currentQuestion: null,
    score: 0,
    round: 1
};

// ==========================================================================
// 3. СТАРТОВАЯ НАВИГАЦИЯ МЕЖДУ РАЗДЕЛАМИ
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initSectionsTabs();
    initPresentationSlider();
    // Функция запуска игры будет вызвана во 3-й части кода
});

function initSectionsTabs() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".content-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            sections.forEach(s => s.classList.add("hidden"));

            btn.classList.add("active");
            const target = btn.getAttribute("data-target");
            document.getElementById(target).classList.remove("hidden");
            
            // На всякий случай пересчитываем масштаб при смене вкладки
            adjustPresentationScale();
        });
    });
}
// ==========================================================================
// 4. ЛОГИКА СЛАЙДЕРА ПРЕЗЕНТАЦИИ (ТЕОРИЯ)
// ==========================================================================
function initPresentationSlider() {
    const prevBtn = document.getElementById("btn-prev-slide");
    const nextBtn = document.getElementById("btn-next-slide");
    const dotsContainer = document.getElementById("presentation-dots");

    // Генерируем интерактивные точки по количеству слайдов
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= lessonState.totalSlides; i++) {
        const dot = document.createElement("div");
        dot.className = i === 1 ? "dot active" : "dot";
        dot.addEventListener("click", () => {
            switchSlideTo(i);
        });
        dotsContainer.appendChild(dot);
    }

    // Навешиваем клики на кнопки навигации
    prevBtn.addEventListener("click", () => {
        if (lessonState.currentSlide > 1) {
            switchSlideTo(lessonState.currentSlide - 1);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (lessonState.currentSlide < lessonState.totalSlides) {
            switchSlideTo(lessonState.currentSlide + 1);
        }
    });

    // Инициализируем клики по интерактивным карточкам на Слайде 3
    initAccordionReveal();
}

// Функция переключения активного слайда
function switchSlideTo(slideNumber) {
    // Скрываем прошлый слайд
    document.querySelector(".lesson-slide.active").classList.remove("active");
    
    // Показываем выбранный
    const targetSlide = document.querySelector(`.lesson-slide[data-slide="${slideNumber}"]`);
    targetSlide.classList.add("active");

    lessonState.currentSlide = slideNumber;

    // Управляем активностью кнопок "Назад" и "Вперед"
    document.getElementById("btn-prev-slide").disabled = (slideNumber === 1);
    document.getElementById("btn-next-slide").disabled = (slideNumber === lessonState.totalSlides);

    // Подсвечиваем нужную точку-индикатор
    document.querySelectorAll(".presentation-dots .dot").forEach((dot, index) => {
        if (index + 1 === slideNumber) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// Интерактивное открытие скрытых ответов на Слайде 3
function initAccordionReveal() {
    const accordionItems = document.querySelectorAll(".sci-item");

    accordionItems.forEach(item => {
        item.addEventListener("click", () => {
            const answerElement = item.querySelector(".sci-answer");
            
            // Если ответ уже открыт — скрываем его, иначе — открываем
            if (answerElement.classList.contains("hidden-answer")) {
                answerElement.classList.remove("hidden-answer");
                item.style.borderColor = "var(--primary-color)";
                item.style.backgroundColor = "var(--primary-light)";
            } else {
                answerElement.classList.add("hidden-answer");
                item.style.borderColor = "#e0e0e0";
                item.style.backgroundColor = "#f5f5f5";
            }
        });
    });
}
// Перезапускаем инициализацию, добавляя игровой движок в очередь загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    initClassGame();
});

// ==========================================================================
// 5. ИГРОВОЙ ДВИЖОК «БИО-ЗНАТОКИ» С ВСТРОЕННЫМ ТАЙМЕРОМ
// ==========================================================================
let timerInterval = null; // Переменная для хранения счетчика времени

function initClassGame() {
    document.getElementById("btn-generate-question").addEventListener("click", generateNewQuestion);
    document.getElementById("btn-reset-game").addEventListener("click", resetFullGame);
}

// Запуск и управление таймером обратного отсчета
function startQuizTimer() {
    clearInterval(timerInterval); // Сбрасываем прошлый таймер, если он работал
    
    let timeLeft = 30; // Задаем 30 секунд на размышление
    const timerBox = document.getElementById("game-timer-box");
    const timerCounter = document.getElementById("timer-counter");
    
    timerBox.classList.remove("hidden-element", "timer-urgent");
    timerCounter.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerCounter.textContent = timeLeft;

        // Если осталось 10 секунд или меньше — включаем красную подсветку
        if (timeLeft <= 10) {
            timerBox.classList.add("timer-urgent");
        }

        // Если время полностью вышло
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut(); // Вызываем автоматическое поражение в раунде
        }
    }, 1000);
}

// Обработка ситуации, когда класс не успел ответить за 30 секунд
function handleTimeOut() {
    const feedbackEl = document.getElementById("game-feedback");
    const correctOptionText = lessonState.currentQuestion.correct;

    // Блокируем кнопки
    const allOptions = document.querySelectorAll(".btn-game-option");
    allOptions.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctOptionText) {
            btn.classList.add("correct-choice"); // Показываем правильный ответ
        }
    });

    feedbackEl.textContent = `⏰ Время вышло! Класс не успел дать ответ. Правильный вариант: ${correctOptionText}. ${lessonState.currentQuestion.hint}`;
    feedbackEl.className = "game-feedback error";
    feedbackEl.classList.remove("hidden-element");

    lessonState.round++;
    document.getElementById("game-round-counter").textContent = lessonState.round;
}

// Генерация нового случайного вопроса
function generateNewQuestion() {
    const feedbackEl = document.getElementById("game-feedback");
    feedbackEl.className = "game-feedback hidden-element";
    
    const randomIndex = Math.floor(Math.random() * gameQuestions.length);
    lessonState.currentQuestion = gameQuestions[randomIndex];

    document.getElementById("game-question-text").textContent = lessonState.currentQuestion.question;

    const gridContainer = document.getElementById("game-options-grid");
    gridContainer.innerHTML = "";
    gridContainer.classList.remove("hidden-element");

    lessonState.currentQuestion.options.forEach(optionText => {
        const optionButton = document.createElement("button");
        optionButton.className = "btn-game-option";
        optionButton.textContent = optionText;

        optionButton.addEventListener("click", () => {
            // При клике останавливаем таймер и проверяем ответ
            clearInterval(timerInterval);
            handleClassAnswer(optionButton, optionText);
        });

        gridContainer.appendChild(optionButton);
    });

    document.getElementById("btn-generate-question").textContent = "⏭ Следующий вопрос";
    
    // Включаем таймер для нового вопроса!
    startQuizTimer();
}

// Обработка ответа, выбранного классом
function handleClassAnswer(clickedButton, selectedText) {
    const feedbackEl = document.getElementById("game-feedback");
    const correctOptionText = lessonState.currentQuestion.correct;

    const allOptions = document.querySelectorAll(".btn-game-option");
    allOptions.forEach(btn => btn.disabled = true);

    if (selectedText === correctOptionText) {
        clickedButton.classList.add("correct-choice");
        lessonState.score += 10;
        document.getElementById("class-score").textContent = lessonState.score;

        feedbackEl.textContent = `🎉 Верно! Молодец! ${lessonState.currentQuestion.hint}`;
        feedbackEl.className = "game-feedback success";
    } else {
        clickedButton.classList.add("wrong-choice");
        allOptions.forEach(btn => {
            if (btn.textContent === correctOptionText) {
                btn.classList.add("correct-choice");
            }
        });

        feedbackEl.textContent = `❌ Ошибка класса! На самом деле это ${correctOptionText}. ${lessonState.currentQuestion.hint}`;
        feedbackEl.className = "game-feedback error";
    }

    feedbackEl.classList.remove("hidden-element");
    lessonState.round++;
    document.getElementById("game-round-counter").textContent = lessonState.round;
}

// Полный сброс игры
function resetFullGame() {
    clearInterval(timerInterval); // Тушим таймер
    lessonState.score = 0;
    lessonState.round = 1;
    lessonState.currentQuestion = null;

    document.getElementById("class-score").textContent = "0";
    document.getElementById("game-round-counter").textContent = "1";
    document.getElementById("game-question-text").textContent = "Нажмите на кнопку ниже, чтобы начать игру и получить первый вопрос для класса!";
    
    const gridContainer = document.getElementById("game-options-grid");
    gridContainer.innerHTML = "";
    gridContainer.classList.add("hidden-element");

    const feedbackEl = document.getElementById("game-feedback");
    feedbackEl.className = "game-feedback hidden-element";

    const timerBox = document.getElementById("game-timer-box");
    timerBox.className = "game-timer-box hidden-element";

    document.getElementById("btn-generate-question").textContent = "🎲 Сгенерировать вопрос";
}
