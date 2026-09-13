document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ КиберАсгард запущен. Движок памяти переходов активен!");

    const startOverlay = document.getElementById('start-overlay');
    const lokiVideo = document.getElementById('loki-video');
    const lokiAudio = document.getElementById('loki-audio');
    const videoWrapper = document.getElementById('video-wrapper');
    const menuNavigation = document.getElementById('menu-navigation');
    const menuButtons = document.querySelectorAll('.menu-btn');

    // ПРОВЕРКА ПАМЯТИ: Слушал ли ученик Локи ранее в этой сессии?
    if (sessionStorage.getItem('loki_welcomed') === 'true') {
        console.log("📜 Ученик уже вернулся в меню. Пропускаем интро и сразу открываем кнопки.");
        
        // Мгновенно убираем заставку
        if (startOverlay) { startOverlay.style.display = 'none'; }
        
        // Переводим видеоплеер в режим маленького виджета
        videoWrapper.classList.remove('full-screen');
        videoWrapper.classList.add('widget-screen');
        
        // Сразу показываем кнопки (без анимации ожидания)
        menuNavigation.classList.remove('hidden');
        
        // По желанию: запускаем фоновое видео в маленьком окошке, но без звука
        if (lokiVideo) {
            lokiVideo.play().catch(err => console.log("Фоновое видео ожидает клика"));
        }
        
        // Инициализируем навигацию по кнопкам и выходим, не запуская стартовые обработчики
        initNavigation();
        return;
    }

    // --- ЛОГИКА ДЛЯ ПЕРВОГО ЗАХОДА НА САЙТ ---

    // 1. НАЧАЛО УРОКА: Клик по стартовой кнопке (ФИКС ДЛЯ СМАРТФОНОВ)
    startOverlay.addEventListener('click', () => {
        // МОБИЛЬНЫЙ ХАК: Принудительно "активируем" аудио для Safari/Chrome на смартфонах
        if (lokiAudio) {
            lokiAudio.load(); // Перезагружаем аудио в контексте клика
            lokiAudio.muted = false; // Гарантируем, что звук включен
        }

        // Плавно скрываем темную заставку
        startOverlay.style.opacity = '0';
        setTimeout(() => {
            startOverlay.style.display = 'none';
        }, 500);

        // КИБЕР-СТРАХОВКА: Если файлы потерялись, сразу выводим меню
        const handleError = () => {
            console.warn("⚠️ Медиафайлы интро не найдены. Включаем меню напрямую.");
            showMenuImmediately();
        };
        lokiAudio.addEventListener('error', handleError);
        lokiVideo.addEventListener('error', handleError);

        // Запускаем бесконечное фоновое видео Локи
        if (lokiVideo) {
            lokiVideo.play().catch(err => console.error("Блокировка видео:", err));
        }

        // Запускаем аудиодорожку речи Локи с задержкой в 50мс, чтобы браузер успел обработать активацию
        setTimeout(() => {
            if (lokiAudio) {
                lokiAudio.play().then(() => {
                    console.log("🔊 Речь Локи успешно запущена на смартфоне!");
                }).catch(error => {
                    console.error("⚠️ Смартфон всё-таки заблокировал звук:", error);
                    // Спасаем приложение: если звук заблокирован, сразу открываем меню через 1.5 секунды
                    setTimeout(showMenuImmediately, 1500);
                });
            }
        }, 50);
    });

    // 2. ФИНАЛ РЕЧИ: Аудио закончилось -> Минимизация и сохранение метки памяти
    lokiAudio.addEventListener('ended', () => {
        console.log("📜 Речь Локи завершена. Запоминаем визит ученика...");
        
        // ОСТАВЛЯЕМ СЕКРЕТНУЮ МЕТКУ В БРАУЗЕРЕ
        sessionStorage.setItem('loki_welcomed', 'true');
        
        showMenuImmediately();
    });

    // Функция трансформации экрана при первом прослушивании
    function showMenuImmediately() {
        videoWrapper.classList.remove('full-screen');
        videoWrapper.classList.add('widget-screen');
        
        setTimeout(() => {
            menuNavigation.classList.remove('hidden');
        }, 600);
    }

    // Запуск обработчиков кнопок меню
    initNavigation();

    // 3. НАВИГАЦИЯ ПО КНОПКАМ: Переходы в микроприложения
    function initNavigation() {
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
                        console.error("Ошибка: В кнопке не прописан data-url!");
                        menuButtons.forEach(btn => btn.style.pointerEvents = 'auto');
                    }
                }, 400);
            });
        });
    }
});
