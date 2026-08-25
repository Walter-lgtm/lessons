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
            return "USED"; 
        }

        // 2. Математический хэш-алгоритм
        let hash = 5381;
        for (let i = 0; i < t.length; i++) {
            hash = ((hash << 5) + hash) + t.charCodeAt(i);
        }
        const secretMod = Math.abs(hash) % 997;
        
        // Секретный ключ для параграфа §21 установлен в значение 115
        if (secretMod === 115) {
            // 3. Если код верный, сохраняем его в список использованных (он сгорает)
            usedTokens.push(t);
            localStorage.setItem("mesa_used_tokens", JSON.stringify(usedTokens));
            return "VALID";
        }
        
        return "INVALID"; 
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

        authScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        window.scrollTo(0, 0);
    });

    // ==========================================
    // 2. МЕХАНИКА ВЫЧЕРКИВАНИЯ СЛОВ (Задание 2)
    // ==========================================
    const strikeButtons = document.querySelectorAll(".strike-btn");
    strikeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("strikethrough");
        });
    });

    // ==========================================
    // 3. МЕХАНИКА DRAG AND DROP (Задание 5)
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
    // 4. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Инлайновые инпуты) ---
        const t1_i1 = document.getElementById("t1-i1").value.trim().toLowerCase();
        const t1_i2 = document.getElementById("t1-i2").value.trim().toLowerCase();
        
        if (t1_i1.startsWith("природн") && t1_i2.startsWith("биоцен")) {
            totalScore += 1;
        }

        // --- Задание 2 (Интерактивное вычёркивание слов) ---
        let t2Correct = true;
        document.querySelectorAll("#strike-t2 .strike-btn").forEach(btn => {
            const isStriked = btn.classList.contains("strikethrough");
            const shouldBeStriked = btn.dataset.wrong === "true";
            if (isStriked !== shouldBeStriked) t2Correct = false;
        });
        if (t2Correct) totalScore += 1;

        // --- Задание 3 (Инлайновые инпуты) ---
        const t3_i1 = document.getElementById("t3-i1").value.trim().toLowerCase();
        const t3_i2 = document.getElementById("t3-i2").value.trim().toLowerCase();
        const t3_i3 = document.getElementById("t3-i3").value.trim().toLowerCase();
        
        if (t3_i1.startsWith("продуцент") && t3_i2.startsWith("консумент") && t3_i3.startsWith("редуцент")) {
            totalScore += 1;
        }

        // --- Задание 4 (Выпадающие списки) ---
        const s4_1 = document.getElementById("t4-s1");
        const s4_2 = document.getElementById("t4-s2");
        const s4_3 = document.getElementById("t4-s3");
        
        if (s4_1 && s4_1.value === s4_1.dataset.answer &&
            s4_2 && s4_2.value === s4_2.dataset.answer &&
            s4_3 && s4_3.value === s4_3.dataset.answer) {
            totalScore += 1;
        }

        // --- Задание 5 (Распределение по трём колонкам Drag-and-Drop) ---
        let t5Correct = true;
        const prodValues = Array.from(document.querySelectorAll("#t5-group1 .drag-word")).map(el => el.dataset.word);
        const consValues = Array.from(document.querySelectorAll("#t5-group2 .drag-word")).map(el => el.dataset.word);
        const reduValues = Array.from(document.querySelectorAll("#t5-group3 .drag-word")).map(el => el.dataset.word);
        
        const prodTrue = ["малина", "подсолнечник", "ясень", "томаты"];
        const consTrue = ["сурок", "кабан", "акула", "ёж"];
        const reduTrue = ["белый гриб", "бактерии почвы", "рыжики", "опята"];
        
        if (prodValues.length !== 4 || !prodValues.every(val => prodTrue.includes(val))) t5Correct = false;
        if (consValues.length !== 4 || !consValues.every(val => consTrue.includes(val))) t5Correct = false;
        if (reduValues.length !== 4 || !reduValues.every(val => reduTrue.includes(val))) t5Correct = false;
        
        if (t5Correct) totalScore += 1;

        // --- Вывод результатов ученику ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        // Шкала перевода 5-балльного теста в школьную оценку
        let finalGrade = "2";
        if (totalScore === 5) {
            finalGrade = "5 (Отлично)";
        } else if (totalScore === 4) {
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
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSeU8IHry2KmfhxUKm8ASsPG1l79wiXlqF0-LzJ0h2ujPcMaQg/formResponse";
        const formData = new FormData();
        
        formData.append("entry.804463401", name);      
        formData.append("entry.1892724187", className); 
        formData.append("entry.409776022", score);     
        formData.append("entry.1756173121", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки логов: ", err));
    }
});
