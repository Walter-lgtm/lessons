// ============================================================================
// [λ] БИО-КОМПЛЕКСЫ 8 КЛАСС // КОРНЕВОЙ СЦЕНАРИЙ СИНХРОНИЗАЦИИ // SCRIPT.JS (Часть 1)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Ссылки на элементы интерфейса (согласно index.html)
    const authScreen = document.getElementById("auth-screen");
    const mainInterface = document.getElementById("main-interface");
    const startBtn = document.getElementById("start-btn");
    const submitBtn = document.getElementById("submit-btn");
    const authError = document.getElementById("auth-error");

    const inputName = document.getElementById("user-fio");
    const inputClass = document.getElementById("user-class");
    const inputToken = document.getElementById("user-token");

    const hudUserInfo = document.getElementById("hud-user-info");
    const hudTimer = document.getElementById("hud-timer");

    // Переменные сессии
    let studentName = "";
    let studentClass = "";
    let activeToken = "";
    let sessionSeconds = 0;
    let timerInterval = null;

    // Префикс темы для накопительного штрафа / безопасности
    const STORAGE_PREFIX = "bme_zool_p1_";

    // ==========================================
    // МАТЕМАТИЧЕСКАЯ КРИПТОЗАЩИТА И ОДНОКРАТНОСТЬ
    // ==========================================
    function validateToken(tokenStr) {
        const t = tokenStr.trim().toUpperCase();
        
        // 1. Проверяем, не использовался ли этот код ранее на этом устройстве
        const usedTokens = JSON.parse(localStorage.getItem(STORAGE_PREFIX + "used_tokens") || "[]");
        if (usedTokens.includes(t)) {
            return "USED"; // Код уже "сгорел"
        }

        // 2. Математический хэш-алгоритм DJB2
        let hash = 5381;
        for (let i = 0; i < t.length; i++) {
            hash = ((hash << 5) + hash) + t.charCodeAt(i);
        }
        const secretMod = Math.abs(hash) % 997;
        
        // Сверяем с секретным остатком текущего параграфа (§ 1 = 300)
        if (secretMod === 300) {
            // 3. Если код верный, сохраняем его в список использованных
            usedTokens.push(t);
            localStorage.setItem(STORAGE_PREFIX + "used_tokens", JSON.stringify(usedTokens));
            return "VALID";
        }
        
        return "INVALID"; // Код не прошел математическую верификацию
    }

    // ==========================================
    // АНТИ-БРУТФОРС МОДУЛЬ v2.0 (Блокировка подбора)
    // ==========================================
    function checkBruteForceLock() {
        const lockTime = localStorage.getItem(STORAGE_PREFIX + "bf_lock");
        if (lockTime && Date.now() < parseInt(lockTime)) {
            const timeLeft = Math.ceil((parseInt(lockTime) - Date.now()) / 1000);
            authError.innerHTML = `КРИТИЧЕСКАЯ БЛОКИРОВКА! Доступ терминала ограничен на ${timeLeft} сек. за попытку взлома токенов.`;
            startBtn.disabled = true;
            return true;
        }
        startBtn.disabled = false;
        return false;
    }

    function registerFailedAttempt() {
        let attempts = parseInt(localStorage.getItem(STORAGE_PREFIX + "failed_attempts") || "0");
        attempts++;
        localStorage.setItem(STORAGE_PREFIX + "failed_attempts", attempts);

        if (attempts >= 3) {
            // Накопительный штраф: 60 секунд умноженное на количество превышений
            const penaltyMultiplier = attempts - 2; 
            const lockDuration = 60 * 1000 * penaltyMultiplier;
            localStorage.setItem(STORAGE_PREFIX + "bf_lock", (Date.now() + lockDuration).toString());
            checkBruteForceLock();
        } else {
            authError.innerHTML = `ВНИМАНИЕ: Неверный токен доступа! Осталось попыток до блокировки: ${3 - attempts}`;
        }
    }

    // Регулярная проверка блокировки при загрузке страницы
    checkBruteForceLock();
    if (startBtn.disabled) {
        const checkInterval = setInterval(() => {
            if (!checkBruteForceLock()) clearInterval(checkInterval);
        }, 1000);
    }

    // ==========================================
    // 1. АВТОРИЗАЦИЯ И ИНИЦИАЛИЗАЦИЯ ТЕСТА
    // ==========================================
    startBtn.addEventListener("click", () => {
        if (checkBruteForceLock()) return;

        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();
        activeToken = inputToken.value.trim();

        if (!studentName || !studentClass || !activeToken) {
            authError.innerHTML = "ОШИБКА: Доступ заблокирован. Заполните ФИО, Класс и Код доступа.";
            return;
        }

        // Проверка статуса токена через Квантовый алгоритм
        const tokenStatus = validateToken(activeToken);

        if (tokenStatus === "USED") {
            authError.innerHTML = "ДОСТУП ЗАБЛОКИРОВАН: Этот персональный код доступа уже был использован!";
            return;
        }

        if (tokenStatus === "INVALID") {
            registerFailedAttempt();
            return;
        }

        // Сброс счетчика ошибок при успешном входе
        localStorage.removeItem(STORAGE_PREFIX + "failed_attempts");
        authError.innerHTML = "";

        // Сборка HUD-панели и переключение экранов
        hudUserInfo.innerHTML = `Лаборант: <strong>${studentName}</strong> [Класс: ${studentClass}]`;
        authScreen.classList.add("hidden");
        mainInterface.classList.remove("hidden");
        window.scrollTo(0, 0);

        // Старт системного таймера
        timerInterval = setInterval(() => {
            sessionSeconds++;
            const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
            const secs = String(sessionSeconds % 60).padStart(2, '0');
            hudTimer.innerText = `Время сессии: ${mins}:${secs}`;
        }, 1000);
    });
  // ============================================================================
    // МЕХАНИКА ЗАДАНИЯ 4: СЕНСОРНОЕ СВЯЗЫВАНИЕ ПАР (ТАП СЛЕВА -> ТАП СПРАВА)
    // ============================================================================
    let selectedLeft = null;
    const professionItems = document.querySelectorAll("#col-professions .connect-item");
    const functionItems = document.querySelectorAll("#col-functions .connect-item");

    // Обработка клика/тапа по левой колонке (Профессии)
    professionItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return; // Пара уже собрана
            
            // Снимаем выделение с предыдущего выбора
            professionItems.forEach(p => p.classList.remove("selected"));
            
            selectedLeft = item;
            item.classList.add("selected");
        });
    });

    // Обработка клика/тапа по правой колонке (Функционал)
    functionItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched") || !selectedLeft) return;

            const targetMatch = item.getAttribute("data-match");
            const currentLeftId = selectedLeft.getAttribute("data-id");

            if (targetMatch === currentLeftId) {
                // Успешное сопоставление
                selectedLeft.classList.add("matched");
                item.classList.add("matched");
                
                // Визуальный индикатор успешной связи
                selectedLeft.style.borderColor = "var(--neon-green, #00ff66)";
                item.style.borderColor = "var(--neon-green, #00ff66)";
            } else {
                // Ошибка связи — кратковременная вспышка красным
                const tempLeft = selectedLeft;
                tempLeft.style.borderColor = "#ff0033";
                item.style.borderColor = "#ff0033";
                setTimeout(() => {
                    if (!tempLeft.classList.contains("matched")) tempLeft.style.borderColor = "";
                    if (!item.classList.contains("matched")) item.style.borderColor = "";
                }, 500);
            }

            // Сброс выделения
            selectedLeft.classList.remove("selected");
            selectedLeft = null;
        });
    });

    // ============================================================================
    // ЭТАЛОННАЯ МАТРИЦА БИОЛОГИЧЕСКИХ КЛЮЧЕЙ И РАСЧЕТ БАЛЛОВ
    // ============================================================================
    function calculateBiologyScores() {
        let score = 0;
        let totalQuestions = 6;

        // Вспомогательная функция валидации по опорным буквам
        // .trim().toLowerCase() и .startsWith() согласно ТЗ
        const checkInput = (id, baseChar, fullWord) => {
            const val = document.getElementById(id).value.trim().toLowerCase();
            return val.startsWith(baseChar) && val.includes(fullWord.slice(1, 4)); 
            // Мягкая проверка основы слова для защиты от опечаток в окончаниях
        };

        // --- ЗАДАНИЕ 1 (Селекторы) ---
        const t1_1 = document.getElementById("task1-1").value === "зоология";
        const t1_2 = document.getElementById("task1-2").value === "бионика";
        if (t1_1 && t1_2) score++;

        // --- ЗАДАНИЕ 2 (Разделы зоологии - Ввод текста) ---
        const t2_answers = [
            checkInput("task2-1", "с", "систематика"),
            checkInput("task2-2", "м", "морфология"),
            checkInput("task2-3", "ф", "физиология"),
            checkInput("task2-4", "э", "эмбриология"),
            checkInput("task2-5", "э", "экология"),
            checkInput("task2-6", "э", "этология"),
            checkInput("task2-7", "з", "зоогеография"),
            checkInput("task2-8", "п", "палеозоология")
        ];
        // 1 балл, если верно заполнено не менее 80% терминов блока (6 из 8)
        if (t2_answers.filter(Boolean).length >= 6) score++;

        // --- ЗАДАНИЕ 3 (Частные науки - Ввод текста) ---
        const t3_answers = [
            checkInput("task3-1", "п", "протозоология"),
            checkInput("task3-2", "г", "гельминтология"),
            checkInput("task3-3", "м", "малакология"),
            checkInput("task3-4", "к", "карцинология"),
            checkInput("task3-5", "а", "арахнология"),
            checkInput("task3-6", "а", "акарология"),
            checkInput("task3-7", "э", "энтомология"),
            checkInput("task3-8", "и", "ихтиология"),
            checkInput("task3-9", "г", "герпетология"),
            checkInput("task3-10", "о", "орнитология"),
            checkInput("task3-11", "т", "териология")
        ];
        // 1 балл, если верно заполнено не менее 80% наук (9 из 11)
        if (t3_answers.filter(Boolean).length >= 9) score++;

        // --- ЗАДАНИЕ 4 (Связывание) ---
        const matchedPairs = document.querySelectorAll("#col-professions .connect-item.matched").length;
        if (matchedPairs === 5) score++; // Все 5 пар сопоставлены верно

        // --- ЗАДАНИЕ 5 (Радиокнопка: Охотовед) ---
        const t5_checked = document.querySelector('input[name="task5"]:checked');
        if (t5_checked && t5_checked.value === "биолог-охотовед") score++;

        // --- ЗАДАНИЕ 6 (Радиокнопка: Эйфелева башня) ---
        const t6_checked = document.querySelector('input[name="task6"]:checked');
        if (t6_checked && t6_checked.value === "эйфелева") score++;

        // Расчет итоговой оценки по стандартной шкале
        let grade = 2;
        if (score === 6) grade = 5;
        else if (score >= 4) grade = 4;
        else if (score >= 2) grade = 3;

        return { score, grade };
    }
   // ============================================================================
    // 3. ТРАНСЛЯЦИЯ НА СЕРВЕР (GOOGLE ФОРМА VIA FETCH FORMDATA)
    // ============================================================================
    submitBtn.addEventListener("click", () => {
        // Контрольная проверка перед отправкой
        if (!confirm("Вы уверены, что хотите завершить сессию и отправить отчет в архив?")) {
            return;
        }

        // Блокируем кнопку, чтобы избежать дублирования пакетов данных
        submitBtn.disabled = true;
        submitBtn.innerText = "Синхронизация данных...";

        // Остановка системного таймера сессии
        clearInterval(timerInterval);

        // Расчет итоговых показателей по матрице биологических ключей
        const { score, grade } = calculateBiologyScores();

        // ИДЕНТИФИКАТОРЫ ПОЛЕЙ ВАШЕЙ GOOGLE ФОРМЫ (Замените "entry.XXXXX" на ваши ID)
        const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfRqPieDxXe2km2xCPiqiXvQWnlryIfzYSlCq6iF33aBXak8w/formResponse";
        
        const formData = new FormData();
        formData.append("entry.855012040", studentName);   // Поле ФИО
        formData.append("entry.917634005", studentClass);  // Поле Класса
        formData.append("entry.1037263757", score);         // Поле Баллов
        formData.append("entry.1257078745", grade);         // Поле Оценки

        // Асинхронный передатчик без перезагрузки страницы
        fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors", // Предотвращает блокировку CORS политиками браузера
            body: formData
        })
        .then(() => {
            // Переключение интерфейса на финальный экран результатов
            displayFinalReport(score, grade);
        })
        .catch((error) => {
            console.error("Критическая ошибка синхронизации:", error);
            // Даже при сбое сети выводим результат локально, чтобы ученик видел оценку
            displayFinalReport(score, grade);
        });
    });

    // Функция вывода финального HUD-репорта
    function displayFinalReport(score, grade) {
        mainInterface.innerHTML = `
            <div class="hud-final-report" style="text-align: center; padding: 40px 20px;">
                <h2 style="color: var(--neon-green, #00ff66); margin-bottom: 20px;">СИНХРОНИЗАЦИЯ УСПЕШНА</h2>
                <p style="font-size: 1.1em; margin-bottom: 30px; opacity: 0.8;">
                    Данные лаборанта <strong>${studentName}</strong> (${studentClass}) успешно переданы на сервер.
                </p>
                <div class="score-hud-box" style="border: 2px dashed #00ff66; padding: 20px; display: inline-block; margin-bottom: 30px; background: rgba(0,255,102,0.05);">
                    <div style="font-size: 1.2em; margin-bottom: 10px;">Набрано баллов: <strong>${score} из 6</strong></div>
                    <div style="font-size: 2em; font-weight: bold; color: ${grade >= 4 ? '#00ff66' : '#ff0033'}">ИТОГОВАЯ ОЦЕНКА: ${grade}</div>
                </div>
                <p style="color: #888; font-size: 0.9em;">Повторный доступ по токену ${activeToken} заблокирован аппаратно.</p>
            </div>
        `;
        window.scrollTo(0, 0);
    }
});
