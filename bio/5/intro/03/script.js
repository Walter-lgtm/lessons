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
    // 2. ПРОВЕРКА ОТВЕТОВ И ПОДСЧЕТ БАЛЛОВ
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задания 1, 2, 3 (Выпадающие списки) ---
        const s1 = document.getElementById("t3-select1").value;
        const s2 = document.getElementById("t3-select2").value;
        const s3 = document.getElementById("t3-select3").value;

        if (s1 === "понятие") totalScore += 1;
        if (s2 === "термин") totalScore += 1;
        if (s3 === "символ") totalScore += 1;

        // --- Задания 4, 5, 6 (Радиокнопки отраслей биологии) ---
        const t4Selected = document.querySelector('input[name="q4"]:checked');
        const t5Selected = document.querySelector('input[name="q5"]:checked');
        const t6Selected = document.querySelector('input[name="q6"]:checked');

        if (t4Selected && t4Selected.value === "Селекция") totalScore += 1;
        if (t5Selected && t5Selected.value === "Фармакология") totalScore += 1;
        if (t6Selected && t6Selected.value === "Биохимия") totalScore += 1;

        // --- Задание 7 (Выпадающий список "энциклопедия") ---
        const s7 = document.getElementById("t3-select7").value;
        if (s7 === "энциклопедия") totalScore += 1;

        // --- Расчет оценки по пятибалльной шкале (из 7 баллов) ---
        let finalGrade = "2";
        if (totalScore >= 7) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 5) {
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

        // Вызов функции скрытой отправки данных на сервер
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });
  // ==========================================
    // 3. СКРЫТАЯ ПЕРЕДАЧА ДАННЫХ В GOOGLE ТАБЛИЦУ
    // ==========================================
    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите здесь URL вашей ТРЕТЬЕЙ (новой) опубликованной Google Формы
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSc8hiqzDXBBVKrihh91GE8pklssV75InjwnoEeoNo2kSG2IZQ/formResponse";
        const formData = new FormData();
        
        // Укажите здесь реальные entry.ID полей вашей ТРЕТЬЕЙ формы
        formData.append("entry.175845927", name);       // ID поля ФИО формы 03
        formData.append("entry.2029457389", className);  // ID поля Класс формы 03
        formData.append("entry.1381298714", score);      // ID поля Баллы формы 03
        formData.append("entry.205211208", finalGrade); // ID поля Оценка формы 03

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
}); // Самая последняя скобка, закрывающая DOMContentLoaded
