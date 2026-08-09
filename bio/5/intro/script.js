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
    // 2. МЕХАНИКА DRAG AND DROP (Задания 1, 5, 6)
    // ==========================================
    let draggedElement = null;

    // Функция инициализации перетаскивания элементов
    function initDragAndDrop() {
        const words = document.querySelectorAll(".drag-word");
        const gaps = document.querySelectorAll(".drop-gap");
        const zones = document.querySelectorAll(".group-zone");

        words.forEach(word => {
            word.addEventListener("dragstart", (e) => {
                draggedElement = word;
                e.dataTransfer.setData("text/plain", word.dataset.word);
            });
        });

        // Работа с пропусками в тексте (Задание 1)
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
                    
                    // Находим родительский контейнер слов конкретно этого задания
                    const parentCard = gap.closest(".task-card");
                    parentCard.querySelector(".drag-words-container").appendChild(returnWord);
                    
                    // Перенавешиваем событие dragstart на новый элемент
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

        // Работа с колонками распределения (Задания 5 и 6)
        zones.forEach(zone => {
            const content = zone.querySelector(".zone-content");
            zone.addEventListener("dragover", (e) => e.preventDefault());
            zone.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!draggedElement) return;

                // Убеждаемся, что карточка перетаскивается внутри своего задания
                const sourceContainer = draggedElement.closest(".task-card");
                const targetContainer = zone.closest(".task-card");
                if (sourceContainer !== targetContainer) return;

                content.appendChild(draggedElement);
                draggedElement = null;
            });
        });
    }

    initDragAndDrop();
  // ==========================================
    // 3. МЕХАНИКА ВЫЧЕРКИВАНИЯ СЛОВ (Задания 7, 9)
    // ==========================================
    const strikeButtons = document.querySelectorAll(".strike-btn");
    
    strikeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Переключаем класс зачёркивания при клике/тапе
            btn.classList.toggle("strikethrough");
        });
    });

    // ==========================================
    // 4. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 10)
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

    // Добавим возможность сбросить сопоставление для Задания 10 при двойном клике на цель
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
    // 5. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 ---
        let t1Correct = true;
        document.querySelectorAll("#task1 .drop-gap").forEach(gap => {
            if (gap.textContent.trim() !== gap.dataset.answer) t1Correct = false;
        });
        if (t1Correct) totalScore += 1;

        // --- Задание 2 ---
        const t2Answers = Array.from(document.querySelectorAll('input[name="q2"]:checked')).map(el => el.value);
        const t2CorrectAnswers = ["Дыхание", "Питание", "Выделение"];
        if (t2Answers.length === 3 && t2Answers.every(val => t2CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 3 ---
        const t3Selected = document.querySelector('input[name="q3"]:checked');
        if (t3Selected && t3Selected.value === "Биосфера") totalScore += 1;

        // --- Задание 4 ---
        const t4Selected = document.querySelector('input[name="q4"]:checked');
        if (t4Selected && t4Selected.value === "15-20") totalScore += 1;

        // --- Задание 5 ---
        let t5Correct = true;
        const t5Live = Array.from(document.querySelectorAll("#t5-group1 .drag-word")).map(el => el.dataset.word);
        const t5Dead = Array.from(document.querySelectorAll("#t5-group2 .drag-word")).map(el => el.dataset.word);
        const t5LiveTrue = ["уж", "пион", "пшеница", "ёж", "заяц"];
        const t5DeadTrue = ["туча", "горы", "лёд", "галька", "кислород"];
        if (t5Live.length !== 5 || !t5Live.every(val => t5LiveTrue.includes(val))) t5Correct = false;
        if (t5Dead.length !== 5 || !t5Dead.every(val => t5DeadTrue.includes(val))) t5Correct = false;
        if (t5Correct) totalScore += 1;

        // --- Задание 6 ---
        let t6Correct = true;
        const t6Live = Array.from(document.querySelectorAll("#t6-group1 .drag-word")).map(el => el.dataset.word);
        const t6Dead = Array.from(document.querySelectorAll("#t6-group2 .drag-word")).map(el => el.dataset.word);
        const t6LiveTrue = ["удав", "подсолнечник", "крот", "куница", "лиса"];
        const t6DeadTrue = ["облака", "холмы", "снежинка", "песок", "воздух"];
        if (t6Live.length !== 5 || !t6Live.every(val => t6LiveTrue.includes(val))) t6Correct = false;
        if (t6Dead.length !== 5 || !t6Dead.every(val => t6DeadTrue.includes(val))) t6Correct = false;
        if (t6Correct) totalScore += 1;

        // --- Задание 7 ---
        let t7Correct = true;
        document.querySelectorAll("#strike-t7 .strike-btn").forEach(btn => {
            const isStriked = btn.classList.contains("strikethrough");
            const shouldBeStriked = btn.dataset.wrong === "true";
            if (isStriked !== shouldBeStriked) t7Correct = false;
        });
        if (t7Correct) totalScore += 1;

        // --- Задание 8 ---
        const t8Selected = document.querySelector('input[name="q8"]:checked');
        if (t8Selected && t8Selected.value === "Вернадский") totalScore += 1;

        // --- Задание 9 ---
        let t9Correct = true;
        document.querySelectorAll("#strike-t9 .strike-btn").forEach(btn => {
            const isStriked = btn.classList.contains("strikethrough");
            const shouldBeStriked = btn.dataset.wrong === "true";
            if (isStriked !== shouldBeStriked) t9Correct = false;
        });
        if (t9Correct) totalScore += 1;

        // --- Задание 10 ---
        let t10Correct = true;
        let matchedCount = 0;
        document.querySelectorAll("#right-col .match-target").forEach(target => {
            if (target.classList.contains("matched")) {
                matchedCount++;
                if (target.dataset.id !== target.dataset.userAnswer) t10Correct = false;
            } else {
                t10Correct = false;
            }
        });
        if (matchedCount === 3 && t10Correct) totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале
        let grade = "2";
        if (totalScore >= 9) {
            grade = "5 (Отлично)";
        } else if (totalScore >= 7) {
            grade = "4 (Хорошо)";
        } else if (totalScore >= 5) {
            grade = "3 (Удовл.)";
        } else {
            grade = "2 (Неудовл.)";
        }
        document.getElementById("res-grade").textContent = grade;

        document.getElementById("result-screen").classList.remove("hidden");

        // --- Скрытая отправка данных в Google Форму ---
        // (Оценку тоже можно будет отправлять в таблицу, если захотите)
        sendToGoogleForm(studentName, studentClass, totalScore);
    });

    function sendToGoogleForm(name, className, score) {
        // Замените URL на вашу реальную форму и пропишите entry ID полей
        const formURL = "https://docs.google.com/forms/d/e/18zGvLRe86BDICDiVhkexcoehYU7DbmhKckw1LY-viaE/formResponse";
        const formData = new FormData();
        
        formData.append("entry.426483672", name);      // ID поля ФИО
        formData.append("entry.538540870", className); // ID поля Класс
        formData.append("entry.815205528", score);     // ID поля Оценка

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
