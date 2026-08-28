document.addEventListener("DOMContentLoaded", () => {
        // ==========================================
    // МАТЕМАТИЧЕСКАЯ КРИПТОЗАЩИТА И ОДНОКРАТНОСТЬ
    // ==========================================
    function validateToken(tokenStr) {
        const t = tokenStr.trim().toUpperCase();
        
        // 1. Проверяем, не использовался ли этот код ранее на этом устройстве
        const usedTokens = JSON.parse(localStorage.getItem("mesa_used_tokens") || "[]");
        if (usedTokens.includes(t)) {
            return "USED"; // Код уже "сгорел"
        }

        // 2. Математический хэш-алгоритм
        let hash = 5381;
        for (let i = 0; i < t.length; i++) {
            hash = ((hash << 5) + hash) + t.charCodeAt(i);
        }
        const secretMod = Math.abs(hash) % 997;
        
        // Сверяем с секретным остатком текущего параграфа (например, 777)
        if (secretMod === 160) {
            // 3. Если код верный, сохраняем его в список использованных
            usedTokens.push(t);
            localStorage.setItem("mesa_used_tokens", JSON.stringify(usedTokens));
            return "VALID";
        }
        
        return "INVALID"; // Код просто не существует в природе
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

        // Проверка статуса токена
        const tokenStatus = validateToken(tokenVal);

        if (tokenStatus === "USED") {
            alert("ДОСТУП ЗАБЛОКИРОВАН: Этот персональный код доступа уже был использован!");
            return;
        }

        if (tokenStatus === "INVALID") {
            alert("КРИТИЧЕСКАЯ ОШИБКА: Неверный или просроченный код доступа к терминалу!");
            return;
        }

        // Если статус VALID — пускаем к тесту
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

        // --- Задание 1 (Список) ---
        const s1 = document.querySelector("#task1 .hl-select");
        if (s1 && s1.value === s1.dataset.answer) totalScore += 1;

        // --- Задание 2 (Радио) ---
        const t2Selected = document.querySelector('input[name="q2"]:checked');
        if (t2Selected && t2Selected.value === "Эксперимент") totalScore += 1;

        // --- Задание 3 (Списки) ---
        let t3Correct = true;
        document.querySelectorAll("#task3 .hl-select").forEach(select => {
            if (select.value !== select.dataset.answer) t3Correct = false;
        });
        if (t3Correct) totalScore += 1;

        // --- Задание 4 (Радио) ---
        const t4Selected = document.querySelector('input[name="q4"]:checked');
        if (t4Selected && t4Selected.value === "Гарвей") totalScore += 1;
      // --- Задание 5 (Радио) ---
        const t5Selected = document.querySelector('input[name="q5"]:checked');
        if (t5Selected && t5Selected.value === "Наблюдение за объектом или явлением") totalScore += 1;

        // --- Задание 6 (Текстовые инпуты с защитой) ---
        const i1 = document.getElementById("t6-i1").value.trim().toLowerCase();
        const i2 = document.getElementById("t6-i2").value.trim().toLowerCase();
        
        // Валидация на корни слов, чтобы учесть падежные окончания пятиклассников ("контрольный", "контролем", "опыт", "опытом")
        const i1Correct = i1.startsWith("контрол");
        const i2Correct = i2.startsWith("опыт");
        
        if (i1Correct && i2Correct) totalScore += 1;

        // --- Задание 7 (Чекбоксы) ---
        const t7Answers = Array.from(document.querySelectorAll('input[name="q7"]:checked')).map(el => el.value);
        const t7CorrectAnswers = ["Теорией", "Законом"];
        if (t7Answers.length === 2 && t7Answers.every(val => t7CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 8 (Радио) ---
        const t8Selected = document.querySelector('input[name="q8"]:checked');
        if (t8Selected && t8Selected.value === "Моделирование") totalScore += 1;

        // --- Задание 9 (Радио) ---
        const t9Selected = document.querySelector('input[name="q9"]:checked');
        if (t9Selected && t9Selected.value === "Научный метод") totalScore += 1;

        // --- Задание 10 (Радио) ---
        const t10Selected = document.querySelector('input[name="q10"]:checked');
        if (t10Selected && t10Selected.value === "Бинокль") totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Расчет оценки по пятибалльной шкале (10 вопросов)
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

        // Отправка данных на сервер
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL опубликованной Google Формы в кавычках ниже
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScyAaUqTgrX6QQ_KHjGMZbI7dOkWduUuqdTbmItuN2Zo5UmvA/formResponse";
        const formData = new FormData();
        
        // Замените "entry.XXXXX" на реальные ID полей из вашей формы
        formData.append("entry.423665605", name);      
        formData.append("entry.1673669522", className); 
        formData.append("entry.1985455460", score);     
        formData.append("entry.821595173", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
