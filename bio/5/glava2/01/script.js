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
    // 2. МЕХАНИКА DRAG AND DROP (Задания 6 и 7)
    // ==========================================
    let draggedElement = null;

    // Функция инициализации перетаскивания элементов
    function initDragAndDrop() {
        const words = document.querySelectorAll(".drag-word");
        const zones = document.querySelectorAll(".group-zone");

        words.forEach(word => {
            word.addEventListener("dragstart", (e) => {
                draggedElement = word;
                e.dataTransfer.setData("text/plain", word.dataset.word);
            });
        });

        // Работа с колонками распределения (Задания 6 и 7)
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
    // 3. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 4)
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

    // Возможность сбросить сопоставление при двойном клике на цель
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

        // --- Задание 1 (Селект: Клетка) ---
        const t1Select = document.querySelector('.hl-select[data-task="1"]');
        if (t1Select && t1Select.value === "Клетка") totalScore += 1;

        // --- Задание 2 (Селект: Орган) ---
        const t2Select = document.querySelector('.hl-select[data-task="2"]');
        if (t2Select && t2Select.value === "Орган") totalScore += 1;

        // --- Задание 3 (Селект: ткани) ---
        const t3Select = document.querySelector('.hl-select[data-task="3"]');
        if (t3Select && t3Select.value === "ткани") totalScore += 1;

        // --- Задание 4 (Сопоставление: Эвглена/Вирус/Медуза) ---
        let t4Correct = true;
        let t4MatchedCount = 0;
        document.querySelectorAll("#right-col .match-target").forEach(target => {
            if (target.classList.contains("matched")) {
                t4MatchedCount++;
                if (target.dataset.id !== target.dataset.userAnswer) t4Correct = false;
            } else {
                t4Correct = false;
            }
        });
        if (t4MatchedCount === 3 && t4Correct) totalScore += 1;

        // --- Задание 5 (Чекбоксы: Ёж, Удав, Человек) ---
        const t5Answers = Array.from(document.querySelectorAll('input[name="q5"]:checked')).map(el => el.value);
        const t5CorrectAnswers = ["Ёж", "Удав", "Человек"];
        if (t5Answers.length === 3 && t5Answers.every(val => t5CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 6 (Drag-and-Drop: 2 колонки) ---
        let t6Correct = true;
        const t6Single = Array.from(document.querySelectorAll("#t6-group1 .drag-word")).map(el => el.dataset.word);
        const t6Multi = Array.from(document.querySelectorAll("#t6-group2 .drag-word")).map(el => el.dataset.word);
        const t6SingleTrue = ["эвглена зелёная", "амёба", "инфузория-туфелька"];
        const t6MultiTrue = ["дождевой червь", "акула", "кошка", "томаты"];
        if (t6Single.length !== 3 || !t6Single.every(val => t6SingleTrue.includes(val))) t6Correct = false;
        if (t6Multi.length !== 4 || !t6Multi.every(val => t6MultiTrue.includes(val))) t6Correct = false;
        if (t6Correct) totalScore += 1;

        // --- Задание 7 (Drag-and-Drop: 5 колонок) ---
        let t7Correct = true;
        const t7Cell = Array.from(document.querySelectorAll("#t7-group1 .drag-word")).map(el => el.dataset.word);
        const t7Tissue = Array.from(document.querySelectorAll("#t7-group2 .drag-word")).map(el => el.dataset.word);
        const t7Organ = Array.from(document.querySelectorAll("#t7-group3 .drag-word")).map(el => el.dataset.word);
        const t7System = Array.from(document.querySelectorAll("#t7-group4 .drag-word")).map(el => el.dataset.word);
        const t7Organism = Array.from(document.querySelectorAll("#t7-group5 .drag-word")).map(el => el.dataset.word);

        const t7CellTrue = ["амёба", "эвглена зелёная"];
        const t7TissueTrue = ["нервная ткань", "мышечная ткань"];
        const t7OrganTrue = ["печень", "хвост"];
        const t7SystemTrue = ["кровеносная система", "дыхательная система"];
        const t7OrganismTrue = ["арбуз", "синий кит"];

        if (t7Cell.length !== 2 || !t7Cell.every(val => t7CellTrue.includes(val))) t7Correct = false;
        if (t7Tissue.length !== 2 || !t7Tissue.every(val => t7TissueTrue.includes(val))) t7Correct = false;
        if (t7Organ.length !== 2 || !t7Organ.every(val => t7OrganTrue.includes(val))) t7Correct = false;
        if (t7System.length !== 2 || !t7System.every(val => t7SystemTrue.includes(val))) t7Correct = false;
        if (t7Organism.length !== 2 || !t7Organism.every(val => t7OrganismTrue.includes(val))) t7Correct = false;
        if (t7Correct) totalScore += 1;

        // --- Задание 8 (Радио: Схема, Тканевый) ---
        const t8Selected = document.querySelector('input[name="q8"]:checked');
        if (t8Selected && t8Selected.value === "Тканевый") totalScore += 1;

        // --- Задание 9 (Радио: Схема, Органный) ---
        const t9Selected = document.querySelector('input[name="q9"]:checked');
        if (t9Selected && t9Selected.value === "Органный") totalScore += 1;

        // --- Задание 10 (Радио: Образовательная) ---
        const t10Selected = document.querySelector('input[name="q10"]:checked');
        if (t10Selected && t10Selected.value === "Образовательная") totalScore += 1;

        // --- Задание 11 (Радио: Соединительная) ---
        const t11Selected = document.querySelector('input[name="q11"]:checked');
        if (t11Selected && t11Selected.value === "Соединительная") totalScore += 1;

        // --- Задание 12 (Радио: Пищеварительная) ---
        const t12Selected = document.querySelector('input[name="q12"]:checked');
        if (t12Selected && t12Selected.value === "Пищеварительная") totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (из 12 возможных баллов)
        let finalGrade = "2";
        if (totalScore >= 11) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 9) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore >= 6) {
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
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSd67LPZsLWt5tT4Qq-Hb_grAPCTvSmsua6NtKpd3LDwsMChdA/formResponse";
        const formData = new FormData();
        
        formData.append("entry.1292777667", name);      // ID поля ФИО
        formData.append("entry.1727129704", className); // ID поля Класс
        formData.append("entry.1649130141", score);     // ID поля Баллы
        formData.append("entry.1569649467", finalGrade); // ID поля Оценка

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
