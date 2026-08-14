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

        // Инициализация интерактивных механик только после входа
        initDragAndDrop();
    });

    // ==========================================
    // 2. МЕХАНИКА DRAG AND DROP (Задание 3)
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
    // 3. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Радио: Кольцевую хромосому) ---
        const t1Selected = document.querySelector('input[name="q1"]:checked');
        if (t1Selected && t1Selected.value === "Кольцевую хромосому") totalScore += 1;

        // --- Задание 2 (Радио: Вирусы) ---
        const t2Selected = document.querySelector('input[name="q2"]:checked');
        if (t2Selected && t2Selected.value === "Вирусы") totalScore += 1;

        // --- Задание 3 (Drag-and-Drop: 2 группы по значению бактерий) ---
        let t3Correct = true;
        const t3Nature = Array.from(document.querySelectorAll("#t3-group1 .drag-word")).map(el => el.dataset.word);
        const t3Human = Array.from(document.querySelectorAll("#t3-group2 .drag-word")).map(el => el.dataset.word);
        const t3NatureTrue = ["круговорот веществ", "разложение остатков растений и животных"];
        const t3HumanTrue = ["кисломолочные продукты", "сквашенные продукты питания", "очистка сточных вод", "болезни растений и животных"];
        
        if (t3Nature.length !== 2 || !t3Nature.every(val => t3NatureTrue.includes(val))) t3Correct = false;
        if (t3Human.length !== 4 || !t3Human.every(val => t3HumanTrue.includes(val))) t3Correct = false;
        if (t3Correct) totalScore += 1;

        // --- Задание 4 (Чекбоксы профилактики: Вакцинация, Личная гигиена) ---
        const t4Answers = Array.from(document.querySelectorAll('#task4 input[type="checkbox"]:checked')).map(el => el.value);
        const t4CorrectAnswers = ["Вакцинация", "Личная гигиена"];
        if (t4Answers.length === 2 && t4Answers.every(val => t4CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 5 (Селект: Вирус) ---
        const t5Select = document.getElementById("t5-select").value;
        if (t5Select === "Вирус") totalScore += 1;

        // --- Задание 6 (Чекбоксы свойств: подходят ВСЕ 5 чекбоксов) ---
        const t6Answers = Array.from(document.querySelectorAll('#task6 input[type="checkbox"]:checked')).map(el => el.value);
        const t6CorrectAnswers = ["Одноклеточные", "Микроскопические", "Питаются органическими веществами", "Быстро размножаются", "При неблагоприятных условиях образуют споры"];
        if (t6Answers.length === 5 && t6Answers.every(val => t6CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 7 (Чекбоксы туберкулёза: Прокариотам, Одноклеточным) ---
        const t7Answers = Array.from(document.querySelectorAll('#task7 input[type="checkbox"]:checked')).map(el => el.value);
        const t7CorrectAnswers = ["Прокариотам", "Одноклеточным"];
        if (t7Answers.length === 2 && t7Answers.every(val => t7CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 8 (Чекбоксы небактериальных болезней: Корь, Гепатит, Краснуха) ---
        const t8Answers = Array.from(document.querySelectorAll('#task8 input[type="checkbox"]:checked')).map(el => el.value);
        const t8CorrectAnswers = ["Корь", "Гепатит", "Краснуха"];
        if (t8Answers.length === 3 && t8Answers.every(val => t8CorrectAnswers.includes(val))) totalScore += 1;

        // --- Вывод результатов на терминал ученика ---
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

        // Отправка данных на бэкенд Google
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL вашей новой формы для Сектора 14
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSebMLN71tkNry0hTSY04VZOuMNAk3Qene61PAMMRrZ56PMi0Q/formResponse";
        const formData = new FormData();
        
        formData.append("entry.2139610972", name);      // Примените экстрактор v2.0 для получения точных ID
        formData.append("entry.1637753613", className); 
        formData.append("entry.1268066522", score);     
        formData.append("entry.1131699654", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
