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
        if (secretMod === 777) {
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
    // 2. МЕХАНИКА DRAG AND DROP (Задание 2)
    // ==========================================
    let draggedElement = null;
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
            content.appendChild(draggedElement);
            draggedElement = null;
        });
    });

    // ==========================================
    // 3. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Инлайновые инпуты с падежной защитой) ---
        const i1 = document.getElementById("t1-i1").value.trim().toLowerCase();
        const i2 = document.getElementById("t1-i2").value.trim().toLowerCase();
        const i3 = document.getElementById("t1-i3").value.trim().toLowerCase();
        const i4 = document.getElementById("t1-i4").value.trim().toLowerCase();
        
        const i1Correct = i1.startsWith("фотопериод"); // фотопериодизм
        const i2Correct = i2.startsWith("годов");      // годовой, годовые
        const i3Correct = i3.startsWith("лин");        // линька
        const i4Correct = i4.startsWith("миграц");     // миграции, миграция
        
        if (i1Correct && i2Correct && i3Correct && i4Correct) totalScore += 1;

        // --- Задание 2 (Сортировка Drag-and-Drop по колонкам) ---
        let t2Correct = true;
        const summerValues = Array.from(document.querySelectorAll("#t2-group1 .drag-word")).map(el => el.dataset.word);
        const winterValues = Array.from(document.querySelectorAll("#t2-group2 .drag-word")).map(el => el.dataset.word);
        
        const summerTrue = ["крокодилы", "суслики"];
        const winterTrue = ["барсуки", "сурки", "ежи", "хомяки", "змеи", "бурые медведи"];
        
        if (summerValues.length !== 2 || !summerValues.every(val => summerTrue.includes(val))) t2Correct = false;
        if (winterValues.length !== 6 || !winterValues.every(val => winterTrue.includes(val))) t2Correct = false;
        if (t2Correct) totalScore += 1;

        // --- Задание 3 (Радио / Одиночный выбор) ---
        const t3Selected = document.querySelector('input[name="q3"]:checked');
        if (t3Selected && t3Selected.value === "Дыхание семян") totalScore += 1;

        // --- Задание 4 (Радио / Одиночный выбор) ---
        const t4Selected = document.querySelector('input[name="q4"]:checked');
        if (t4Selected && t4Selected.value === "Спячка") totalScore += 1;

        // --- Задание 5 (Чекбоксы / Множественный выбор) ---
        const t5Answers = Array.from(document.querySelectorAll('input[name="q5"]:checked')).map(el => el.value);
        const t5CorrectAnswers = ["Воробьи", "Голуби"];
        if (t5Answers.length === 2 && t5Answers.every(val => t5CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 6 (Радио / Одиночный выбор) ---
        const t6Selected = document.querySelector('input[name="q6"]:checked');
        if (t6Selected && t6Selected.value === "Наземно-воздушная") totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Шкала перевода 6-балльного теста в школьную 5-балльную оценку
        let finalGrade = "2";
        if (totalScore === 6) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore >= 4) {
            finalGrade = "4 (Хорошо)";
        } else if (totalScore === 3) {
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
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSeQnUkLRgZh3VRpKdfY_6ShZ4IRGWuRD0i5X6q1dIfBE3R_QA/formResponse";
        const formData = new FormData();
        
        formData.append("entry.1877070009", name);      
        formData.append("entry.1370506354", className); 
        formData.append("entry.1369052393", score);     
        formData.append("entry.889449314", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки логов: ", err));
    }
});
