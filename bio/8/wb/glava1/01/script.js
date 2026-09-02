// ============================================================================
// [λ] БИО-КОМПЛЕКСЫ 8 КЛАСС // ТЕМА: § 1. ЗООЛОГИЯ — НАУКА О ЖИВОТНЫХ
// МОДЕРНИЗИРОВАННЫЙ СЦЕНАРИЙ БЕЗ ТОКЕНОВ // SCRIPT.JS (Часть 1)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Элементы интерфейса терминала
    const authScreen = document.getElementById("auth-screen");
    const mainInterface = document.getElementById("main-interface");
    const startBtn = document.getElementById("start-btn");
    const submitBtn = document.getElementById("submit-btn");
    const authError = document.getElementById("auth-error");

    const inputName = document.getElementById("user-fio");
    const inputClass = document.getElementById("user-class");

    const hudUserInfo = document.getElementById("hud-user-info");
    const hudTimer = document.getElementById("hud-timer");

    // Параметры текущей сессии участника
    let studentName = "";
    let studentClass = "";
    let sessionSeconds = 0;
    let timerInterval = null;

    // Уникальный префикс темы для изоляции результатов Параграфа №1
    const STORAGE_PREFIX = "bme_zool_p1_v3_";

    // ============================================================================
    // ИНИЦИАЛИЗАЦИЯ И КОНТРОЛЬ ЕДИНСТВЕННОГО ВХОДА
    // ============================================================================
    startBtn.addEventListener("click", () => {
        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();

        // Базовая валидация заполнения полей
        if (!studentName || !studentClass) {
            authError.innerHTML = "ОШИБКА: Доступ ограничен. Пожалуйста, введите Фамилию, Имя и Класс.";
            return;
        }

        // Проверка локального клейма повторного прохождения
        const sessionCompleted = localStorage.getItem(STORAGE_PREFIX + "completed_" + studentName.toLowerCase());
        if (sessionCompleted === "true") {
            authError.innerHTML = `ДОСТУП ЗАБЛОКИРОВАН: Участник ${studentName} уже выполнял этот тест на данном устройстве!`;
            return;
        }

        authError.innerHTML = "";

        // Настройка HUD-панели и переключение экранов
        hudUserInfo.innerHTML = `Участник: <strong>${studentName}</strong> [Класс: ${studentClass}]`;
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
    // МЕХАНИКА ЗАДАНИЯ 4: СЕНСОРНОЕ СВЯЗЫВАНИЕ ПАР (ТАП СЛЕВА -> ТАП СПРАВА)
    // ============================================================================
    let selectedLeft = null;
    const professionItems = document.querySelectorAll("#col-professions .connect-item");
    const functionItems = document.querySelectorAll("#col-functions .connect-item");

    professionItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return;
            professionItems.forEach(p => p.classList.remove("selected"));
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

        // Валидация текстового ввода с защитой от опечаток в окончаниях
        const checkInput = (id, baseChar, fullWord) => {
            const val = document.getElementById(id).value.trim().toLowerCase();
            return val.startsWith(baseChar) && val.includes(fullWord.slice(1, 4));
        };

        // --- ЗАДАНИЕ 1 (Селекторы) ---
        const t1_1 = document.getElementById("task1-1").value === "зоология";
        const t1_2 = document.getElementById("task1-2").value === "бионика";
        if (t1_1 && t1_2) score++;

        // --- ЗАДАНИЕ 2 (Разделы зоологии) ---
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
        if (t2_answers.filter(Boolean).length >= 6) score++; // 1 балл за порог >= 80%

        // --- ЗАДАНИЕ 3 (Частные науки) ---
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
        if (t3_answers.filter(Boolean).length >= 9) score++; // 1 балл за порог >= 80%

        // --- ЗАДАНИЕ 4 (Связывание) ---
        const matchedPairs = document.querySelectorAll("#col-professions .connect-item.matched").length;
        if (matchedPairs === 5) score++;

        // --- ЗАДАНИЕ 5 (Радиокнопка) ---
        const t5_checked = document.querySelector('input[name="task5"]:checked');
        if (t5_checked && t5_checked.value === "биолог-охотовед") score++;

        // --- ЗАДАНИЕ 6 (Радиокнопка) ---
        const t6_checked = document.querySelector('input[name="task6"]:checked');
        if (t6_checked && t6_checked.value === "эйфелева") score++;

        // Итоговая оценка (Максимум 6 баллов)
        let grade = 2;
        if (score === 6) grade = 5;
        else if (score >= 4) grade = 4;
        else if (score >= 2) grade = 3;

        return { score, grade };
    }

    // ============================================================================
    // ТРАНСЛЯЦИЯ НА СЕРВЕР И АКТИВАЦИЯ КЛЕЙМА БЛОКИРОВКИ
    // ============================================================================
    submitBtn.addEventListener("click", () => {
        if (!confirm("Вы уверены, что хотите завершить сессию и отправить отчет?")) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Синхронизация данных...";
        clearInterval(timerInterval);

        const { score, grade } = calculateBiologyScores();

        // Ставим локальное клеймо блокировки ДО отправки (защита от закрытия вкладки)
        localStorage.setItem(STORAGE_PREFIX + "completed_" + studentName.toLowerCase(), "true");

        // Укажите URL вашей Google Формы
        const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfRqPieDxXe2km2xCPiqiXvQWnlryIfzYSlCq6iF33aBXak8w/formResponse";
        
        const formData = new FormData();
        formData.append("entry.855012040", studentName);   // ФИО
        formData.append("entry.917634005", studentClass);  // Класс
        formData.append("entry.1037263757", score);         // Баллы
        formData.append("entry.1257078745", grade);         // Оценка

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
            displayFinalReport(score, grade);
        });
    });

    function displayFinalReport(score, grade) {
        mainInterface.innerHTML = `
            <div class="hud-final-report" style="text-align: center; padding: 40px 20px;">
                <h2 style="color: var(--neon-green, #00ff66); margin-bottom: 20px; justify-content: center;">[Λ] СИНХРОНИЗАЦИЯ УСПЕШНА</h2>
                <p style="font-size: 1.1em; margin-bottom: 30px; opacity: 0.8;">
                    Протокол завершен. Данные участника <strong>${studentName}</strong> (${studentClass}) успешно переданы в архив Black Mesa East.
                </p>
                <div class="score-hud-box" style="border: 2px dashed #00ff66; padding: 20px; display: inline-block; margin-bottom: 30px; background: rgba(0,255,102,0.05);">
                    <div style="font-size: 1.2em; margin-bottom: 10px;">Набрано баллов: <strong>${score} из 6</strong></div>
                    <div style="font-size: 2em; font-weight: bold; color: ${grade >= 4 ? '#00ff66' : '#ff0033'}">ИТОГОВАЯ ОЦЕНКА: ${grade}</div>
                </div>
                <p style="color: #888; font-size: 0.9em;">Повторный доступ к терминалу для учетной записи заблокирован аппаратно.</p>
            </div>
        `;
        window.scrollTo(0, 0);
    }
});
