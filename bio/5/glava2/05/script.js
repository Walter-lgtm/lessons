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

        // Инициализируем интерактив только после появления элементов в DOM
        initGlobalDragAndDrop();
    });

    // ==========================================
    // 2. УНИВЕРСАЛЬНАЯ МЕХАНИКА DRAG AND DROP
    // ==========================================
    let draggedElement = null;

    function initGlobalDragAndDrop() {
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
            
            zone.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            zone.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!draggedElement) return;

                // Защита: плашка должна оставаться внутри своего задания
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

        // --- Задание 1 (Чекбоксы: 1, 3, 6) ---
        const t1Answers = Array.from(document.querySelectorAll('#task1 input[type="checkbox"]:checked')).map(el => el.value);
        const t1CorrectAnswers = ["1", "3", "6"];
        if (t1Answers.length === 3 && t1Answers.every(val => t1CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 2 (Ручной ввод без подсказок: эволюция, классификация, систематика) ---
        const t2Ans1 = document.getElementById("t2-ans1").value.trim().toLowerCase();
        const t2Ans2 = document.getElementById("t2-ans2").value.trim().toLowerCase();
        const t2Ans3 = document.getElementById("t2-ans3").value.trim().toLowerCase();
        // Умная проверка: зачитываем и окончание, и слово целиком (если ввели с опорной буквой)
        const t2Correct1 = (t2Ans1 === "волюция" || t2Ans1 === "эволюция");
        const t2Correct2 = (t2Ans2 === "лассификация" || t2Ans2 === "классификация");
        const t2Correct3 = (t2Ans3 === "истематика" || t2Ans3 === "систематика");
        if (t2Correct1 && t2Correct2 && t2Correct3) totalScore += 1;

        // --- Задание 3 (Селект: Вид) ---
        const t3Select = document.getElementById("t3-select").value;
        if (t3Select === "Вид") totalScore += 1;

        // --- Задание 4 (Drag-and-Drop: 3 колонки строения) ---
        let t4Correct = true;
        const t4NonCellular = Array.from(document.querySelectorAll("#t4-group1 .drag-word")).map(el => el.dataset.word);
        const t4Prokaryotes = Array.from(document.querySelectorAll("#t4-group2 .drag-word")).map(el => el.dataset.word);
        const t4Eukaryotes = Array.from(document.querySelectorAll("#t4-group3 .drag-word")).map(el => el.dataset.word);
        
        if (t4NonCellular.length !== 1 || t4NonCellular[0] !== "вирусы") t4Correct = false;
        if (t4Prokaryotes.length !== 3 || !t4Prokaryotes.every(v => ["архебактерии", "цианобактерии", "бактерии"].includes(v))) t4Correct = false;
        if (t4Eukaryotes.length !== 3 || !t4Eukaryotes.every(v => ["амёба", "инфузория-туфелька", "креветки"].includes(v))) t4Correct = false;
        if (t4Correct) totalScore += 1;

        // --- Задание 5 (Радио: Эукариоты) ---
        const t5Selected = document.querySelector('input[name="q5"]:checked');
        if (t5Selected && t5Selected.value === "Эукариоты") totalScore += 1;

        // --- Задание 6 (Сопоставление царств кликами) ---
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

        // --- Задание 7 (Радио: Царство животных) ---
        const t7Selected = document.querySelector('input[name="q7"]:checked');
        if (t7Selected && t7Selected.value === "Царство животных") totalScore += 1;

        // --- Задание 8 (Drag-and-Drop: 4 царства) ---
        let t8Correct = true;
        const t8Bacteria = Array.from(document.querySelectorAll("#t8-group1 .drag-word")).map(el => el.dataset.word);
        const t8Plants = Array.from(document.querySelectorAll("#t8-group2 .drag-word")).map(el => el.dataset.word);
        const t8Animals = Array.from(document.querySelectorAll("#t8-group3 .drag-word")).map(el => el.dataset.word);
        const t8Fungi = Array.from(document.querySelectorAll("#t8-group4 .drag-word")).map(el => el.dataset.word);

        if (t8Bacteria.length !== 3 || !t8Bacteria.every(v => ["бактерии", "архебактерии", "цианобактерии"].includes(v))) t8Correct = false;
        if (t8Plants.length !== 3 || !t8Plants.every(v => ["пшеница", "лён", "картофель"].includes(v))) t8Correct = false;
        if (t8Animals.length !== 3 || !t8Animals.every(v => ["дельфин", "антилопа", "бегемот"].includes(v))) t8Correct = false;
        if (t8Fungi.length !== 3 || !t8Fungi.every(v => ["маслята", "дрожжи", "подосиновики"].includes(v))) t8Correct = false;
        if (t8Correct) totalScore += 1;

        // --- Задание 9 (Радио: Надцатьарство эукариот) ---
        const t9Selected = document.querySelector('input[name="q9"]:checked');
        if (t9Selected && t9Selected.value === "Надцатьарство эукариот") totalScore += 1;

        // --- Задание 10 (Чекбоксы: 1, 2, 4) ---
        const t10Answers = Array.from(document.querySelectorAll('#task10 input[type="checkbox"]:checked')).map(el => el.value);
        const t10CorrectAnswers = ["1", "2", "4"];
        if (t10Answers.length === 3 && t10Answers.every(val => t10CorrectAnswers.includes(val))) totalScore += 1;

        // --- Вывод результатов ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (из 10 баллов)
        let finalGrade = "2";
        if (totalScore >= 9) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 7) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore >= 5) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }
        document.getElementById("res-grade").textContent = finalGrade;

        document.getElementById("result-screen").classList.remove("hidden");

        // Отправка данных через квантовый шлюз
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Замените URL на вашу новую форму для Сектора 12
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScSNsnLScUtptrVsahxOkLLl4RcQqJshg-xwt0ZTqCbc3-g8g/formResponse";
        const formData = new FormData();
        
        formData.append("entry.1312549769", name);      // Подставьте новые ID полей из экстрактора v2.0
        formData.append("entry.1926894525", className); 
        formData.append("entry.588438584", score);     
        formData.append("entry.1767232420", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
