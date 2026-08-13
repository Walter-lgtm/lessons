document.addEventListener("DOMContentLoaded", () => {
    // Глобальные переменные данных ученика
    let studentName = "";
    let studentClass = "";

    // Элементы интерфейса
    const authScreen = document.getElementById("auth-screen");
    const quizContainer = document.getElementById("quiz-container");
    const startBtn = document.getElementById("start-btn");
    const inputName = document.getElementById("student-name");
    const inputClass = document.getElementById("student-class");

    // ==========================================
    // 1. АВТОРИЗАЦИЯ И СТАРТ ТЕСТА
    // ==========================================
    startBtn.addEventListener("click", () => {
        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();

        if (!studentName || !studentClass) {
            alert("ВНИМАНИЕ! Доступ заблокирован. Введите ФИО и Класс для идентификации.");
            return;
        }

        authScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        window.scrollTo(0, 0);
    });

    // ==========================================
    // 2. ИНТЕРАКТИВНАЯ МЕХАНИКА DRAG AND DROP (Задания 1 и 2)
    // ==========================================
    let draggedElement = null;

    function initImageDragAndDrop() {
        const words = document.querySelectorAll(".drag-word");
        const overlays = document.querySelectorAll(".drop-zone-overlay");

        words.forEach(word => {
            word.addEventListener("dragstart", (e) => {
                draggedElement = word;
                e.dataTransfer.setData("text/plain", word.dataset.word);
            });
        });

        overlays.forEach(overlay => {
            // Подсвечиваем зону при наведении плашки
            overlay.addEventListener("dragover", (e) => {
                e.preventDefault();
                overlay.classList.add("drag-over");
            });

            overlay.addEventListener("dragleave", () => {
                overlay.classList.remove("drag-over");
            });

            overlay.addEventListener("drop", (e) => {
                e.preventDefault();
                overlay.classList.remove("drag-over");
                if (!draggedElement) return;

                // Защита: плашка должна принадлежать текущему заданию
                const sourceCard = draggedElement.closest(".task-card");
                const targetCard = overlay.closest(".task-card");
                if (sourceCard !== targetCard) return;

                // Если зона уже была заполнена, возвращаем старое слово обратно в контейнер задания
                if (overlay.classList.contains("filled")) {
                    const oldWordText = overlay.textContent;
                    const returnWord = document.createElement("span");
                    returnWord.className = "drag-word";
                    returnWord.setAttribute("draggable", "true");
                    returnWord.dataset.word = oldWordText;
                    returnWord.textContent = oldWordText;

                    sourceCard.querySelector(".drag-words-container").appendChild(returnWord);

                    // Перенавешиваем событие драга на возвращенную плашку
                    returnWord.addEventListener("dragstart", (evt) => {
                        draggedElement = returnWord;
                        evt.dataTransfer.setData("text/plain", returnWord.dataset.word);
                    });
                }

                // Устанавливаем новое слово в зону оверлея
                overlay.textContent = draggedElement.dataset.word;
                overlay.classList.add("filled");
                
                // Удаляем перетащенный элемент из общего списка плашек
                draggedElement.remove();
                draggedElement = null;
            });
        });
    }

    initImageDragAndDrop();
  // ==========================================
    // 3. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 16)
    // ==========================================
    let selectedLeftItem = null;
    const leftItems = document.querySelectorAll("#left-col .match-item");
    const rightTargets = document.querySelectorAll("#right-col .match-target");

    leftItems.forEach(item => {
        item.addEventListener("click", () => {
            // Если элемент уже сопоставлен, ничего не делаем
            if (item.classList.contains("matched")) return;

            // Снимаем выделение с предыдущего выбранного элемента слева
            leftItems.forEach(i => i.classList.remove("selected"));

            // Выделяем текущий
            selectedLeftItem = item;
            item.classList.add("selected");
        });
    });

    rightTargets.forEach(target => {
        target.addEventListener("click", () => {
            // Если цель уже сопоставлена или ни один элемент слева не выбран
            if (target.classList.contains("matched") || !selectedLeftItem) return;

            // Сохраняем ID выбранного ответа внутри элемента справа
            target.dataset.userAnswer = selectedLeftItem.dataset.id;

            // Визуально помечаем оба элемента как сопоставленные
            target.classList.add("matched");
            selectedLeftItem.classList.add("matched");
            selectedLeftItem.classList.remove("selected");

            // Сбрасываем текущий выбор
            selectedLeftItem = null;
        });
    });

    // Возможность сбросить сопоставление при двойном клике на цель в Задании 16
    rightTargets.forEach(target => {
        target.addEventListener("dblclick", () => {
            if (!target.classList.contains("matched")) return;

            const savedId = target.dataset.userAnswer;
            const relatedLeftItem = document.querySelector(`#left-col .match-item[data-id="${savedId}"]`);

            if (relatedLeftItem) {
                relatedLeftItem.classList.remove("matched");
            }
            target.classList.remove("matched");
            delete target.dataset.userAnswer;
        });
    });
  // ==========================================
    // 4. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Оверлеи: лупа и микроскоп, 9 зон) ---
        let t1Correct = true;
        document.querySelectorAll("#task1 .drop-zone-overlay").forEach(overlay => {
            if (overlay.textContent.trim() !== overlay.dataset.answer) t1Correct = false;
        });
        if (t1Correct) totalScore += 1;

        // --- Задание 2 (Оверлеи: узлы микроскопа, 6 зон) ---
        let t2Correct = true;
        document.querySelectorAll("#task2 .drop-zone-overlay").forEach(overlay => {
            if (overlay.textContent.trim() !== overlay.dataset.answer) t2Correct = false;
        });
        if (t2Correct) totalScore += 1;

        // --- Задание 3 (Чекбоксы: Ручная лупа, Штативная лупа) ---
        const t3Answers = Array.from(document.querySelectorAll('input[name="q3"]:checked')).map(el => el.value);
        const t3CorrectAnswers = ["Ручная лупа", "Штативная лупа"];
        if (t3Answers.length === 2 && t3Answers.every(val => t3CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 4 (Радио: Световой микроскоп) ---
        const t4Selected = document.querySelector('input[name="q4"]:checked');
        if (t4Selected && t4Selected.value === "Световой микроскоп") totalScore += 1;

        // --- Задание 5 (Радио: Ручная лупа) ---
        const t5Selected = document.querySelector('input[name="q5"]:checked');
        if (t5Selected && t5Selected.value === "Ручная лупа") totalScore += 1;

        // --- Задание 6 (Радио: Предметный столик) ---
        const t6Selected = document.querySelector('input[name="q6"]:checked');
        if (t6Selected && t6Selected.value === "Предметный столик") totalScore += 1;

        // --- Задание 7 (Радио: Винты) ---
        const t7Selected = document.querySelector('input[name="q7"]:checked');
        if (t7Selected && t7Selected.value === "Винты") totalScore += 1;

        // --- Задание 8 (Радио: Зеркало) ---
        const t8Selected = document.querySelector('input[name="8"]:checked'); // Примечание: в HTML q8, проверим префикс
        const t8SelectedReal = document.querySelector('input[name="q8"]:checked');
        if (t8SelectedReal && t8SelectedReal.value === "Зеркало") totalScore += 1;

        // --- Задание 9 (Радио: 5-10 см) ---
        const t9Selected = document.querySelector('input[name="q9"]:checked');
        if (t9Selected && t9Selected.value === "5-10 см") totalScore += 1;

        // --- Задание 10 (Селект: предметный столик) ---
        const t10Select = document.querySelector('.hl-select[data-task="10"]');
        if (t10Select && t10Select.value === "предметный столик") totalScore += 1;

        // --- Задание 11 (Радио: Объективы) ---
        const t11Selected = document.querySelector('input[name="q11"]:checked');
        if (t11Selected && t11Selected.value === "Объективы") totalScore += 1;

        // --- Задание 12 (Радио: 4, 3) ---
        const t12Selected = document.querySelector('input[name="q12"]:checked');
        if (t12Selected && t12Selected.value === "4, 3") totalScore += 1;

        // --- Задание 13 (Чекбоксы: Световой микроскоп, Электронный микроскоп) ---
        const t13Answers = Array.from(document.querySelectorAll('input[name="q13"]:checked')).map(el => el.value);
        const t13CorrectAnswers = ["Световой микроскоп", "Электронный микроскоп"];
        if (t13Answers.length === 2 && t13Answers.every(val => t13CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 14 (Радио: Подзорная труба, бинокль) ---
        const t14Selected = document.querySelector('input[name="q14"]:checked');
        if (t14Selected && t14Selected.value === "Подзорная труба, бинокль") totalScore += 1;

        // --- Задание 15 (Радио: Штативная лупа) ---
        const t15Selected = document.querySelector('input[name="q15"]:checked');
        if (t15Selected && t15Selected.value === "Штативная лупа") totalScore += 1;

        // --- Задание 16 (Сопоставление кратности кликами) ---
        let t16Correct = true;
        let t16MatchedCount = 0;
        document.querySelectorAll("#right-col .match-target").forEach(target => {
            if (target.classList.contains("matched")) {
                t16MatchedCount++;
                if (target.dataset.id !== target.dataset.userAnswer) t16Correct = false;
            } else {
                t16Correct = false;
            }
        });
        if (t16MatchedCount === 4 && t16Correct) totalScore += 1;

        // --- Задание 17 (Радио: В 400 раз) ---
        const t17Selected = document.querySelector('input[name="q17"]:checked');
        if (t17Selected && t17Selected.value === "В 400 раз") totalScore += 1;

        // --- Задание 18 (Чекбоксы истинных утверждений: 2, 4, 6) ---
        const t18Answers = Array.from(document.querySelectorAll('input[name="q18"]:checked')).map(el => el.value);
        const t18CorrectAnswers = ["2", "4", "6"];
        if (t18Answers.length === 3 && t18Answers.every(val => t18CorrectAnswers.includes(val))) totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (из 18 возможных баллов)
        let finalGrade = "2";
        if (totalScore >= 16) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 13) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore >= 9) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }
        document.getElementById("res-grade").textContent = finalGrade;

        document.getElementById("result-screen").classList.remove("hidden");

        // Отправка данных в Google-форму
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL вашей новой формы для Сектора 09
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfq2adkMFOmtoAqaMUWmmXNvzrQN10xoZDgdcD0KVtT7GFRcA/formResponse";
        const formData = new FormData();
        
        formData.append("entry.831897051", name);      // Перепроверьте ID полей через F12-скрипт
        formData.append("entry.770557493", className); 
        formData.append("entry.1968880295", score);     
        formData.append("entry.435319741", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
