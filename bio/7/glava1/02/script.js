// ==========================================================================
// 1. БАЗА ДАННЫХ И СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ==========================================================================

// Список растений для тренажера. У каждого строго определены 7 таксонов
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

// Список названий рангов по порядку
const ranksOrder = ["Царство", "Отдел", "Класс", "Порядок", "Семейство", "Род", "Вид"];

// Глобальное состояние игры
let gameState = {
    currentPlant: null,
    score: 0,
    userAnswers: {}, // Структура: { "Царство": "Растения", "Отдел": null, ... }
    isChecked: false
};

// ==========================================================================
// 2. ИНИЦИАЛИЗАЦИЯ И ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initLearningSection();
    initQuiz();
});

// Навигация между Обучением и Тренажером
function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".content-section");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Убираем активный класс у всех кнопок и разделов
            navButtons.forEach(btn => btn.classList.remove("active"));
            sections.forEach(sec => sec.classList.add("hidden"));

            // Добавляем активный класс нажатой кнопке и нужному разделу
            button.classList.add("active");
            const targetId = button.getAttribute("data-target");
            document.getElementById(targetId).classList.remove("hidden");
        });
    });
}
// ==========================================================================
// 3. ИНТЕРАКТИВ ДЛЯ РАЗДЕЛА «ОБУЧЕНИЕ»
// ==========================================================================
function initLearningSection() {
    const taxonomyItems = document.querySelectorAll(".taxonomy-item");
    const infoBox = document.getElementById("info-box");
    const infoText = document.getElementById("info-text");

    taxonomyItems.forEach(item => {
        item.addEventListener("click", () => {
            const info = item.getAttribute("data-info");
            const rank = item.querySelector(".rank").textContent;
            
            // Выводим текст в блок подсказок
            infoText.innerHTML = `<strong>${rank}:</strong> ${info}`;
            infoBox.classList.remove("hidden");
            
            // Легкий визуальный эффект выделения
            taxonomyItems.forEach(el => el.style.borderColor = "#c8e6c9");
            item.style.borderColor = "var(--accent-color)";
        });
    });
}

// ==========================================================================
// 4. ЛОГИКА ТРЕНАЖЕРА: ЗАПУСК И ГЕНЕРАЦИЯ ИГРЫ
// ==========================================================================
function initQuiz() {
    // Подвешиваем обработчики на кнопки управления
    document.getElementById("check-btn").addEventListener("click", checkAnswers);
    document.getElementById("reset-btn").addEventListener("click", resetQuiz);
    document.getElementById("next-btn").addEventListener("click", loadNewPlant);

    // Запускаем первое задание
    loadNewPlant();
}

// Загрузка нового растения в тренажер
function loadNewPlant() {
    // Выбираем случайное растение из базы данных
    const randomIndex = Math.floor(Math.random() * plantsData.length);
    gameState.currentPlant = plantsData[randomIndex];
    
    // Сбрасываем промежуточные состояния
    gameState.userAnswers = {};
    gameState.isChecked = false;
    ranksOrder.forEach(rank => gameState.userAnswers[rank] = null);

    // Обновляем интерфейс
    document.getElementById("target-plant-name").textContent = gameState.currentPlant.name;
    document.getElementById("feedback-message").className = "feedback-message hidden";
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("check-btn").classList.remove("hidden");

    renderSlots();
    renderOptions();
}

// Создание пустых слотов для сборки
function renderSlots() {
    const container = document.getElementById("slots-container");
    container.innerHTML = ""; // Очищаем старые

    ranksOrder.forEach(rank => {
        const slot = document.createElement("div");
        slot.className = "quiz-slot";
        slot.setAttribute("data-rank", rank);

        slot.innerHTML = `
            <div class="slot-rank-label">${rank}</div>
            <div class="slot-card-holder"></div>
        `;

        // Клик по слоту возвращает карточку обратно, если она там есть
        slot.addEventListener("click", () => {
            if (gameState.isChecked) return; // Запрет после проверки
            if (gameState.userAnswers[rank]) {
                removeCardFromSlot(rank);
            }
        });

        container.appendChild(slot);
    });
}

// Создание и перемешивание карточек вариантов
function renderOptions() {
    const container = document.getElementById("options-container");
    container.innerHTML = "";

    // Берем правильные ответы для текущего растения
    const taxonomy = gameState.currentPlant.taxonomy;
    
    // Создаем массив объектов для карточек
    let cards = ranksOrder.map(rank => ({
        rank: rank,
        text: taxonomy[rank]
    }));

    // Алгоритм случайного перемешивания (Тасование Фишера-Йетса)
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // Выводим перемешанные карточки на экран
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "quiz-card";
        cardElement.textContent = card.text;
        cardElement.setAttribute("data-rank", card.rank);
        cardElement.setAttribute("data-text", card.text);

        // Клик по карточке отправляет её в первый свободный слот
        cardElement.addEventListener("click", () => {
            if (gameState.isChecked) return;
            if (!cardElement.classList.contains("hidden-card")) {
                autoPlaceCard(card);
            }
        });

        container.appendChild(cardElement);
    });
}
// ==========================================================================
// 5. УПРАВЛЕНИЕ КАРТОЧКАМИ (РАСПРЕДЕЛЕНИЕ И УДАЛЕНИЕ)
// ==========================================================================

