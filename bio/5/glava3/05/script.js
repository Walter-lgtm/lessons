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
    // МАТЕМАТИЧЕСКАЯ КРИПТОЗАЩИТА (ХЭШ КНУТА)
    // ==========================================
    function validateToken(tokenStr) {
        const t = tokenStr.trim().toUpperCase();
        let hash = 5381;
        for (let i = 0; i < t.length; i++) {
            hash = ((hash << 5) + hash) + t.charCodeAt(i);
        }
        // Модуль 997 возвращает остаток от деления хэша
        const secretMod = Math.abs(hash) % 997;
        
        // Секретный ключ для параграфа §19 установлен в значение 500
        return secretMod === 500; 
    }

    // ==========================================
    // 1. АВТОРИЗАЦИЯ И СТАРТ ТЕСТА
    // ==========================================
    startBtn.addEventListener("click", () => {
        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();
        const tokenVal = document.getElementById("student-token").value;

        if (!studentName || !studentClass || !tokenVal) {
            alert("ВНИМАНИЕ! Доступ заблокирован. Заполните ФИО, Класс и Код доступа.");
            return;
        }

        // Запуск криптографической проверки токена
        if (!validateToken(tokenVal)) {
            alert("КРИТИЧЕСКАЯ ОШИБКА: Неверный или просроченный код доступа к терминалу!");
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

        // --- Задание 1 (Инлайновые инпуты с падежной защитой) ---
        const i1 = document.getElementById("t1-i1").value.trim().toLowerCase();
        const i2 = document.getElementById("t1-i2").value.trim().toLowerCase();
        const i3 = document.getElementById("t1-i3").value.trim().toLowerCase();
        const i4 = document.getElementById("t1-i4").value.trim().toLowerCase();
        
        const i1Correct = i1.startsWith("взаимо"); // взаимовыгодными, взаимополезными
        const i2Correct = i2.startsWith("паразит"); // паразитическими, паразитизм
        const i3Correct = i3.startsWith("паразит"); // Паразит, паразитом
        const i4Correct = i4.startsWith("хозя");    // Хозяин, хозяином
        
        if (i1Correct && i2Correct && i3Correct && i4Correct) totalScore += 1;

        // --- Задание 2 (Чекбоксы / Множественный выбор) ---
        const t2Answers = Array.from(document.querySelectorAll('input[name="q2"]:checked')).map(el => el.value);
        const t2CorrectAnswers = ["Свиного цепня", "Гриба трутовика"];
        
        if (t2Answers.length === 2 && t2Answers.every(val => t2CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 3 (Выпадающие списки 1 и 2) ---
        const s3_1 = document.getElementById("t3-s1");
        const s3_2 = document.getElementById("t3-s2");
        
        if (s3_1 && s3_1.value === s3_1.dataset.answer && s3_2 && s3_2.value === s3_2.dataset.answer) {
            totalScore += 1;
        }

        // --- Задание 4 (Выпадающий список заголовка памятки *) ---
        const s4_1 = document.getElementById("t4-s1");
        if (s4_1 && s4_1.value === s4_1.dataset.answer) totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Шкала перевода 4-балльного теста в школьную 5-балльную оценку
        let finalGrade = "2";
        if (totalScore === 4) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore === 3) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore === 2) {
            finalGrade = "3 (Удовл.)";
        } else {
            finalGrade = "2 (Неудовл.)";
        }
        document.getElementById("res-grade").textContent = finalGrade;
        document.getElementById("result-screen").classList.remove("hidden");

        // Скрытая отправка сформированных данных на сервер Google
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSd31RrVlWBJwMF5leGFQjc8fpfDnzBb7_CD1HcZwVqa-BKBVg/formResponse";
        const formData = new FormData();
        
        // Замените "entry.XXXXX" на реальные ID полей вашей формы из консоли F12
        formData.append("entry.1636037548", name);      
        formData.append("entry.1194415134", className); 
        formData.append("entry.368714141", score);     
        formData.append("entry.1193701472", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки логов: ", err));
    }
});
