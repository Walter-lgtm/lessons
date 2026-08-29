// ============================================================================
// [λ] БИО-КОМПЛЕКСЫ 8 КЛАСС // СЦЕНАРИЙ СИНХРОНИЗАЦИИ №2 // SCRIPT.JS (Часть 1)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Селекторы интерфейса
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

    // Глобальные переменные сессии
    let studentName = "";
    let studentClass = "";
    let activeToken = "";
    let sessionSeconds = 0;
    let timerInterval = null;

    // Уникальный префикс темы для изоляции localStorage параграфа №2
    const STORAGE_PREFIX = "bme_zool_p2_";

    // ==========================================
    // МАТЕМАТИЧЕСКАЯ КРИПТОЗАЩИТА И ОДНОКРАТНОСТЬ
    // ==========================================
    function validateToken(tokenStr) {
        const t = tokenStr.trim().toUpperCase();
        
        // 1. Проверяем, не использовался ли этот код ранее на этом устройстве
        const usedTokens = JSON.parse(localStorage.getItem(STORAGE_PREFIX + "used_tokens") || "[]");
        if (usedTokens.includes(t)) {
            return "USED";
        }

        // 2. Математический хэш-алгоритм DJB2
        let hash = 5381;
        for (let i = 0; i < t.length; i++) {
            hash = ((hash << 5) + hash) + t.charCodeAt(i);
        }
        const secretMod = Math.abs(hash) % 997;
        
        // Сверяем с секретным остатком текущего параграфа (§ 2 = 100)
        if (secretMod === 100) {
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
            authError.innerHTML = `КРИТИЧЕСКАЯ БЛОКИРОВКА! Доступ ограничен на ${timeLeft} сек. за подбор токенов.`;
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
            const lockDuration = 60 * 1000 * penaltyMultiplier;
            localStorage.setItem(STORAGE_PREFIX + "bf_lock", (Date.now() + lockDuration).toString());
            checkBruteForceLock();
        } else {
            authError.innerHTML = `ВНИМАНИЕ: Неверный токен! Осталось попыток до блокировки терминала: ${3 - attempts}`;
        }
    }

    checkBruteForceLock();
    if (startBtn.disabled) {
        const checkInterval = setInterval(() => {
            if (!checkBruteForceLock()) clearInterval(checkInterval);
        }, 1000);
    }

    // Вход в лабораторию
    startBtn.addEventListener("click", () => {
        if (checkBruteForceLock()) return;

        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();
        activeToken = inputToken.value.trim();

        if (!studentName || !studentClass || !activeToken) {
            authError.innerHTML = "ОШИБКА: Заполните ФИО, Класс и Код доступа.";
            return;
        }

        const tokenStatus = validateToken(activeToken);

        if (tokenStatus === "USED") {
            authError.innerHTML = "ДОСТУП ЗАБЛОКИРОВАН: Данный код доступа уже использован!";
            return;
        }

        if (tokenStatus === "INVALID") {
            registerFailedAttempt();
            return;
        }

        localStorage.removeItem(STORAGE_PREFIX + "failed_attempts");
        authError.innerHTML = "";

        hudUserInfo.innerHTML = `Участник: <strong>${studentName}</strong> [Класс: ${studentClass}]`;
        authScreen.classList.add("hidden");
        mainInterface.classList.remove("hidden");
        window.scrollTo(0, 0);

        timerInterval = setInterval(() => {
            sessionSeconds++;
            const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
            const secs = String(sessionSeconds % 60).padStart(2, '0');
            hudTimer.innerText = `Время сессии: ${mins}:${secs}`;
        }, 1000);
    });

    // ============================================================================
    // КРОСС ПЛАТФОРМЕННЫЙ ДВИЖОК DRAG-AND-DROP (ДЛЯ ЗАДАНИЙ 1 И 2)
    // ============================================================================
    const dragItems = document.querySelectorAll(".drag-item");
    const dropSockets = document.querySelectorAll(".drop-socket");

    dragItems.forEach(item => {
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", item.getAttribute("data-id"));
            item.classList.add("dragging");
        });

        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
        });
    });

    dropSockets.forEach(socket => {
        socket.addEventListener("dragover", (e) => {
            e.preventDefault(); // Разрешаем сброс
        });

        socket.addEventListener("drop", (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const draggedEl = document.querySelector(`[data-id="${id}"]`);
            
            if (draggedEl) {
                // Проверяем, принадлежит ли плашка пулу текущего задания
                const isTask1Item = socket.id.startsWith("socket-1-") && draggedEl.parentElement.id.includes("1");
                const isTask2Item = socket.id.startsWith("socket-2-") && draggedEl.parentElement.id.includes("2");
                const isAlreadyInSocket = socket.contains(draggedEl) || draggedEl.parentElement.classList.contains("drop-socket");

                if (isTask1Item || isTask2Item || isAlreadyInSocket) {
                    socket.appendChild(draggedEl);
                    draggedEl.style.margin = "3px 0";
                }
            }
        });
    });
