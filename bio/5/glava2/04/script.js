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
    // 2. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Комбинированное: фотосинтез + растений) ---
        const t1Text = document.getElementById("t1-text").value.trim().toLowerCase();
        const t1Select = document.getElementById("t1-select").value;
        const t1TextCorrect = (t1Text === "отосинтез" || t1Text === "фотосинтез");
        if (t1TextCorrect && t1Select === "растений") totalScore += 1;

        // --- Задание 2 (Комбинированное: автотрофы + фотосинтезом) ---
        const t2Text = document.getElementById("t2-text").value.trim().toLowerCase();
        const t2Select = document.getElementById("t2-select").value;
        const t2TextCorrect = (t2Text === "втотрофы" || t2Text === "автотрофы");
        if (t2TextCorrect && t2Select === "фотосинтезом") totalScore += 1;

        // --- Задание 3 (Радио: Дыхание) ---
        const t3Selected = document.querySelector('input[name="q3"]:checked');
        if (t3Selected && t3Selected.value === "Дыхание") totalScore += 1;

        // --- Задание 4 (3 селекта: Обмен веществ, развитием, раздражимостью) ---
        const t4Sel1 = document.getElementById("t4-select1").value;
        const t4Sel2 = document.getElementById("t4-select2").value;
        const t4Sel3 = document.getElementById("t4-select3").value;
        if (t4Sel1 === "Обмен веществ" && t4Sel2 === "развитием" && t4Sel3 === "разразжимостью") {
            totalScore += 1;
        } else if (t4Sel1 === "Обмен веществ" && t4Sel2 === "развитием" && t4Sel3 === "раздражимостью") {
            totalScore += 1;
        }

        // --- Задание 5 (4 селекта: Размножение, Фотосинтез, хлоропластах, хлорофилл) ---
        const t5Sel1 = document.getElementById("t5-select1").value;
        const t5Sel2 = document.getElementById("t5-select2").value;
        const t5Sel3 = document.getElementById("t5-select3").value;
        const t5Sel4 = document.getElementById("t5-select4").value;
        if (t5Sel1 === "Размножение" && t5Sel2 === "Фотосинтез" && t5Sel3 === "хлоропластах" && t5Sel4 === "хлорофилл") {
            totalScore += 1;
        }

        // --- Задание 6 (Чекбоксы: Росянка, Венерина мухоловка) ---
        const t6Answers = Array.from(document.querySelectorAll('#task6 input[type="checkbox"]:checked')).map(el => el.value);
        const t6CorrectAnswers = ["Росянка", "Венерина мухоловка"];
        if (t6Answers.length === 2 && t6Answers.every(val => t6CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 7 (Чекбоксы: Дуб, Герань) ---
        const t7Answers = Array.from(document.querySelectorAll('#task7 input[type="checkbox"]:checked')).map(el => el.value);
        const t7CorrectAnswers = ["Дуб", "Герань"];
        if (t7Answers.length === 2 && t7Answers.every(val => t7CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 8 (Радио: Эвглена зелёная) ---
        const t8Selected = document.querySelector('input[name="q8"]:checked');
        if (t8Selected && t8Selected.value === "Эвглена зелёная") totalScore += 1;

        // --- Задание 9 (Инлайн-ввод текста: цитоплазма, ядро, хромопласты) ---
        const t9Ans1 = document.getElementById("t9-ans1").value.trim().toLowerCase();
        const t9Ans2 = document.getElementById("t9-ans2").value.trim().toLowerCase();
        const t9Ans3 = document.getElementById("t9-ans3").value.trim().toLowerCase();
        
        const t9Correct1 = (t9Ans1 === "цитоплазма");
        const t9Correct2 = (t9Ans2 === "ядро" || t9Ans2 === "ядром");
        const t9Correct3 = (t9Ans3 === "хромопласты");
        
        if (t9Correct1 && t9Correct2 && t9Correct3) totalScore += 1;

        // --- Задание 10 (4 селекта: органических веществ, цитоплазмы, ядро, хромосомы) ---
        const t10Sel1 = document.getElementById("t10-select1").value;
        const t10Sel2 = document.getElementById("t10-select2").value;
        const t10Sel3 = document.getElementById("t10-select3").value;
        const t10Sel4 = document.getElementById("t10-select4").value;
        if (t10Sel1 === "органических веществ" && t10Sel2 === "цитоплазмы" && t10Sel3 === "ядро" && t10Sel4 === "хромосомы") {
            totalScore += 1;
        }

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (из 10 возможных баллов)
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

        // Отправка данных на сервер Google
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Замените URL на вашу новую форму для Сектора 11
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScZ4wk_d0HlTLPmJSwAOs6VYzDAQ2BGhPdFqBbTypMpRKpVYg/formResponse";
        const formData = new FormData();
        
        formData.append("entry.1111803747", name);      // Перепроверьте ID полей через F12-скрипт
        formData.append("entry.514073503", className); 
        formData.append("entry.1338141441", score);     
        formData.append("entry.1836378227", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
