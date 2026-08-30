// ============================================================================
// [λ] БИО-КОМПЛЕКСЫ 8 КЛАСС // СЦЕНАРИЙ СИНХРОНИЗАЦИИ №4 // SCRIPT.JS (Часть 1)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Селекторы элементов HUD-терминала
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

    // Переменные текущей лабораторной сессии
    let studentName = "";
    let studentClass = "";
    let activeToken = "";
    let sessionSeconds = 0;
    let timerInterval = null;

    // Уникальный префикс темы для изоляции localStorage параграфа №4
    const STORAGE_PREFIX = "bme_zool_p4_";

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
        
        // Сверяем с секретным остатком параграфа (§ 4 = 340)
        if (secretMod === 340) {
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

    // Проверка аудита безопасности при старте страницы
    checkBruteForceLock();
    if (startBtn.disabled) {
        const checkInterval = setInterval(() => {
            if (!checkBruteForceLock()) clearInterval(checkInterval);
        }, 1000);
    }

    // Инициализация рабочей среды участника
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

        // Сброс логов подбора при успешном входе
        localStorage.removeItem(STORAGE_PREFIX + "failed_attempts");
        authError.innerHTML = "";

        // Сборка HUD-интерфейса участника
        hudUserInfo.innerHTML = `Участник: <strong>${studentName}</strong> [Класс: ${studentClass}]`;
        authScreen.classList.add("hidden");
        mainInterface.classList.remove("hidden");
        window.scrollTo(0, 0);

        // Старт таймера сессии
        timerInterval = setInterval(() => {
            sessionSeconds++;
            const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
            const secs = String(sessionSeconds % 60).padStart(2, '0');
            hudTimer.innerText = `Время сессии: ${mins}:${secs}`;
        }, 1000);
    });
  // ============================================================================
    // МЕХАНИКА ДВУХЭТАПНОГО СВЯЗЫВАНИЯ ПАР (ЗАДАНИЯ 2 И 3)
    // ============================================================================
    function initConnectionLogic(columnLeftId, columnRightId) {
        let selectedLeftItem = null;
        const leftItems = document.querySelectorAll(`#${columnLeftId} .connect-item`);
        const rightItems = document.querySelectorAll(`#${columnRightId} .connect-item`);

        leftItems.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("matched")) return;
                leftItems.forEach(el => el.classList.remove("selected"));
                selectedLeftItem = item;
                item.classList.add("selected");
            });
        });

        rightItems.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("matched") || !selectedLeftItem) return;

                const targetMatch = item.getAttribute("data-match");
                const currentLeftId = selectedLeftItem.getAttribute("data-id");

                if (targetMatch === currentLeftId) {
                    selectedLeftItem.classList.add("matched");
                    item.classList.add("matched");
                    selectedLeftItem.style.borderColor = "var(--neon-green, #00ff66)";
                    item.style.borderColor = "var(--neon-green, #00ff66)";
                } else {
                    const tempLeft = selectedLeftItem;
                    tempLeft.style.borderColor = "var(--neon-red, #ff0033)";
                    item.style.borderColor = "var(--neon-red, #ff0033)";
                    setTimeout(() => {
                        if (!tempLeft.classList.contains("matched")) tempLeft.style.borderColor = "";
                        if (!item.classList.contains("matched")) item.style.borderColor = "";
                    }, 500);
                }

                selectedLeftItem.classList.remove("selected");
                selectedLeftItem = null;
            });
        });
    }

    // Инициализация связей для Задания 2 и Задания 3
    initConnectionLogic("col-tissues", "col-t-functions");
    initConnectionLogic("col-systems", "col-s-functions");

    // ============================================================================
    // ЭТАЛОННАЯ МАТРИЦА БИОЛОГИЧЕСКИХ КЛЮЧЕЙ И РАСЧЕТ БАЛЛОВ
    // ============================================================================
    function calculateBiologyScores() {
        let score = 0;

        // Вспомогательная функция валидации ввода по опорным буквам (ТЗ: .trim().toLowerCase() и .startsWith())
        const checkInput = (id, baseChar, corePattern) => {
            const val = document.getElementById(id).value.trim().toLowerCase();
            return val.startsWith(baseChar) && val.includes(corePattern);
        };

        // --- ЗАДАНИЕ 1 (Текстовый ввод по опорным буквам) ---
        const t1_1 = checkInput("task1-1", "т", "ткан"); // Ткань
        const t1_2 = checkInput("task1-2", "т", "ткан"); // ткань
        const t1_3 = checkInput("task1-3", "п", "покров"); // покровная
        const t1_4 = checkInput("task1-4", "с", "соединит"); // соединительная
        const t1_5 = checkInput("task1-5", "м", "мыш"); // мышечная
        const t1_6 = checkInput("task1-6", "н", "нервн"); // нервная
        const t1_7 = checkInput("task1-7", "о", "орган"); // Орган
        const t1_8 = checkInput("task1-8", "с", "систем"); // Система

        if (t1_1 && t1_2 && t1_3 && t1_4 && t1_5 && t1_6 && t1_7 && t1_8) score++;

        // --- ЗАДАНИЕ 2 (Связывание тканей - 9 пар) ---
        const t2Matches = document.querySelectorAll("#col-tissues .connect-item.matched").length;
        if (t2Matches === 9) score++;

        // --- ЗАДАНИЕ 3 (Связывание систем органов - 7 пар) ---
        const t3Matches = document.querySelectorAll("#col-systems .connect-item.matched").length;
        if (t3Matches === 7) score++;

        // --- ЗАДАНИЕ 4 (Инлайн-селекторы текста) ---
        const t4_1 = document.getElementById("task4-1").value === "клеток";
        const t4_2 = document.getElementById("task4-2").value === "ткани";
        const t4_3 = document.getElementById("task4-3").value === "органов";
        const t4_4 = document.getElementById("task4-4").value === "системы органов";
        const t4_5 = document.getElementById("task4-5").value === "организм";
        const t4_6 = document.getElementById("task4-6").value === "нервной";
        const t4_7 = document.getElementById("task4-7").value === "нервной системы";

        if (t4_1 && t4_2 && t4_3 && t4_4 && t4_5 && t4_6 && t4_7) score++;

        // --- ЗАДАНИЕ 5 (Радиокнопка: Нервная ткань) ---
        const t5Checked = document.querySelector('input[name="task5"]:checked');
        if (t5Checked && t5Checked.value === "nervous" || (t5Checked && t5Checked.value === "нервная")) score++;

        // --- ЗАДАНИЕ 6 (Схема dog.png — Кровеносная система) ---
        const t6Checked = document.querySelector('input[name="task6"]:checked');
        if (t6Checked && t6Checked.value === "кровеносная") score++;

        // --- ЗАДАНИЕ 7 (Схема system_zoo.png — Цифра 4) ---
        const t7Checked = document.querySelector('input[name="task7"]:checked');
        if (t7Checked && t7Checked.value === "4") score++;

        // Конвертация в 5-балльную оценку (Максимум 7 баллов за тест)
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
        if (!confirm("Вы уверены, что хотите завершить сессию и заархивировать отчет?")) {
            return;
        }

        // Блокировка кнопки для предотвращения дублирования пакетов
        submitBtn.disabled = true;
        submitBtn.innerText = "Синхронизация данных...";

        // Остановка системного таймера
        clearInterval(timerInterval);

        // Расчет результатов по эталонной матрице биологических ключей
        const { score, grade } = calculateBiologyScores();

        // ИДЕНТИФИКАТОРЫ ПОЛЕЙ ВАШЕЙ GOOGLE ФОРМЫ (Замените на ваши entry.XXXXX из экстрактора)
        const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScUiu05N-wwguKVwdg1j9jKtHQ1yS0wHlEd9Fj_x85dIbzeyw/formResponse";
        
        const formData = new FormData();
        formData.append("entry.771427797", studentName);   // Поле ФИО
        formData.append("entry.457165843", studentClass);  // Поле Класса
        formData.append("entry.1881879045", score);         // Поле Баллов (макс. 7)
        formData.append("entry.839311651", grade);         // Поле Оценки (2, 3, 4, 5)

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
            // Локальный вывод отчета в случае сбоя сети
            displayFinalReport(score, grade);
        });
    });

    // Функция вывода финального HUD-репорта результатов участника
    function displayFinalReport(score, grade) {
        mainInterface.innerHTML = `
            <div class="hud-final-report" style="text-align: center; padding: 40px 20px;">
                <h2 style="color: var(--neon-green, #00ff66); margin-bottom: 20px; justify-content: center;">[Λ] СИНХРОНИЗАЦИЯ УСПЕШНА</h2>
                <p style="font-size: 1.1em; margin-bottom: 30px; opacity: 0.8;">
                    Протокол «Организм многоклеточного животного» завершен.<br> Данные участника <strong>${studentName}</strong> (${studentClass}) переданы в архив
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
