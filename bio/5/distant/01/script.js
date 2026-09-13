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

    // 1. НАЧАЛО УРОКА: Клик по стартовой кнопке
    startOverlay.addEventListener('click', () => {
        // Плавно прячем темный оверлей-заглушку
        startOverlay.style.opacity = '0';
        setTimeout(() => {
            startOverlay.style.display = 'none';
        }, 500);

        // Включаем звук, запускаем видео с Локи на весь экран
        lokiVideo.muted = false;
        lokiVideo.play().catch(error => {
            console.error("Ошибка автозапуска видео. Браузер заблокировал звук:", error);
        });
    });

    // 2. ФИНАЛ РЕЧИ ЛОКИ: Видео закончилось -> Сжатие и появление меню
    lokiVideo.addEventListener('ended', () => {
        console.log("📜 Локи закончил приветствие. Минимизируем видеоролик...");

        // Переключаем CSS-классы: убираем полный экран, включаем режим виджета
        videoWrapper.classList.remove('full-screen');
        videoWrapper.classList.add('widget-screen');

        // Ждем 1 секунду (пока завершится плавная CSS-анимация сжатия видео)
        setTimeout(() => {
            // Убираем у кнопок меню класс .hidden — они плавно выплывают снизу
            menuNavigation.classList.remove('hidden');
        }, 1000);
    });

    // 3. НАВИГАЦИЯ ПО КНОПКАМ: Переходы в микроприложения
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const targetUrl = button.getAttribute('data-url');

            // Эффект магической вспышки при нажатии на кнопку
            button.style.boxShadow = '0 0 40px #00ff88, inset 0 0 20px #e6c687';
            button.style.transform = 'scale(0.96)';

            // Блокируем повторные нажатия, пока идет анимация перехода
            menuButtons.forEach(btn => btn.style.pointerEvents = 'none');

            // Делаем паузу в 400мс для визуального эффекта и перенаправляем на урок
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
