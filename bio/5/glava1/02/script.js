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
    // 2. МЕХАНИКА ВЫЧЕРКИВАНИЯ СЛОВ (Задание 5)
    // ==========================================
    const strikeButtons = document.querySelectorAll(".strike-btn");
    
    strikeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("strikethrough");
        });
    });
  // ==========================================
    // 3. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Список) ---
        const s1 = document.querySelector("#task1 .hl-select");
        if (s1 && s1.value === s1.dataset.answer) totalScore += 1;

        // --- Задание 2 (Список) ---
        const s2 = document.querySelector("#task2 .hl-select");
        if (s2 && s2.value === s2.dataset.answer) totalScore += 1;

        // --- Задание 3 (Список) ---
        const s3 = document.querySelector("#task3 .hl-select");
        if (s3 && s3.value === s3.dataset.answer) totalScore += 1;

        // --- Задание 4 (Радио) ---
        const t4Selected = document.querySelector('input[name="q4"]:checked');
        if (t4Selected && t4Selected.value === "Измерение") totalScore += 1;

        // --- Задание 5 (Вычеркивание) ---
        let t5Correct = true;
        document.querySelectorAll("#strike-t5 .strike-btn").forEach(btn => {
            const isStriked = btn.classList.contains("strikethrough");
            const shouldBeStriked = btn.dataset.wrong === "true";
            if (isStriked !== shouldBeStriked) t5Correct = false;
        });
        if (t5Correct) totalScore += 1;

        // --- Задание 6 (Чекбоксы) ---
        const t6Answers = Array.from(document.querySelectorAll('input[name="q6"]:checked')).map(el => el.value);
        const t6CorrectAnswers = ["Линейка", "Весы", "Рулетка"];
        if (t6Answers.length === 3 && t6Answers.every(val => t6CorrectAnswers.includes(val))) totalScore += 1;
      // --- Задание 7 (Радио) ---
        const t7Selected = document.querySelector('input[name="q7"]:checked');
        if (t7Selected && t7Selected.value === "Термометр") totalScore += 1;

        // --- Задание 8 (Чекбоксы) ---
        const t8Answers = Array.from(document.querySelectorAll('input[name="q8"]:checked')).map(el => el.value);
        const t8CorrectAnswers = ["Мерный стакан", "Мерный цилиндр"];
        if (t8Answers.length === 2 && t8Answers.every(val => t8CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 9 (Радио) ---
        const t9Selected = document.querySelector('input[name="q9"]:checked');
        if (t9Selected && t9Selected.value === "Весы") totalScore += 1;

        // --- Задание 10 (Радио) ---
        const t10Selected = document.querySelector('input[name="q10"]:checked');
        if (t10Selected && t10Selected.value === "52 мл и 30 мл") totalScore += 1;

        // --- Задание 11 (Радио) ---
        const t11Selected = document.querySelector('input[name="q11"]:checked');
        if (t11Selected && t11Selected.value === "150 мл") totalScore += 1;

        // --- Задание 12 (Радио) ---
        const t12Selected = document.querySelector('input[name="q12"]:checked');
        if (t12Selected && t12Selected.value === "Мерные цилиндры") totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (для 12-балльного теста)
        let finalGrade = "2";
        if (totalScore >= 11) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 8) {
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
        // Укажите URL опубликованной Google Формы в кавычках ниже
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdXMSlPTdOBnn_XriKioVpilqTOYGxVjUCy0B_iF4VEOZtfZQ/";
        const formData = new FormData();
        
        // Замените "entry.XXXXX" на реальные ID полей из вашей формы
        formData.append("entry.854593012", name);      
        formData.append("entry.1854002534", className); 
        formData.append("entry.1614594571", score);     
        formData.append("entry.1341018970", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
