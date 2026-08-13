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

        // КРИТИЧЕСКИЙ ФИКС: Инициализируем Drag-and-Drop ТОЛЬКО после открытия тестов,
        // когда элементы появились в DOM-дереве и готовы к обработке!
        initDragAndDrop(); 
    });

    // ==========================================
    // 2. МЕХАНИКА DRAG AND DROP (Задание 5)
    // ==========================================
    let draggedElement = null;

    function initDragAndDrop() {
        const words = document.querySelectorAll(".drag-word");
        const zones = document.querySelectorAll(".group-zone");

        words.forEach(word => {
            word.addEventListener("dragstart", (e) => {
                draggedElement = word;
                e.dataTransfer.setData("text/plain", word.dataset.word);
            });
        });

        zones.forEach(zone => {
            const content = zone.querySelector(".zone-content");
            zone.addEventListener("dragover", (e) => e.preventDefault());
            zone.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!draggedElement) return;

                const sourceContainer = draggedElement.closest(".task-card");
                const targetContainer = zone.closest(".task-card");
                if (sourceContainer !== targetContainer) return;

                content.appendChild(draggedElement);
                draggedElement = null;
            });
        });
    }

    // ==========================================
    // 3. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 6)
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

        // --- Задание 1 (Селект: Клеточная мембрана) ---
        const t1Select = document.querySelector('.hl-select[data-task="1"]');
        if (t1Select && t1Select.value === "Клеточная мембрана") totalScore += 1;

        // --- Задание 2 (Чекбоксы: Арбуз, Берёза) ---
        const t2Answers = Array.from(document.querySelectorAll('#task2 input[type="checkbox"]:checked')).map(el => el.value);
        const t2CorrectAnswers = ["Арбуз", "Берёза"];
        if (t2Answers.length === 2 && t2Answers.every(val => t2CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 3 (Радио: Деление) ---
        const t3Selected = document.querySelector('input[name="q3"]:checked');
        if (t3Selected && t3Selected.value === "Деление") totalScore += 1;

        // --- Задание 4 (Инлайн-ввод: цитология, Шлейден, Шванн) ---
        const t4Ans1 = document.getElementById("t4-ans1").value.trim().toLowerCase();
        const t4Ans2 = document.getElementById("t4-ans2").value.trim().toLowerCase();
        const t4Ans3 = document.getElementById("t4-ans3").value.trim().toLowerCase();
        // Пятиклассники могут вписать только окончания или слово целиком, сделаем проверку по вхождению корня
        const t4Correct1 = (t4Ans1 === "иология" || t4Ans1 === "цитология");
        const t4Correct2 = (t4Ans2 === "ейден" || t4Ans2 === "шлейден");
        const t4Correct3 = (t4Ans3 === "анн" || t4Ans3 === "шванн");
        if (t4Correct1 && t4Correct2 && t4Correct3) totalScore += 1;

        // --- Задание 5 (Drag-and-Drop: 2 колонки) ---
        let t5Correct = true;
        const t5Plant = Array.from(document.querySelectorAll("#t5-group1 .drag-word")).map(el => el.dataset.word);
        const t5General = Array.from(document.querySelectorAll("#t5-group2 .drag-word")).map(el => el.dataset.word);
        const t5PlantTrue = ["хромопласты", "лейкопласты", "клеточная оболочка", "хлоропласты"];
        const t5GeneralTrue = ["ядро", "хромосомы", "лизосомы", "цитоплазма"];
        if (t5Plant.length !== 4 || !t5Plant.every(val => t5PlantTrue.includes(val))) t5Correct = false;
        if (t5General.length !== 4 || !t5General.every(val => t5GeneralTrue.includes(val))) t5Correct = false;
        if (t5Correct) totalScore += 1;

        // --- Задание 6 (Сопоставление процентов кликами) ---
        let t6Correct = true;
        let t6MatchedCount = 0;
        document.querySelectorAll("#right-col .match-target").forEach(target => {
            if (target.classList.contains("matched")) {
                t6MatchedCount++;
                if (target.dataset.id !== target.dataset.userAnswer) t6Correct = false;
            } else {
                t6Correct = false;
            }
        });
        if (t6MatchedCount === 4 && t6Correct) totalScore += 1;

        // --- Задание 7 (Инлайн-ввод элементов: кислород, водород, азот, углерод) ---
        const t7Ans1 = document.getElementById("t7-ans1").value.trim().toLowerCase();
        const t7Ans2 = document.getElementById("t7-ans2").value.trim().toLowerCase();
        const t7Ans3 = document.getElementById("t7-ans3").value.trim().toLowerCase();
        const t7Ans4 = document.getElementById("t7-ans4").value.trim().toLowerCase();
        const t7Correct1 = (t7Ans1 === "ислород" || t7Ans1 === "кислород");
        const t7Correct2 = (t7Ans2 === "одород" || t7Ans2 === "водород");
        const t7Correct3 = (t7Ans3 === "зот" || t7Ans3 === "азот");
        const t7Correct4 = (t7Ans4 === "глерод" || t7Ans4 === "углерод");
        if (t7Correct1 && t7Correct2 && t7Correct3 && t7Correct4) totalScore += 1;

        // --- Задание 8 (Селекты: Неорганические / Органические) ---
        const t8Select1 = document.querySelector('.hl-select[data-task="8-1"]');
        const t8Select2 = document.querySelector('.hl-select[data-task="8-2"]');
        if (t8Select1 && t8Select1.value === "Неорганические вещества" && t8Select2 && t8Select2.value === "Органические вещества") totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (из 8 возможных баллов)
        let finalGrade = "2";
        if (totalScore === 8) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 6) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore >= 4) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }
        document.getElementById("res-grade").textContent = finalGrade;

        document.getElementById("result-screen").classList.remove("hidden");

        // Отправка данных на сервер
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL вашей формы для Сектора 10
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdiP0meB1P2Zg_ZQBpOLDMCSSx5rr0QQms43-6QB6eJju7QKw/formResponse";
        const formData = new FormData();
        
        formData.append("entry.2144892070", name);      // Перепроверьте ID полей через F12-скрипт
        formData.append("entry.1389499141", className); 
        formData.append("entry.477974354", score);     
        formData.append("entry.1287213347", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
