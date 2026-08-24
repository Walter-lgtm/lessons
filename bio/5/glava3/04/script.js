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
    const submitBtn = document.getElementById("submit-quiz-btn");

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
    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Текстовые инпуты с падежной защитой) ---
        const i1 = document.getElementById("t1-i1").value.trim().toLowerCase();
        const i2 = document.getElementById("t1-i2").value.trim().toLowerCase();
        const i3 = document.getElementById("t1-i3").value.trim().toLowerCase();
        
        // Проверка начал слов для игнорирования окончаний пятиклассников
        const i1Correct = i1.startsWith("почв");
        const i2Correct = i2.startsWith("плодород");
        // Защита: принимает и "гумус", и "перегной"/"перегнойная"
        const i3Correct = i3.startsWith("гумус") || i3.startsWith("перег");
        
        if (i1Correct && i2Correct && i3Correct) totalScore += 1;

        // --- Задание 2 (Радио / Одиночный выбор) ---
        const t2Selected = document.querySelector('input[name="q2"]:checked');
        if (t2Selected && t2Selected.value === "Докучаев") totalScore += 1;

        // --- Задание 3 (Чекбоксы / Множественный выбор) ---
        const t3Answers = Array.from(document.querySelectorAll('input[name="q3"]:checked')).map(el => el.value);
        const t3CorrectAnswers = ["Тля", "Барсуки"];
        
        // Балл засчитывается, если выбраны только правильные варианты и их ровно 2
        if (t3Answers.length === 2 && t3Answers.every(val => t3CorrectAnswers.includes(val))) totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Шкала перевода 3-балльного экспресс-теста в школьную оценку
        let finalGrade = "2";
        if (totalScore === 3) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore === 2) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore === 1) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }
        document.getElementById("res-grade").textContent = finalGrade;
        document.getElementById("result-screen").classList.remove("hidden");

        // Отправка сформированных логов на сервер Google
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL вашей опубликованной Google Формы в кавычках ниже
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScd5-AD06TgNzLRjyxGTnMuP6XhwVEfSa6s2GgLQkonOFis7A/formResponse";
        const formData = new FormData();
        
        // Замените "entry.XXXXX" на реальные ID полей, собранные через F12
        formData.append("entry.513443586", name);      
        formData.append("entry.2120873401", className); 
        formData.append("entry.808684266", score);     
        formData.append("entry.1998011587", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
