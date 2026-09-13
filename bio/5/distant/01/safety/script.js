/**
 * БАЗА ДАННЫХ ПРАВИЛ ТБ ОТ ЛОКИ (5 КЛАСС)
 * Каждая карточка содержит реальное школьное правило ТБ, 
 * адаптированное под скандинавский геймифицированный лор.
 */
const safetyRules = [
    {
        id: 1,
        title: "Запретные яства",
        text: "В кабинете биологии едят только знания! Жевать бутерброд рядом с микроскопом или пить воду из лабораторной колбы — верный способ вырастить в животе асгардского змея. Оставь перекусы для столовой.",
        icon: "fa-solid fa-cookie-bite",
        badge: "⚡ Строго табу"
    },
    {
        id: 2,
        title: "Острые артефакты",
        text: "Препаровальная игла и скальпель — это не игрушечные мечи. Передавай их товарищу только тупым концом (ручкой) вперед. Если поранишься сам или зацепишь соседа, магия крови нам не поможет, придется идти к медсестре.",
        icon: "fa-solid fa-hand-dots",
        badge: "⚔️ Опасное оружие"
    },
    {
        id: 3,
        title: "Хрупкие стекла",
        text: "Предметные и покровные стекла для микроскопа тоньше, чем лед в Йотунхейме. Нажимай на них аккуратно. Если стекло треснуло, не трогай осколки руками! Громко зови учителя — это ее магия убирать стекло.",
        icon: "fa-solid fa-burst",
        badge: "🔮 Хрупкий артефакт"
    },
    {
        id: 4,
        title: "Неизвестные зелья",
        text: "Увидел на столе красивую баночку с жидкостью? Не вздумай её пить, нюхать в упор или капать на соседа. На уроках биологии мы исследуем, а не устраиваем испытания ядов. Чувствуешь странный запах — направляй воздух ладонью к носу.",
        icon: "fa-solid fa-flask-vial",
        badge: "🧪 Тайные эликсиры"
    },
    {
        id: 5,
        title: "Поведение воинов",
        text: "Бег по кабинету биологии приравнивается к хаотичному шторму. Можно снести штатив, разбить микроскоп за миллион золотых монет или налететь на шкаф с чучелами. Передвигайся спокойно, как мудрый Один.",
        icon: "fa-solid fa-person-running",
        badge: "🛡️ Кодекс чести"
    },
    {
        id: 6,
        title: "Чистота — сила магии",
        text: "После того как ты изучил лапку мухи или кожицу лука, наведи порядок! Выключи микроскоп, сдай стёкла и вымой руки с мылом. Трикстеры любят чистоту, ведь грязь порождает злых монстров (и плохие оценки).",
        icon: "fa-solid fa-soap",
        badge: "🧹 Финал ритуала"
    }
];

// Массив фраз, которые Тор-лягушонок выдает при проверке
const thorQuotes = [
    "Ква-а-а! (Перевод: Я просто хотел попробовать на вкус тот синий раствор...)",
    "Ква-к! (Перевод: Не машите скальпелем, я так и лишился своего человеческого облика!)",
    "Квааа-ооок... (Перевод: Локи, верни мне Мьёльнир, я больше не буду бегать по классу!)",
    "Ква-ква! (Перевод: Слушайте учителя биологии, пацаны, иначе будете ловить мух вместе со мной.)"
];
/* ==========================================================================
   2. ИНИЦИАЛИЗАЦИЯ И ИНТЕРАКТИВНАЯ ЛОГИКА
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const rulesContainer = document.getElementById("rules-container");
    const lokiBubble = document.getElementById("loki-bubble");
    const thorFrog = document.getElementById("thor-frog");
    const checkThorBtn = document.getElementById("check-thor-btn");
    const checkResult = document.getElementById("check-result");

    // 1. Динамический рендеринг карточек-свитков
    function renderRules() {
        if (!rulesContainer) return;
        
        rulesContainer.innerHTML = safetyRules.map(rule => `
            <div class="rule-card" data-id="${rule.id}">
                <div class="rule-header">
                    <span class="rule-number">Свиток №${rule.id}</span>
                    <i class="${rule.icon} rule-icon"></i>
                </div>
                <h3 class="rule-title">${rule.title}</h3>
                <p class="rule-text">${rule.text}</p>
                <div class="rule-badge">${rule.badge}</div>
            </div>
        `).join('');
    }

    // 2. Интерактив от Локи при клике на карточки правил
    function setupRulesInteraction() {
        const cards = document.querySelectorAll(".rule-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                const ruleId = parseInt(card.getAttribute("data-id"));
                
                // Локи комментирует выбранное правило
                switch(ruleId) {
                    case 1:
                        lokiBubble.innerText = "😏 Еда в лаборатории? Тор как-то съел заколдованное яблоко на уроке... Теперь у него аллергия на мух. Учись на его ошибках!";
                        break;
                    case 2:
                        lokiBubble.innerText = "⚔️ Острыми предметами махать вздумал? Помни, настоящий трикстер побеждает умом, а не глупым размахиванием скальпелем!";
                        break;
                    case 3:
                        lokiBubble.innerText = "🔮 Стёкла очень хрупкие. Если Рагнарёк локального масштаба всё же случился — не паникуй, просто позови учителя.";
                        break;
                    case 4:
                        lokiBubble.innerText = "🧪 Нюхать жидкости в упор — это для глупых великанов. Будь хитрее, подманивай запах ладонью, как я учили!";
                        break;
                    case 5:
                        lokiBubble.innerText = "🛡️ Бег по классу? Если ты будешь носиться как шторм, Хеймдалль лично поставит тебе двойку в журнал. Ходи с гордостью царя.";
                        break;
                    case 6:
                        lokiBubble.innerText = "🧹 Порядок в конце — залог хорошего заклинания. Вымой руки, иначе микробы из кабинета биологии захватят Асгард!";
                        break;
                    default:
                        lokiBubble.innerText = "😏 Каждое из этих правил написано зелеными чернилами... Чернилами, в которые превратился Тор!";
                }
                
                // Легкий Pixar-эффект вспышки для облака текста
                lokiBubble.style.animation = 'none';
                lokiBubble.offsetHeight; // триггер рефлоу
                lokiBubble.style.animation = 'fadeIn 0.3s ease-out';
            });
        });
    }

    // 3. Магия Тора-лягушонка (случайные цитаты-кваканья)
    function makeThorCroak() {
        const randomIndex = Math.floor(Math.random() * thorQuotes.length);
        const randomQuote = thorQuotes[randomIndex];
        
        // Показываем перевод кваканья Тора
        checkResult.innerText = randomQuote;
        checkResult.classList.remove("hidden");
        
        // Локи дразнит брата в этот момент
        lokiBubble.innerText = "😏 Слышал? Вот так звучит полное нарушение параграфа №1 техники безопасности!";
    }

    // Слушатели событий для Тора
    if (thorFrog) {
        thorFrog.addEventListener("click", makeThorCroak);
    }
    
    if (checkThorBtn) {
        checkThorBtn.addEventListener("click", makeThorCroak);
    }

    // Запуск приложения
    renderRules();
    setupRulesInteraction();
});
