// ==========================================
// 1. НАВИГАЦИЯ И ПЕРЕХОДЫ МЕЖДУ ПРИЛОЖЕНИЯМИ
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Выводим приветствие в консоль (просто для настроения автора)
    console.log(" Loki Menu System: Магия Асгарда успешно активирована!");

    // Находим все кнопки в меню навигации
    const menuButtons = document.querySelectorAll('.menu-btn');

    // Навешиваем обработчик клика на каждую кнопку
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Предотвращаем стандартные сбои при клике
            event.preventDefault();

            // Получаем путь к приложению из атрибута data-url
            const targetUrl = button.getAttribute('data-url');

            // Запускаем магический эффект перед уходом со страницы
            triggerLokiTransition(button, targetUrl);
        });
    });
});

/**
 * Функция для создания эффекта перехода
 * @param {HTMLElement} clickedButton - кнопка, на которую нажали
 * @param {string} url - адрес, куда нужно перейти
 */
function triggerLokiTransition(clickedButton, url) {
    // Временно отключаем другие кнопки, чтобы пятиклассники не кликали по 100 раз
    document.querySelectorAll('.menu-btn').forEach(btn => btn.style.pointerEvents = 'none');

    // Добавляем кнопке класс сильной вспышки (сделаем его эффект во 2-й части)
    clickedButton.style.boxShadow = '0 0 40px #00ff88, inset 0 0 20px #e6c687';
    clickedButton.style.transform = 'scale(0.95)';

    // Делаем небольшую задержку в 400 миллисекунд для красоты, а затем перенаправляем
    setTimeout(() => {
        if (url) {
            window.location.href = url;
        } else {
            console.error("Ошибка: Путь к приложению (data-url) не указан!");
            // Возвращаем кликабельность, если произошла ошибка
            document.querySelectorAll('.menu-btn').forEach(btn => btn.style.pointerEvents = 'auto');
        }
    }, 400);
}
// ==========================================
// 2. ИНТЕРАКТИВ ОТ ЛОКИ И КНОПКА ВОЗВРАТА
// ==========================================

// Дополняем логику после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Магия Локи: Случайные фразы для пятиклассников ---
    const lokiQuotes = [
        "«Ну что, смертные, готовы к настоящей магии науки?»",
        "«Химия — это почти как мои иллюзии, только формулами!»",
        "«Биология полна тайн. Я знаю парочку... Хотите покажу?»",
        "«Обещаю вести себя прилично... Ну, почти прилично. Погнали?»",
        "«Пятый класс, сегодня мы перевернем эту лабораторию вверх дном!»"
    ];

    // Находим подзаголовок в HTML, чтобы вывести фразу туда
    const subtitle = document.querySelector('.game-subtitle');
    if (subtitle) {
        // Выбираем случайную фразу из массива
        const randomQuote = lokiQuotes[Math.floor(Math.random() * lokiQuotes.length)];
        
        // Плавно меняем подзаголовок на фразу Локи через секунду после загрузки
        setTimeout(() => {
            subtitle.style.opacity = '0';
            setTimeout(() => {
                subtitle.textContent = randomQuote;
                subtitle.style.color = '#e6c687'; // Меняем цвет на золотой для важности
                subtitle.style.opacity = '1';
                subtitle.style.fontStyle = 'italic';
            }, 300);
        }, 1000);
    }

    // --- Код для кнопки «На главное меню» в других приложениях ---
    // Этот кусочек будет искать на странице кнопку назад и возвращать ученика в меню
    const backButton = document.querySelector('.back-to-menu-btn');
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Укажите правильный путь к вашему главному меню index.html
            // Если приложения лежат в папках (например, biology/index.html), то путь будет '../index.html'
            window.location.href = '../index.html'; 
        });
    }
});
