// ==========================================
// КИБЕРМАГИЯ ЛОКИ: ЛОГИКА ИНТРО И НАВИГАЦИИ
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ КиберАсгард запущен. Локи готовится к встрече с 5 классом!");

    const startOverlay = document.getElementById('start-overlay');
    const lokiVideo = document.getElementById('loki-video');
    const videoWrapper = document.getElementById('video-wrapper');
    const menuNavigation = document.getElementById('menu-navigation');
    const menuButtons = document.querySelectorAll('.menu-btn');

    // 1. НАЧАЛО УРОКА: Клик по стартовой кнопке (БРОНЕБОЙНАЯ СТРАХОВКА)
    startOverlay.addEventListener('click', () => {
        // Плавно прячем темный оверлей-заглушку
        startOverlay.style.opacity = '0';
        setTimeout(() => {
            startOverlay.style.display = 'none';
        }, 500);

        // Проверяем, загрузилось ли видео вообще (networkState 3 означает "нет источника")
        // Либо проверяем на базовую ошибку до запуска плеера
        if (!lokiVideo || lokiVideo.networkState === 3 || lokiVideo.error) {
            console.warn("⚠️ Видеофайл не найден на сервере. Мгновенно активируем меню.");
            showMenuImmediately();
            return; // Выходим из функции, не мучая браузер попытками запуска
        }

        // Если файл вроде бы на месте, пробуем запустить
        lokiVideo.muted = false;
        lokiVideo.play().catch(error => {
            console.error("Браузер заблокировал плеер или файл поврежден:", error);
            // Спасаем интерфейс в любом случае, если что-то пошло не так
            showMenuImmediately();
        });

        // На случай, если видео просто зависло при загрузке — тайм-аут безопасности на 3 секунды
        setTimeout(() => {
            if (menuNavigation.classList.contains('hidden')) {
                console.log("Страховочный таймер сработал: принудительно открываем меню.");
                showMenuImmediately();
            }
        }, 3000);
    });

    // ФУНКЦИЯ-СПАСАТЕЛЬ: мгновенно сворачивает видео-блок и выводит кнопки
    function showMenuImmediately() {
        if (lokiVideo) {
            lokiVideo.pause(); // На всякий случай останавливаем плеер
        }
        videoWrapper.classList.remove('full-screen');
        videoWrapper.classList.add('widget-screen');
        menuNavigation.classList.remove('hidden');
        console.log("✅ Кнопки меню успешно выведены на экран!");
    }

    // 2. ФИНАЛ РЕЧИ ЛОКИ: Видео закончилось (штатный режим)
    lokiVideo.addEventListener('ended', () => {
        console.log("📜 Локи закончил приветствие. Минимизируем видеоролик...");
        videoWrapper.classList.remove('full-screen');
        videoWrapper.classList.add('widget-screen');

        setTimeout(() => {
            menuNavigation.classList.remove('hidden');
        }, 1000);
    });

    // 3. НАВИГАЦИЯ ПО КНОПКАМ: Переходы в микроприложения
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const targetUrl = button.getAttribute('data-url');

            button.style.boxShadow = '0 0 40px #00ff88, inset 0 0 20px #e6c687';
            button.style.transform = 'scale(0.96)';

            menuButtons.forEach(btn => btn.style.pointerEvents = 'none');

            setTimeout(() => {
                if (targetUrl) {
                    window.location.href = targetUrl;
                } else {
                    console.error("Ошибка: В кнопке не прописан атрибут data-url!");
                    menuButtons.forEach(btn => btn.style.pointerEvents = 'auto');
                }
            }, 400);
        });
    });
});
