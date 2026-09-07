// ==========================================================================
// 1. БАЗА ДАННЫХ И ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================================================================

// Список растений для интерактивного тренажера
const plantsData = [
    {
        id: "rosehip",
        name: "Шиповник коричный",
        taxonomy: {
            "Царство": "Растения",
            "Отдел": "Покрытосеменные",
            "Класс": "Двудольные",
            "Порядок": "Розоцветные",
            "Семейство": "Розовые",
            "Род": "Шиповник (Роза)",
            "Вид": "Шиповник коричный"
        }
    },
    {
        id: "wheat",
        name: "Пшеница твердая",
        taxonomy: {
            "Царство": "Растения",
            "Отдел": "Покрытосеменные",
            "Класс": "Однодольные",
            "Порядок": "Злакоцветные",
            "Семейство": "Злаки (Мятликовые)",
            "Род": "Пшеница",
            "Вид": "Пшеница твердая"
        }
    },
    {
        id: "pea",
        name: "Горох посевной",
        taxonomy: {
            "Царство": "Растения",
            "Отдел": "Покрытосеменные",
            "Класс": "Двудольные",
            "Порядок": "Бобовоцветные",
            "Семейство": "Бобовые",
            "Род": "Горох",
            "Вид": "Горох посевной"
        }
    },
    {
        id: "lily",
        name: "Ландыш майский",
        taxonomy: {
            "Царство": "Растения",
            "Отдел": "Покрытосеменные",
            "Класс": "Однодольные",
            "Порядок": "Лилиецветные",
            "Семейство": "Лилейные",
            "Род": "Ландыш",
            "Вид": "Ландыш майский"
        }
    }
];

// Строгий иерархический порядок рангов
const ranksOrder = ["Царство", "Отдел", "Класс", "Порядок", "Семейство", "Род", "Вид"];

// Состояние приложения (активный слайд, счет игры и ответы)
let appState = {
    currentSlide: 1,
    totalSlides: 4,
    currentPlant: null,
    score: 0,
    userAnswers: {},
    isQuizChecked: false
};

// ==========================================================================
// 2. ИНИЦИАЛИЗАЦИЯ И КОРНЕВАЯ НАВИГАЦИЯ
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initMainNavigation();
    initSliderSystem();
    initAccordion();
    initQuizEngine();
});

