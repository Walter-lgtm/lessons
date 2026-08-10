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
    // 2. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 1)
    // ==========================================
    let selectedLeftItem = null;
    const leftItems = document.querySelectorAll("#left-col .match-item");
    const rightTargets = document.querySelectorAll("#right-col .match-target");

    leftItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return;
            leftItems.forEach(i => i.classList.remove("selected"));
            selectedLeftItem = item;
            item.classList.add("selected");
        });
    });

    rightTargets.forEach(target => {
        target.addEventListener("click", () => {
            if (target.classList.contains("matched") || !selectedLeftItem) return;

            target.dataset.userAnswer = selectedLeftItem.dataset.id;
            target.classList.add("matched");
            selectedLeftItem.classList.add("matched");
            selectedLeftItem.classList.remove("selected");
            selectedLeftItem = null;
        });
    });

    // Сброс сопоставления при двойном клике
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
    // 3. МЕХАНИКА DRAG AND DROP (Задание 4)
    // ==========================================
    let draggedElement = null;

    function initDragAndDrop() {
        const words = document.querySelectorAll(".drag-word");
        const gaps = document.querySelectorAll(".drop-gap");

        words.forEach(word => {
            word.addEventListener("dragstart", (e) => {
                draggedElement = word;
                e.dataTransfer.setData("text/plain", word.dataset.word);
            });
        });

        gaps.forEach(gap => {
            gap.addEventListener("dragover", (e) => e.preventDefault());
            gap.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!draggedElement) return;

                // Если в пропуске уже было слово, возвращаем его обратно в общий контейнер задания
                if (gap.textContent !== "") {
                    const returnWord = document.createElement("span");
                    returnWord.className = "drag-word";
                    returnWord.setAttribute("draggable", "true");
                    returnWord.dataset.word = gap.textContent;
                    returnWord.textContent = gap.textContent;
                    
                    const parentCard = gap.closest(".task-card");
                    parentCard.querySelector(".drag-words-container").appendChild(returnWord);
                    
                    returnWord.addEventListener("dragstart", (evt) => {
                        draggedElement = returnWord;
                        evt.dataTransfer.setData("text/plain", returnWord.dataset.word);
                    });
                }

                // Вставляем новое слово в пропуск
                gap.textContent = draggedElement.dataset.word;
                draggedElement.remove();
                draggedElement = null;
            });
        });
    }

    initDragAndDrop();
  // ==========================================
    // 4. ПРОВЕРКА ОТВЕТОВ И ПОДСЧЕТ БАЛЛОВ
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 ---
        let t1Correct = true;
        let matchedCount = 0;
        document.querySelectorAll("#right-col .match-target").forEach(target => {
            if (target.classList.contains("matched")) {
                matchedCount++;
                if (target.dataset.id !== target.dataset.userAnswer) t1Correct = false;
            } else {
                t1Correct = false;
            }
        });
        if (matchedCount === 5 && t1Correct) totalScore += 1;

        // --- Задание 2 ---
        const s1 = document.getElementById("t2-select1").value;
        const s2 = document.getElementById("t2-select2").value;
        const s3 = document.getElementById("t2-select3").value;
        if (s1 === "Биология" && s2 === "учёными" && s3 === "наука") totalScore += 1;

        // --- Задание 3 ---
        const t3Selected = document.querySelector('input[name="q3"]:checked');
        if (t3Selected && t3Selected.value === "Эмбриология") totalScore += 1;

        // --- Задание 4 ---
        let t4Correct = true;
        document.querySelectorAll("#task4 .drop-gap").forEach(gap => {
            if (gap.textContent.trim() !== gap.dataset.answer) t4Correct = false;
        });
        if (t4Correct) totalScore += 1;

        // --- Задание 5 ---
        const t5Selected = document.querySelector('input[name="q5"]:checked');
        if (t5Selected && t5Selected.value === "Химия") totalScore += 1;

        // --- Задание 6 ---
        const t6Answers = Array.from(document.querySelectorAll('input[name="q6"]:checked')).map(el => el.value);
        if (t6Answers.length === 1 && t6Answers[0] === "Мерный цилиндр") totalScore += 1;

        // --- Задание 7 ---
        const t7Answers = Array.from(document.querySelectorAll('input[name="q7"]:checked')).map(el => el.value);
        const t7CorrectAnswers = ["2", "3", "5"];
        if (t7Answers.length === 3 && t7Answers.every(val => t7CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 8 ---
        const t8Answers = Array.from(document.querySelectorAll('input[name="q8"]:checked')).map(el => el.value);
        const t8CorrectAnswers = ["2", "4", "5"];
        if (t8Answers.length === 3 && t8Answers.every(val => t8CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 9 (Умная проверка ввода) ---
        const i1 = document.getElementById("t9-i1").value.trim().toLowerCase();
        const i2 = document.getElementById("t9-i2").value.trim().toLowerCase();
        const i3 = document.getElementById("t9-i3").value.trim().toLowerCase();
        const i4 = document.getElementById("t9-i4").value.trim().toLowerCase();
        const i5 = document.getElementById("t9-i5").value.trim().toLowerCase();

        // Валидация корней слов (учитывая возможные падежи учеников)
        const ok1 = (i1 === "изнь");
        const ok2 = (i2 === "уше" || i2 === "уши");
        const ok3 = (i3 === "оде" || i3 === "одной" || i3 === "одушно-наземной");
        const ok4 = (i4 === "очве");
        const ok5 = (i5 === "иосферу" || i5 === "иосфера");

        if (ok1 && ok2 && ok3 && ok4 && ok5) totalScore += 1;

        // --- Расчет оценки по пятибалльной шкале ---
        let finalGrade = "2";
        if (totalScore >= 8) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 6) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore >= 4) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }

        // Вывод результатов ученику на экран терминала
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;
        document.getElementById("res-grade").textContent = finalGrade;
        document.getElementById("result-screen").classList.remove("hidden");

        // Отправка в скрытую функцию передачи данных в Google Таблицу
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });
  // ==========================================
    // 5. СКРЫТАЯ ПЕРЕДАЧА ДАННЫХ В GOOGLE ТАБЛИЦУ
    // ==========================================
    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите здесь URL вашей ВТОРОЙ (новой) опубликованной Google Формы
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfcJRxHJRNI6kHYeHasVX4kQN7PMKJAmmXiFRLyt9tLZ0DbHg/formResponse";
        const formData = new FormData();
        
        // Укажите здесь реальные entry.ID полей вашей ВТОРОЙ формы
        formData.append("entry.1875858208", name);       // ID поля ФИО формы 02
        formData.append("entry.362770474", className);  // ID поля Класс формы 02
        formData.append("entry.1542758248", score);      // ID поля Баллы формы 02
        formData.append("entry.1917083737", finalGrade); // ID поля Оценка формы 02

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
}); // Самая последняя скобка, закрывающая DOMContentLoaded