// Автоматическое размещение карточки в первый подходящий или свободный слот
function autoPlaceCard(cardData) {
    // Ищем первый пустой ранг в ответах пользователя
    const freeRank = ranksOrder.find(rank => !gameState.userAnswers[rank]);
    
    if (!freeRank) {
        alert("Все ячейки уже заполнены! Чтобы освободить место, нажмите на карточку в цепочке.");
        return;
    }

    // Записываем выбор в состояние игры
    gameState.userAnswers[freeRank] = cardData.text;

    // Находим визуальный слот и добавляем в него текст карточки
    const slot = document.querySelector(`.quiz-slot[data-rank="${freeRank}"]`);
    const holder = slot.querySelector(".slot-card-holder");
    
    const cardInSlot = document.createElement("div");
    cardInSlot.className = "quiz-card";
    cardInSlot.textContent = cardData.text;
    holder.appendChild(cardInSlot);

    // Скрываем (делаем полупрозрачной) исходную карточку в нижнем блоке вариантов
    const optionCard = document.querySelector(`.options-container .quiz-card[data-text="${cardData.text}"]`);
    if (optionCard) {
        optionCard.classList.add("hidden-card");
    }
}

// Удаление карточки из слота обратно в список вариантов
function removeCardFromSlot(rank) {
    const textToRemove = gameState.userAnswers[rank];
    if (!textToRemove) return;

    // Очищаем состояние для этого ранга
    gameState.userAnswers[rank] = null;

    // Очищаем визуальный слот
    const slot = document.querySelector(`.quiz-slot[data-rank="${rank}"]`);
    const holder = slot.querySelector(".slot-card-holder");
    holder.innerHTML = "";

    // Возвращаем активность карточке в списке доступных вариантов
    const optionCard = document.querySelector(`.options-container .quiz-card[data-text="${textToRemove}"]`);
    if (optionCard) {
        optionCard.classList.remove("hidden-card");
    }
}

// ==========================================================================
// 6. ПРОВЕРКА ОТВЕТОВ, СЧЕТ И СБРОС ИГРЫ
// ==========================================================================

// Проверка собранной цепочки
function checkAnswers() {
    // Проверяем, заполнил ли пользователь все 7 слотов
    const isEverythingFilled = ranksOrder.every(rank => gameState.userAnswers[rank] !== null);
    
    if (!isEverythingFilled) {
        const feedback = document.getElementById("feedback-message");
        feedback.textContent = "⚠️ Сначала заполните все 7 ячеек систематики!";
        feedback.className = "feedback-message error";
        feedback.classList.remove("hidden");
        return;
    }

    gameState.isChecked = true;
    const correctTaxonomy = gameState.currentPlant.taxonomy;
    let errorsCount = 0;

    // Поочередно проверяем каждый слот
    ranksOrder.forEach(rank => {
        const slot = document.querySelector(`.quiz-slot[data-rank="${rank}"]`);
        
        if (gameState.userAnswers[rank] === correctTaxonomy[rank]) {
            slot.classList.add("correct-slot");
        } else {
            slot.classList.add("wrong-slot");
            errorsCount++;
        }
    });

    // Выводим вердикт пользователю
    const feedback = document.getElementById("feedback-message");
    if (errorsCount === 0) {
        gameState.score++;
        document.getElementById("score-counter").textContent = gameState.score;
        feedback.textContent = "🎉 Великолепно! Цепочка систематики составлена абсолютно верно!";
        feedback.className = "feedback-message success";
    } else {
        feedback.textContent = `❌ Ошибка! Не все таксоны на своих местах. Ошибок: ${errorsCount}. Изучи подсказки и попробуй снова или перейди к новому растению.`;
        feedback.className = "feedback-message error";
    }

    feedback.classList.remove("hidden");
    
    // Меняем видимость кнопок управления
    document.getElementById("check-btn").classList.add("hidden");
    document.getElementById("next-btn").classList.remove("hidden");
}

// Кнопка «Сбросить» — возвращает карточки на место в рамках текущего задания
function resetQuiz() {
    // Очищаем результаты проверки
    const slots = document.querySelectorAll(".quiz-slot");
    slots.forEach(slot => {
        slot.classList.remove("correct-slot", "wrong-slot");
        slot.querySelector(".slot-card-holder").innerHTML = "";
    });

    // Возвращаем все карточки вариантов в активное состояние
    const optionCards = document.querySelectorAll(".options-container .quiz-card");
    optionCards.forEach(card => card.classList.remove("hidden-card"));

    // Сбрасываем ответы в состоянии игры
    gameState.userAnswers = {};
    ranksOrder.forEach(rank => gameState.userAnswers[rank] = null);
    gameState.isChecked = false;

    // Скрываем сообщение
    document.getElementById("feedback-message").className = "feedback-message hidden";
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("check-btn").classList.remove("hidden");
}