// Переключение между вкладками: "Уроки-Слайды" и "Тренажер"
function initMainNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".content-section");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            navButtons.forEach(btn => btn.classList.remove("active"));
            sections.forEach(sec => sec.classList.add("hidden"));

            button.classList.add("active");
            const targetId = button.getAttribute("data-target");
            document.getElementById(targetId).classList.remove("hidden");
        });
    });
}
// ==========================================================================
// 3. УПРАВЛЕНИЕ СЛАЙДОВОЙ СИСТЕМОЙ (ТЕОРИЯ)
// ==========================================================================
function initSliderSystem() {
    const prevBtn = document.getElementById("prev-slide-btn");
    const nextBtn = document.getElementById("next-slide-btn");
    const dotsContainer = document.getElementById("slide-dots");

    // Автоматически создаем круглые индикаторы-точки по числу слайдов
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= appState.totalSlides; i++) {
        const dot = document.createElement("div");
        dot.className = i === 1 ? "dot active" : "dot";
        dot.addEventListener("click", () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    }

    // Обработчики для кнопок "Назад" и "Вперед"
    prevBtn.addEventListener("click", () => {
        if (appState.currentSlide > 1) {
            goToSlide(appState.currentSlide - 1);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (appState.currentSlide < appState.totalSlides) {
            goToSlide(appState.currentSlide + 1);
        }
    });
}

// Функция переключения на конкретный слайд по номеру
function goToSlide(slideNumber) {
    // Скрываем текущий активный слайд
    document.querySelector(".theory-slide.active").classList.remove("active");
    
    // Активируем нужный слайд
    const targetSlide = document.querySelector(`.theory-slide[data-slide="${slideNumber}"]`);
    targetSlide.classList.add("active");

    // Обновляем состояние
    appState.currentSlide = slideNumber;

    // Обновляем состояние кнопок управления
    document.getElementById("prev-slide-btn").disabled = (slideNumber === 1);
    document.getElementById("next-slide-btn").disabled = (slideNumber === appState.totalSlides);

    // Обновляем активную точку-индикатор
    document.querySelectorAll(".slide-dots .dot").forEach((dot, index) => {
        if (index + 1 === slideNumber) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// Интерактивный аккордеон (Слайд 3)
function initAccordion() {
    const accItems = document.querySelectorAll(".acc-item");
    const infoBox = document.getElementById("slide-info-box");
    const infoText = document.getElementById("slide-info-text");

    accItems.forEach(item => {
        item.addEventListener("click", () => {
            const info = item.getAttribute("data-info");
            
            // Если этот элемент уже открыт — закрываем подсказку
            if (item.classList.contains("selected-item")) {
                item.classList.remove("selected-item");
                infoBox.classList.add("hidden-box");
            } else {
                // Иначе закрываем другие, открываем этот и выводим текст
                accItems.forEach(el => el.classList.remove("selected-item"));
                item.classList.add("selected-item");
                
                infoText.textContent = info;
                infoBox.classList.remove("hidden-box");
            }
        });
    });
}
// ==========================================================================
// 4. УПРАВЛЕНИЕ ИГРОВЫМ ТРЕНАЖЕРОМ
// ==========================================================================
function initQuizEngine() {
    document.getElementById("check-btn").addEventListener("click", checkQuizAnswers);
    document.getElementById("reset-btn").addEventListener("click", resetQuizField);
    document.getElementById("next-btn").addEventListener("click", loadQuizPlant);

    // Загружаем первое растение для тренировки
    loadQuizPlant();
}

// Выбор нового случайного растения из базы данных
function loadQuizPlant() {
    const randomIndex = Math.floor(Math.random() * plantsData.length);
    appState.currentPlant = plantsData[randomIndex];
    
    // Сбрасываем промежуточные данные
    appState.isQuizChecked = false;
    appState.userAnswers = {};
    ranksOrder.forEach(rank => appState.userAnswers[rank] = null);

    // Обновляем визуальный интерфейс кнопок и уведомлений
    document.getElementById("target-plant-name").textContent = appState.currentPlant.name;
    document.getElementById("feedback-message").className = "feedback-message hidden";
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("check-btn").classList.remove("hidden");

    renderQuizSlots();
    renderQuizOptions();
}

// Отрисовка пустых ячеек-рангов в зоне сборки
function renderQuizSlots() {
    const container = document.getElementById("slots-container");
    container.innerHTML = "";

    ranksOrder.forEach(rank => {
        const slot = document.createElement("div");
        slot.className = "quiz-slot";
        slot.setAttribute("data-rank", rank);

        slot.innerHTML = `
            <div class="slot-rank-label">${rank}</div>
            <div class="slot-card-holder"></div>
        `;

        // Клик по заполненному слоту убирает из него карточку обратно в варианты
        slot.addEventListener("click", () => {
            if (appState.isQuizChecked) return;
            if (appState.userAnswers[rank]) {
                removeCardFromQuizSlot(rank);
            }
        });

        container.appendChild(slot);
    });
}

// Генерация и перемешивание карточек с вариантами ответов
function renderQuizOptions() {
    const container = document.getElementById("options-container");
    container.innerHTML = "";

    const taxonomy = appState.currentPlant.taxonomy;
    
    // Формируем плоский массив карточек на основе таксономии текущего растения
    let cards = ranksOrder.map(rank => ({
        rank: rank,
        text: taxonomy[rank]
    }));

    // Перемешиваем карточки (Алгоритм Фишера-Йетса)
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // Выводим карточки на экран
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "quiz-card";
        cardElement.textContent = card.text;
        cardElement.setAttribute("data-text", card.text);

        // По клику отправляем карточку в первый пустой слот
        cardElement.addEventListener("click", () => {
            if (appState.isQuizChecked) return;
            if (!cardElement.classList.contains("hidden-card")) {
                placeCardInFirstFreeSlot(card);
            }
        });

        container.appendChild(cardElement);
    });
}

// Автоматический перенос карточки в первый свободный слот сверху вниз
function placeCardInFirstFreeSlot(cardData) {
    const freeRank = ranksOrder.find(rank => !appState.userAnswers[rank]);
    
    if (!freeRank) {
        alert("Все ячейки уже заполнены! Кликните по карточке в цепочке, чтобы убрать её.");
        return;
    }

    appState.userAnswers[freeRank] = cardData.text;

    const slot = document.querySelector(`.quiz-slot[data-rank="${freeRank}"]`);
    const holder = slot.querySelector(".slot-card-holder");
    
    const cardInSlot = document.createElement("div");
    cardInSlot.className = "quiz-card";
    cardInSlot.textContent = cardData.text;
    holder.appendChild(cardInSlot);

    // Делаем исходную карточку в пуле вариантов полупрозрачной
    const optionCard = document.querySelector(`.options-container .quiz-card[data-text="${cardData.text}"]`);
    if (optionCard) {
        optionCard.classList.add("hidden-card");
    }
}

// Удаление карточки из слота
function removeCardFromQuizSlot(rank) {
    const textToRemove = appState.userAnswers[rank];
    if (!textToRemove) return;

    appState.userAnswers[rank] = null;

    const slot = document.querySelector(`.quiz-slot[data-rank="${rank}"]`);
    slot.querySelector(".slot-card-holder").innerHTML = "";

    const optionCard = document.querySelector(`.options-container .quiz-card[data-text="${textToRemove}"]`);
    if (optionCard) {
        optionCard.classList.remove("hidden-card");
    }
}

// Проверка результатов сборки
function checkQuizAnswers() {
    const isAllFilled = ranksOrder.every(rank => appState.userAnswers[rank] !== null);
    
    if (!isAllFilled) {
        const feedback = document.getElementById("feedback-message");
        feedback.textContent = "⚠️ Сначала заполните все 7 ячеек систематики!";
        feedback.className = "feedback-message error";
        feedback.classList.remove("hidden");
        return;
    }

    appState.isQuizChecked = true;
    const correctTaxonomy = appState.currentPlant.taxonomy;
    let errors = 0;

    ranksOrder.forEach(rank => {
        const slot = document.querySelector(`.quiz-slot[data-rank="${rank}"]`);
        if (appState.userAnswers[rank] === correctTaxonomy[rank]) {
            slot.classList.add("correct-slot");
        } else {
            slot.classList.add("wrong-slot");
            errors++;
        }
    });

    const feedback = document.getElementById("feedback-message");
    if (errors === 0) {
        appState.score++;
        document.getElementById("score-counter").textContent = appState.score;
        feedback.textContent = "🎉 Великолепно! Цепочка систематики составлена абсолютно верно!";
        feedback.className = "feedback-message success";
    } else {
        feedback.textContent = `❌ Ошибка! Не все таксоны на своих местах. Ошибок: ${errors}. Попробуй сбросить поле или перейди к новому растению.`;
        feedback.className = "feedback-message error";
    }

    feedback.classList.remove("hidden");
    document.getElementById("check-btn").classList.add("hidden");
    document.getElementById("next-btn").classList.remove("hidden");
}

// Сброс текущего игрового раунда
function resetQuizField() {
    const slots = document.querySelectorAll(".quiz-slot");
    slots.forEach(slot => {
        slot.classList.remove("correct-slot", "wrong-slot");
        slot.querySelector(".slot-card-holder").innerHTML = "";
    });

    document.querySelectorAll(".options-container .quiz-card").forEach(card => card.classList.remove("hidden-card"));

    appState.userAnswers = {};
    ranksOrder.forEach(rank => appState.userAnswers[rank] = null);
    appState.isQuizChecked = false;

    document.getElementById("feedback-message").className = "feedback-message hidden";
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("check-btn").classList.remove("hidden");
}
