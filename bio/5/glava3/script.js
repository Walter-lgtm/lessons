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
    // 1. АВТОРИЗАЦИЯ И СТАРТ ТЕСТА (АНТИ-БРУТФОРС v2.0)
    // ==========================================
    startBtn.addEventListener("click", () => {
        studentName = inputName.value.trim();
        studentClass = inputClass.value.trim();

        if (!studentName || !studentClass) {
            alert("ВНИМАНИЕ! Доступ заблокирован. Введите ФИО и Класс для идентификации.");
            return;
        }

        // === НАЧАЛО БЛОКА ПОДВОХА (ВЕРСИЯ 2.0 - ЖЕСТКИЙ ПРОТОКОЛ) ===
        const studentUid = (studentName + "_" + studentClass).toLowerCase().replace(/\s+/g, '');
        const storageKey = "attempts_" + window.location.pathname.split("/").pop() + "_" + studentUid;
        
        let currentAttempt = parseInt(localStorage.getItem(storageKey)) || 0;
        currentAttempt++; 
        localStorage.setItem(storageKey, currentAttempt); 

        if (currentAttempt > 1) {
            let penalty = currentAttempt - 1;
            window.currentPenalty = penalty;
            window.currentAttemptNumber = currentAttempt;
        } else {
            window.currentPenalty = 0;
            window.currentAttemptNumber = 1;
        }
        // === КОНЕЦ БЛОКА ПОДВОХА ===

        authScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        window.scrollTo(0, 0);

        // Инициализация интерактивных механик
        initGlobalDragAndDrop();
        initStrikeMechanics();
        initMatchMechanic();
    });

    // ==========================================
    // 2. УНИВЕРСАЛЬНАЯ МЕХАНИКА DRAG AND DROP (Задания 3, 5, 7)
    // ==========================================
    let draggedElement = null;

    function initGlobalDragAndDrop() {
        const words = document.querySelectorAll(".drag-word:not(.strike-item-t2):not(.strike-item-t6):not(.strike-item-t8)");
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
    // 3. МЕХАНИКА ВЫЧЕРКИВАНИЯ СЛОВ (Задания 2, 6, 8)
    // ==========================================
    function initStrikeMechanics() {
        // Задание 2
        document.querySelectorAll(".strike-item-t2").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                item.classList.toggle("crossed-out");
            });
        });

        // Задание 6
        document.querySelectorAll(".strike-item-t6").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                item.classList.toggle("crossed-out");
            });
        });

        // Задание 8
        document.querySelectorAll(".strike-item-t8").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                item.classList.toggle("crossed-out");
            });
        });
    }
   // ==========================================
    // 4. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 4)
    // ==========================================
    function initMatchMechanic() {
        let selectedLeftT4 = null;
        const leftItemsT4 = document.querySelectorAll(".t4-left");
        const rightTargetsT4 = document.querySelectorAll(".t4-right");

        leftItemsT4.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("matched")) return;
                leftItemsT4.forEach(i => i.classList.remove("selected"));
                selectedLeftT4 = item;
                item.classList.add("selected");
            });
        });

        rightTargetsT4.forEach(target => {
            target.addEventListener("click", () => {
                if (target.classList.contains("matched") || !selectedLeftT4) return;
                target.dataset.userAnswer = selectedLeftT4.dataset.id;
                target.classList.add("matched");
                selectedLeftT4.classList.add("matched");
                selectedLeftT4.classList.remove("selected");
                selectedLeftT4 = null;
            });
        });
    }

    // ==========================================
    // 5. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Ручной ввод без подсказок: среда, экологические, факторы, условия, ресурсы) ---
        const t1Ans1 = document.getElementById("t1-ans1").value.trim().toLowerCase();
        const t1Ans2 = document.getElementById("t1-ans2").value.trim().toLowerCase();
        const t1Ans3 = document.getElementById("t1-ans3").value.trim().toLowerCase();
        const t1Ans4 = document.getElementById("t1-ans4").value.trim().toLowerCase();
        const t1Ans5 = document.getElementById("t1-ans5").value.trim().toLowerCase();

        const t1Correct1 = (t1Ans1 === "реда" || t1Ans1 === "среда" || t1Ans1 === "средами" || t1Ans1 === "редами");
        const t1Correct2 = (t1Ans2 === "кологические" || t1Ans2 === "экологические");
        const t1Correct3 = (t1Ans3 === "акторы" || t1Ans3 === "факторы");
        const t1Correct4 = (t1Ans4 === "словия" || t1Ans4 === "условия");
        const t1Correct5 = (t1Ans5 === "есурсы" || t1Ans5 === "ресурсы");

        if (t1Correct1 && t1Correct2 && t1Correct3 && t1Correct4 && t1Correct5) totalScore += 1;

        // --- Задание 2 (Вычеркивание ресурсов: кислород, вода) ---
        let t2Correct = true;
        const allItemsT2 = document.querySelectorAll(".strike-item-t2");
        const toStrikeT2 = ["кислород", "вода"];
        allItemsT2.forEach(item => {
            const name = item.dataset.word;
            const isCrossed = item.classList.contains("crossed-out");
            if (toStrikeT2.includes(name) && !isCrossed) t2Correct = false;
            if (!toStrikeT2.includes(name) && isCrossed) t2Correct = false;
        });
        if (t2Correct) totalScore += 1;

        // --- Задание 3 (Drag-and-Drop Условия/Ресурсы) ---
        let t3Correct = true;
        const t3Cond = Array.from(document.querySelectorAll("#t3-group1 .drag-word")).map(el => el.dataset.word);
        const t3Res = Array.from(document.querySelectorAll("#t3-group2 .drag-word")).map(el => el.dataset.word);
        if (t3Cond.length !== 4 || !t3Cond.every(v => ["солнечный свет", "влажность", "освещённость", "температура"].includes(v))) t3Correct = false;
        if (t3Res.length !== 2 || !t3Res.every(v => ["вода", "углекислый газ"].includes(v))) t3Correct = false;
        if (t3Correct) totalScore += 1;

        // --- Задание 4 (Сопоставление сред, 4 пары) ---
        let t4Correct = true;
        let t4Count = 0;
        document.querySelectorAll(".t4-right").forEach(target => {
            if (target.classList.contains("matched")) {
                t4Count++;
                if (target.dataset.id !== target.dataset.userAnswer) t4Correct = false;
            } else {
                t4Correct = false;
            }
        });
        if (t4Count === 4 && t4Correct) totalScore += 1;

        // --- Задание 5 (ОБНОВЛЕННЫЙ Drag-and-Drop: Организмы по 4 средам) ---
        let t5Correct = true;
        const t5Water = Array.from(document.querySelectorAll("#t5-group1 .drag-word")).map(el => el.dataset.word);
        const t5Air = Array.from(document.querySelectorAll("#t5-group2 .drag-word")).map(el => el.dataset.word);
        const t5Soil = Array.from(document.querySelectorAll("#t5-group3 .drag-word")).map(el => el.dataset.word);
        const t5Organism = Array.from(document.querySelectorAll("#t5-group4 .drag-word")).map(el => el.dataset.word);

        if (t5Water.length !== 4 || !t5Water.every(v => ["щука", "осьминог", "морж", "синий кит"].includes(v))) t5Correct = false;
        if (t5Air.length !== 4 || !t5Air.every(v => ["аист", "бурый медведь", "кенгуру", "тигр уссурийский"].includes(v))) t5Correct = false;
        if (t5Soil.length !== 5 || !t5Soil.every(v => ["личинка майского жука", "дождевой червь", "медведка", "крот", "клещ"].includes(v))) t5Correct = false;
        if (t5Organism.length !== 3 || !t5Organism.every(v => ["бычий цепень", "блоха", "вши"].includes(v))) t5Correct = false;
        if (t5Correct) totalScore += 1;

        // --- Задание 6 (Вычеркивание НЕ наземных: пиявка, акула, острицы, грибы кандида) ---
        let t6Correct = true;
        const allItemsT6 = document.querySelectorAll(".strike-item-t6");
        const toStrikeT6 = ["пиявка", "акула", "острицы", "грибы кандида"];
        allItemsT6.forEach(item => {
            const name = item.dataset.word;
            const isCrossed = item.classList.contains("crossed-out");
            if (toStrikeT6.includes(name) && !isCrossed) t6Correct = false;
            if (!toStrikeT6.includes(name) && isCrossed) t6Correct = false;
        });
        if (t6Correct) totalScore += 1;

        // --- Задание 7 (Drag-and-Drop Эко-факторы) ---
        let t7Correct = true;
        const t7Abiotic = Array.from(document.querySelectorAll("#t7-group1 .drag-word")).map(el => el.dataset.word);
        const t7Biotic = Array.from(document.querySelectorAll("#t7-group2 .drag-word")).map(el => el.dataset.word);
        const t7Anthro = Array.from(document.querySelectorAll("#t7-group3 .drag-word")).map(el => el.dataset.word);

        if (t7Abiotic.length !== 3 || !t7Abiotic.every(v => ["рельеф", "солнечный свет", "влажность"].includes(v))) t7Correct = false;
        if (t7Biotic.length !== 3 || !t7Biotic.every(v => ["трава на лугу", "зайцы и лисы", "паук и муха"].includes(v))) t7Correct = false;
        if (t7Anthro.length !== 3 || !t7Anthro.every(v => ["загрязнённость водоёма", "вырубка леса", "загазованность воздуха"].includes(v))) t7Correct = false;
        if (t7Correct) totalScore += 1;

        // --- Задание 8 (Вычеркивание НЕ антропогенных: солёность водоёма, высокая влажность, уменьшение популяции зайцев из-за активности популяции волков) ---
        let t8Correct = true;
        const allItemsT8 = document.querySelectorAll(".strike-item-t8");
        const toStrikeT8 = ["солёность водоёма", "высокая влажность", "уменьшение популяции зайцев из-за активности популяции волков"];
        allItemsT8.forEach(item => {
            const name = item.dataset.word;
            const isCrossed = item.classList.contains("crossed-out");
            if (toStrikeT8.includes(name) && !isCrossed) t8Correct = false;
            if (!toStrikeT8.includes(name) && isCrossed) t8Correct = false;
        });
        if (t8Correct) totalScore += 1;

        // --- Задание 9 (Ручной ввод сред: водная, наземно-воздушная, почвенная, организменная) ---
        const t9Ans1 = document.getElementById("t9-ans1").value.trim().toLowerCase();
        const t9Ans2 = document.getElementById("t9-ans2").value.trim().toLowerCase();
        const t9Ans3 = document.getElementById("t9-ans3").value.trim().toLowerCase();
        const t9Ans4 = document.getElementById("t9-ans4").value.trim().toLowerCase();

        const t9Correct1 = (t9Ans1 === "одная" || t9Ans1 === "водная");
        const t9Correct2 = (t9Ans2 === "аземно-воздушная" || t9Ans2 === "наземно-воздушная" || t9Ans2 === "аземно воздушная" || t9Ans2 === "наземно воздушная");
        const t9Correct3 = (t9Ans3 === "очвенная" || t9Ans3 === "почвенная");
        const t9Correct4 = (t9Ans4 === "рганизованная" || t9Ans4 === "организменная" || t9Ans4 === "рганизационная" || t9Ans4 === "организменная");

        if (t9Correct1 && t9Correct2 && t9Correct3 && t9Correct4) totalScore += 1;

        // --- Задание 10 (Чекбоксы: Верные утверждения 1, 3, 4) ---
        const t10Answers = Array.from(document.querySelectorAll('#task10 input[type="checkbox"]:checked')).map(el => el.value);
        const t10CorrectAnswers = ["1", "3", "4"];
        if (t10Answers.length === 3 && t10Answers.every(val => t10CorrectAnswers.includes(val))) totalScore += 1;

        // --- ПРИМЕНЕНИЕ СТРОГОГО ШТРАФА (АНТИ-БРУТФОРС v2.0) ---
        if (window.currentPenalty && window.currentPenalty > 0) {
            totalScore = totalScore - window.currentPenalty;
            if (totalScore < 0) totalScore = 0; 
            studentClass = studentClass + ` (Попытка №${window.currentAttemptNumber}, Штраф: -${window.currentPenalty}б.)`;
        }

        // --- ВЫВОД РЕЗУЛЬТАТОВ НА ЭКРАН ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

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

        // Отправка данных на сервер через квантовый POST-шлюз
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL вашей новой формы для Сред Обитания:
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSd9Uocarqr1pqO6tcKMZjXMSLG_eBb46Axp-5KVY1X-SSFuPA/formResponse";
        const formData = new FormData();
        
        // Подставьте актуальные entry-номера, полученные через консоль F12
        formData.append("entry.1304008145", name);      
        formData.append("entry.141692342", className); 
        formData.append("entry.1422653100", score);     
        formData.append("entry.996594419", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
