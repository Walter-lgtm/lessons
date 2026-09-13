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

    // 1. НАЧАЛО УРОКА: Клик по стартовой кнопке (ОБНОВЛЕННЫЙ БЛОК СО СТРАХОВКОЙ)
    startOverlay.addEventListener('click', () => {
        // Плавно прячем темный оверлей-заглушку
        startOverlay.style.opacity = '0';
        setTimeout(() => {
            startOverlay.style.display = 'none';
        }, 500);

        // КИБЕР-СТРАХОВКА: Если видео-файла еще нет в папке, или он выдал ошибку загрузки
        lokiVideo.addEventListener('error', () => {
            console.warn("⚠️ Видео интро не найдено. Включаем меню без анимации.");
            showMenuImmediately(); // Мгновенно открываем кнопки
        });

        // Пытаемся запустить видео со звуком
        lokiVideo.muted = false;
        lokiVideo.play().catch(error => {
            console.error("Браузер заблокировал автозапуск:", error);
            // Если мобильный браузер наглухо заблокировал плеер, всё равно спасаем меню через 2 секунды
            setTimeout(showMenuImmediately, 2000);
        });
    });

    // ФУНКЦИЯ-СПАСАТЕЛЬ: мгновенно сворачивает пустое видео и выводит кнопки на экран
    function showMenuImmediately() {
        videoWrapper.classList.remove('full-screen');
        videoWrapper.classList.add('widget-screen');
        menuNavigation.classList.remove('hidden');
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