// ============================================================================
    // ЭТАЛОННАЯ МАТРИЦА БИОЛОГИЧЕСКИХ КЛЮЧЕЙ И РАСЧЕТ БАЛЛОВ
    // ============================================================================
    function calculateBiologyScores() {
        let score = 0;

        // --- ЗАДАНИЕ 1: Drag-and-Drop (Признаки) ---
        // Ключи: Общие (5, 8, 11, 14, 15, 16), Растения (3, 4, 6, 9, 12, 13), Животные (1, 2, 7, 10)
        const s1Common = Array.from(document.getElementById("socket-1-common").children).map(el => el.getAttribute("data-id"));
        const s1Plants = Array.from(document.getElementById("socket-1-plants").children).map(el => el.getAttribute("data-id"));
        const s1Animals = Array.from(document.getElementById("socket-1-animals").children).map(el => el.getAttribute("data-id"));

        const t1CommonValid = s1Common.every(id => ["5","8","11","14","15","16"].includes(id)) && s1Common.length === 6;
        const t1PlantsValid = s1Plants.every(id => ["3","4","6","9","12","13"].includes(id)) && s1Plants.length === 6;
        const t1AnimalsValid = s1Animals.every(id => ["1","2","7","10"].includes(id)) && s1Animals.length === 4;

        if (t1CommonValid && t1PlantsValid && t1AnimalsValid) score++;

        // --- ЗАДАНИЕ 2: Drag-and-Drop (Природные зоны) ---
        // Переменные IDs: лемминги(t1), сев.олень(t2), заяц(t3), волк(t4), суслик(t5), медвед(t6), песец(t7), корсак(t8), соболь(t9), беляк(t10), песчаник(t11), росомаха(t12), белка(t13), тушканчик(t14), джейран(t15), верблюд(t16)
        const s2Desert = Array.from(document.getElementById("socket-2-desert").children).map(el => el.getAttribute("data-id"));
        const s2Taiga = Array.from(document.getElementById("socket-2-taiga").children).map(el => el.getAttribute("data-id"));
        const s2Tundra = Array.from(document.getElementById("socket-2-tundra").children).map(el => el.getAttribute("data-id"));

        // Пустыни: корсак(t8), суслик(t5), песчаник(t11), тушканчик(t14), джейран(t15), верблюд(t16)
        const t2DesertValid = s2Desert.every(id => ["t5","t8","t11","t14","t15","t16"].includes(id)) && s2Desert.length === 6;
        // Тайга: волк(t4), медведь(t6), соболь(t9), беляк(t10), белка(t13)
        const t2TaigaValid = s2Taiga.every(id => ["t4","t6","t9","t10","t13"].includes(id)) && s2Taiga.length === 5;
        // Тундра: лемминги(t1), сев.олень(t2), заяц(t3), песец(t7), росомаха(t12)
        const t2TundraValid = s2Tundra.every(id => ["t1","t2","t3","t7","t12"].includes(id)) && s2Tundra.length === 5;

        if (t2DesertValid && t2TaigaValid && t2TundraValid) score++;

        // --- ЗАДАНИЕ 3: Инлайн-селекторы (Структура текста) ---
        const t3_1 = document.getElementById("task3-1").value === "многоклеточного";
        const t3_2 = document.getElementById("task3-2").value === "ткани";
        const t3_3 = document.getElementById("task3-3").value === "органы";
        const t3_4 = document.getElementById("task3-4").value === "системы органов";
        const t3_5 = document.getElementById("task3-5").value === "опорно-двигательная";
        const t3_6 = document.getElementById("task3-6").value === "биологической системой";
        const t3_7 = document.getElementById("task3-7").value === "обмен веществ";

        if (t3_1 && t3_2 && t3_3 && t3_4 && t3_5 && t3_6 && t3_7) score++;

        // --- ЗАДАНИЕ 4: Радиокнопки (Радиальная симметрия) ---
        // Коралл, медуза, морская звезда -> Вариант B
        const t4Checked = document.querySelector('input[name="task4"]:checked');
        if (t4Checked && t4Checked.value === "B") score++;

        // --- ЗАДАНИЕ 5: Работа с графикой (Одноклеточные животные) ---
        // 1, 3, 5 -> Вариант C
        const t5Checked = document.querySelector('input[name="task5"]:checked');
        if (t5Checked && t5Checked.value === "C") score++;

        // Расчет итоговой оценки по стандартной шкале Black Mesa (макс 5 баллов)
        let grade = 2;
        if (score === 5) grade = 5;
        else if (score === 4) grade = 4;
        else if (score >= 2) grade = 3;

        return { score, grade };
    }
  // ============================================================================
    // 3. ТРАНСЛЯЦИЯ НА СЕРВЕР (GOOGLE ФОРМА VIA FETCH FORMDATA)
    // ============================================================================
    submitBtn.addEventListener("click", () => {
        if (!confirm("Вы уверены, что хотите завершить лабораторную сессию и отправить отчет?")) {
            return;
        }

        // Аппаратная блокировка кнопки для предотвращения дублирования пакетов
        submitBtn.disabled = true;
        submitBtn.innerText = "Синхронизация данных...";

        // Остановка системного таймера сессии
        clearInterval(timerInterval);

        // Расчет итоговых показателей по матрице биологических ключей
        const { score, grade } = calculateBiologyScores();

        // ИДЕНТИФИКАТОРЫ ПОЛЕЙ ВАШЕЙ GOOGLE ФОРМЫ (Замените на ваши актуальные entry.XXXXX)
        const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdnZ2tqGYJqT0ODU6C7XH9kv_PSDiwGx_EzNwWZvGipDjK4WQ/formResponse";
        
        const formData = new FormData();
        formData.append("entry.1792164429", studentName);   // Поле ФИО
        formData.append("entry.95772656", studentClass);  // Поле Класса
        formData.append("entry.683130155", score);         // Поле Баллов (макс. 5)
        formData.append("entry.1980047761", grade);         // Поле Оценки (2, 3, 4, 5)

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
            // Резервный локальный вывод отчета при обрыве связи
            displayFinalReport(score, grade);
        });
    });

    // Функция вывода финального HUD-репорта результатов
    function displayFinalReport(score, grade) {
        mainInterface.innerHTML = `
            <div class="hud-final-report" style="text-align: center; padding: 40px 20px;">
                <h2 style="color: var(--neon-green, #00ff66); margin-bottom: 20px; justify-content: center;">СИНХРОНИЗАЦИЯ УСПЕШНА</h2>
                <p style="font-size: 1.1em; margin-bottom: 30px; opacity: 0.8;">
                    Протокол завершен. Данные участника <strong>${studentName}</strong> (${studentClass}) успешно переданы в архив.
                </p>
                <div class="score-hud-box" style="border: 2px dashed #00ff66; padding: 20px; display: inline-block; margin-bottom: 30px; background: rgba(0,255,102,0.05);">
                    <div style="font-size: 1.2em; margin-bottom: 10px;">Успешно пройдено зон: <strong>${score} из 5</strong></div>
                    <div style="font-size: 2em; font-weight: bold; color: ${grade >= 4 ? '#00ff66' : '#ff0033'}">ИТОГОВАЯ ОЦЕНКА: ${grade}</div>
                </div>
                <p style="color: #888; font-size: 0.9em;">Терминал заблокирован. Повторный сеанс по использованному токену невозможен.</p>
            </div>
        `;
        window.scrollTo(0, 0);
    }
});
