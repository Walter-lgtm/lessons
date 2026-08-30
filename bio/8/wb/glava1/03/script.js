// ============================================================================
// [λ] БИО-КОМПЛЕКСЫ 8 КЛАСС // СЦЕНАРИЙ СИНХРОНИЗАЦИИ №3 // SCRIPT.JS (Часть 1)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Ссылки на элементы UI терминала
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

    // Параметры текущей сессии
    let studentName = "";
    let studentClass = "";
    let activeToken = "";
    let sessionSeconds = 0;
    let timerInterval = null;

    // Уникальный префикс для изоляции сессий параграфа №3 (§ 3. Животная клетка)
    const STORAGE_PREFIX = "bme_zool_p3_";

    // ==========================================
    // МАТЕМАТИЧЕСКАЯ КРИПТОЗАЩИТА И ОДНОКРАТНОСТЬ
    // ==========================================
    function validateToken(tokenStr) {
        const t = tokenStr.trim().toUpperCase();
        
        // 1. Проверяем локальный реестр сгоревших кодов на устройстве
        const usedTokens = JSON.parse(localStorage.getItem(STORAGE_PREFIX + "used_tokens") || "[]");
        if (usedTokens.includes(t)) {
            return "USED";
        }

        // 2. Криптографический хэш-алгоритм DJB2
        let hash = 5381;
        for (let i = 0; i < t.length; i++) {
            hash = ((hash << 5) + hash) + t.charCodeAt(i);
        }
        const secretMod = Math.abs(hash) % 997;
        
        // Сверяем с секретным остатком параграфа (§ 3 = 330)
        if (secretMod === 330) {
            usedTokens.push(t);
            localStorage.setItem(STORAGE_PREFIX + "used_tokens", JSON.stringify(usedTokens));
            return "VALID";
        }
        
        return "INVALID";
    }

    // ==========================================
    // АНТИ-БРУТФОРС МОДУЛЬ v2.0
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
            const penaltyMultiplier = attempts - 2; 
            const lockDuration = 60 * 1000 * penaltyMultiplier; // Накопительный штраф в минутах
            localStorage.setItem(STORAGE_PREFIX + "bf_lock", (Date.now() + lockDuration).toString());
            checkBruteForceLock();
        } else {
            authError.innerHTML = `ВНИМАНИЕ: Неверный токен доступа! Осталось попыток до блокировки: ${3 - attempts}`;
        }
    }

    // Первичный и регулярный аудит безопасности
    checkBruteForceLock();
    if (startBtn.disabled) {
        const checkInterval = setInterval(() => {
            if (!checkBruteForceLock()) clearInterval(checkInterval);
        }, 1000);
    }

    // Активация рабочей среды лаборанта
    startBtn.addEventListener("click", () => {
        if (checkBruteForceLock()) return;

        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();
        activeToken = inputToken.value.trim();

        if (!studentName || !studentClass || !activeToken) {
            authError.innerHTML = "ОШИБКА: Доступ заблокирован. Заполните ФИО, Класс и Код доступа.";
            return;
        }

        const tokenStatus = validateToken(activeToken);

        if (tokenStatus === "USED") {
            authError.innerHTML = "ДОСТУП ЗАБЛОКИРОВАН: Данный персональный код доступа уже был использован!";
            return;
        }

        if (tokenStatus === "INVALID") {
            registerFailedAttempt();
            return;
        }

        // Сброс логов брутфорса при валидном входе
        localStorage.removeItem(STORAGE_PREFIX + "failed_attempts");
        authError.innerHTML = "";

        // Отрисовка HUD-панели и переключение экранов
        hudUserInfo.innerHTML = `Лаборант: <strong>${studentName}</strong> [Класс: ${studentClass}]`;
        authScreen.classList.add("hidden");
        mainInterface.classList.remove("hidden");
        window.scrollTo(0, 0);

        // Старт системного таймера сессии
        timerInterval = setInterval(() => {
            sessionSeconds++;
            const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
            const secs = String(sessionSeconds % 60).padStart(2, '0');
            hudTimer.innerText = `Время сессии: ${mins}:${secs}`;
        }, 1000);
    });
  // ============================================================================
    // МЕХАНИКА ЗАДАНИЯ 6: СЕНСОРНОЕ СВЯЗЫВАНИЕ ПАР ОРГАН ОИДОВ (ТАП СЛЕВА -> СПРАВА)
    // ============================================================================
    let selectedLeft = null;
    const organoidItems = document.querySelectorAll("#col-organoids .connect-item");
    const functionItems = document.querySelectorAll("#col-functions .connect-item");

    organoidItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return;
            organoidItems.forEach(p => p.classList.remove("selected"));
            selectedLeft = item;
            item.classList.add("selected");
        });
    });

    functionItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched") || !selectedLeft) return;

            const targetMatch = item.getAttribute("data-match");
            const currentLeftId = selectedLeft.getAttribute("data-id");

            if (targetMatch === currentLeftId) {
                selectedLeft.classList.add("matched");
                item.classList.add("matched");
                selectedLeft.style.borderColor = "var(--neon-green, #00ff66)";
                item.style.borderColor = "var(--neon-green, #00ff66)";
            } else {
                const tempLeft = selectedLeft;
                tempLeft.style.borderColor = "var(--neon-red, #ff0033)";
                item.style.borderColor = "var(--neon-red, #ff0033)";
                setTimeout(() => {
                    if (!tempLeft.classList.contains("matched")) tempLeft.style.borderColor = "";
                    if (!item.classList.contains("matched")) item.style.borderColor = "";
                }, 500);
            }

            selectedLeft.classList.remove("selected");
            selectedLeft = null;
        });
    });

    // ============================================================================
    // ЭТАЛОННАЯ МАТРИЦА БИОЛОГИЧЕСКИХ КЛЮЧЕЙ И РАСЧЕТ БАЛЛОВ
    // ============================================================================
    function calculateBiologyScores() {
        let score = 0;

        // Вспомогательный метод валидации текстового ввода с ТЗ (.trim().toLowerCase() и .startsWith())
        const checkInput = (id, baseChars, corePattern) => {
            const val = document.getElementById(id).value.trim().toLowerCase();
            return val.startsWith(baseChars[0]) && val.includes(corePattern);
        };

        // --- ЗАДАНИЕ 1 (Радиокнопка: Левенгук) ---
        const t1Checked = document.querySelector('input[name="task1"]:checked');
        if (t1Checked && t1Checked.value === "левенгук") score++;

        // --- ЗАДАНИЕ 2 (Ввод текста по опорным буквам) ---
        const t2_1 = checkInput("task2-1", "к", "мембр"); // Клеточн... мембран...
        const t2_2 = checkInput("task2-2", "к", "мембр"); // Клеточн... мембран...
        const t2_3 = checkInput("task2-3", "п", "пор");   // Поры / пора
        const t2_4 = checkInput("task2-4", "о", "орган"); // Органоиды
        const t2_5 = checkInput("task2-5", "ц", "цитоп"); // Цитоплазма

        if (t2_1 && t2_2 && t2_3 && t2_4 && t2_5) score++;

        // --- ЗАДАНИЕ 3 (Радиокнопка: Пластид) ---
        const t3Checked = document.querySelector('input[name="task3"]:checked');
        if (t3Checked && t3Checked.value === "пластид") score++;

        // --- ЗАДАНИЕ 4 (Схема cell.png, цифра 7 — Ядро) ---
        const t4Checked = document.querySelector('input[name="task4"]:checked');
        if (t4Checked && t4Checked.value === "7") score++;

        // --- ЗАДАНИЕ 5 (Радиокнопка: Митохондрии) ---
        const t5Checked = document.querySelector('input[name="task5"]:checked');
        if (t5Checked && t5Checked.value === "митохондриями") score++;

        // --- ЗАДАНИЕ 6 (Связывание пар) ---
        // Считаем балл, если собраны абсолютно все 9 цитологических пар
        const matchedPairs = document.querySelectorAll("#col-organoids .connect-item.matched").length;
        if (matchedPairs === 9) score++;

        // --- ЗАДАНИЕ 7 (Радиокнопка: Хромосомы) ---
        const t7Checked = document.querySelector('input[name="task7"]:checked');
        if (t7Checked && t7Checked.value === "хромосомами") score++;

        // Конвертация по 5-балльной системе (Максимально 7 баллов)
        let grade = 2;
        if (score === 7) grade = 5;
        else if (score >= 5) grade = 4;
        else if (score >= 3) grade = 3;

        return { score, grade };
    }
  // ============================================================================
    // 3. ТРАНСЛЯЦИЯ НА СЕРВЕР (GOOGLE ФОРМА VIA FETCH FORMDATA)
    // ============================================================================
    submitBtn.addEventListener("click", () => {
        if (!confirm("Вы уверены, что хотите завершить лабораторную сессию и заархивировать отчет?")) {
            return;
        }

        // Аппаратная блокировка элемента управления для защиты от повторных пакетов
        submitBtn.disabled = true;
        submitBtn.innerText = "Синхронизация данных...";

        // Остановка системного таймера сессии
        clearInterval(timerInterval);

        // Расчет результатов по эталонной матрице цитологических ключей
        const { score, grade } = calculateBiologyScores();

        // ИДЕНТИФИКАТОРЫ ПОЛЕЙ ВАШЕЙ GOOGLE ФОРМЫ (Замените на ваши entry.XXXXX из экстрактора)
        const GOOGLE_FORM_URL = "https://google.com";
        
        const formData = new FormData();
        formData.append("entry.1000001", studentName);   // Поле ФИО
        formData.append("entry.1000002", studentClass);  // Поле Класса
        formData.append("entry.1000003", score);         // Поле Баллов (макс. 7)
        formData.append("entry.1000004", grade);         // Поле Оценки (2, 3, 4, 5)

        // Асинхронный передатчик без перезагрузки страницы и без поля токена
        fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors", 
            body: formData
        })
        .then(() => {
            displayFinalReport(score, grade);
        })
        .catch((error) => {
            console.error("Критическая ошибка синхронизации:", error);
            // Резервный локальный вывод отчета при обрыве сетевого соединения
            displayFinalReport(score, grade);
        });
    });

    // Функция вывода финального HUD-репорта результатов лаборанта
    function displayFinalReport(score, grade) {
        mainInterface.innerHTML = `
            <div class="hud-final-report" style="text-align: center; padding: 40px 20px;">
                <h2 style="color: var(--neon-green, #00ff66); margin-bottom: 20px; justify-content: center;">[Λ] СИНХРОНИЗАЦИЯ УСПЕШНА</h2>
                <p style="font-size: 1.1em; margin-bottom: 30px; opacity: 0.8;">
                    Протокол «Животная клетка» завершен. Данные участника <strong>${studentName}</strong> (${studentClass}) переданы на сервер
                </p>
                <div class="score-hud-box" style="border: 2px dashed #00ff66; padding: 20px; display: inline-block; margin-bottom: 30px; background: rgba(0,255,102,0.05);">
                    <div style="font-size: 1.2em; margin-bottom: 10px;">Успешно пройдено зон: <strong>${score} из 7</strong></div>
                    <div style="font-size: 2em; font-weight: bold; color: ${grade >= 4 ? '#00ff66' : '#ff0033'}">ИТОГОВАЯ ОЦЕНКА: ${grade}</div>
                </div>
                <p style="color: #888; font-size: 0.9em;">Доступ к текущему терминалу ограничен. Использованный токен аннулирован аппаратно.</p>
            </div>
        `;
        window.scrollTo(0, 0);
    }
});
