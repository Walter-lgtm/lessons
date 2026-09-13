document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ Системы Асгарда и базы данных Google успешно синхронизированы!");

    const attendanceModal = document.getElementById('attendance-modal');
    const attendanceForm = document.getElementById('attendance-form');
    const studentFioInput = document.getElementById('student-fio');
    const studentClassSelect = document.getElementById('student-class');

    const startOverlay = document.getElementById('start-overlay');
    const lokiVideo = document.getElementById('loki-video');
    const lokiAudio = document.getElementById('loki-audio');
    const videoWrapper = document.getElementById('video-wrapper');
    const menuNavigation = document.getElementById('menu-navigation');
    const menuButtons = document.querySelectorAll('.menu-btn');

    // ПРОВЕРКА ПАМЯТИ: Слушал ли ученик Локи ранее в этой сессии?
    if (sessionStorage.getItem('loki_welcomed') === 'true') {
        console.log("📜 Ученик вернулся. Пропускаем регистрацию и интро.");
        
        if (attendanceModal) { attendanceModal.style.display = 'none'; }
        if (startOverlay) { startOverlay.style.display = 'none'; }
        
        videoWrapper.classList.remove('full-screen');
        videoWrapper.classList.add('widget-screen');
        menuNavigation.classList.remove('hidden');
        
        if (lokiVideo) {
            lokiVideo.play().catch(err => console.log("Фоновое видео ожидает"));
        }
        
        initNavigation();
        return;
    }

    // ЛОГИКА ОТПРАВКИ ДАННЫХ В GOOGLE ТАБЛИЦУ
    attendanceForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Отменяем перезагрузку страницы

        const fioValue = studentFioInput.value.trim();
        const classValue = studentClassSelect.value;

        // 1. ВСТАВЬТЕ СЮДА ВАШИ ИСТИННЫЕ ENTRY-ID ИЗ КОНСОЛИ F12:
        const entryID_FIO = "entry.1900111823";   // Замените на ваш номер для ФИО
        const entryID_Class = "entry.584658132"; // Замените на ваш номер для Класса

        // 2. ПРОСТО ВСТАВЬТЕ СЮДА ВАШУ ПОЛНУЮ ССЫЛКУ С formResponse НА КОНЦЕ:
        const googleFormBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSefmTw1h-4SDfm8IQFnrhYJh-vC2TyYE8pZVArQGyHtNNyjHQ/formResponse";

        // Скрипт сам аккуратно прикрепит ответы ученика к вашей ссылке
        const googleFormFullUrl = `${googleFormBaseUrl}?submit=Submit&${entryID_FIO}=${encodeURIComponent(fioValue)}&${entryID_Class}=${encodeURIComponent(classValue)}`;

        // Отправляем данные в Google в фоновом режиме
        fetch(googleFormFullUrl, { mode: 'no-cors' })
            .then(() => {
                console.log("🚀 Данные ученика успешно улетели в Google Таблицу!");
            })
            .catch((err) => {
                console.error("Ошибка сети, но урок продолжаем:", err);
            });

        // Плавно прячем окно регистрации и открываем оверлей Локи
        attendanceModal.style.opacity = '0';
        setTimeout(() => {
            attendanceModal.style.display = 'none';
        }, 500);
        
        console.log("🔒 Доступ к уроку открыт.");
    });

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
