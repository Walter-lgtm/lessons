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
        initStrikeMechanics();
        initMatchMechanic();
    });

    // ==========================================
    // 2. БЕСКОНФЛИКТНАЯ МЕХАНИКА ВЫЧЕРКИВАНИЯ (Задание 2)
    // ==========================================
    function initStrikeMechanics() {
        document.querySelectorAll(".strike-item-t2").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                item.classList.toggle("crossed-out");
            });
        });
    }
  // ==========================================
    // 3. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 4)
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
    // 4. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Ручной ввод без подсказок: жидкое, твёрдое, газообразное) ---
        const t1Ans1 = document.getElementById("t1-ans1").value.trim().toLowerCase();
        const t1Ans2 = document.getElementById("t1-ans2").value.trim().toLowerCase();
        const t1Ans3 = document.getElementById("t1-ans3").value.trim().toLowerCase();

        const t1Correct1 = (t1Ans1 === "идкое" || t1Ans1 === "жидкое");
        const t1Correct2 = (t1Ans2 === "вёрдое" || t1Ans2 === "твердое" || t1Ans2 === "вёрдное" || t1Ans2 === "твердное");
        const t1Correct3 = (t1Ans3 === "азообразное" || t1Ans3 === "газообразное");

        if (t1Correct1 && t1Correct2 && t1Correct3) totalScore += 1;

        // --- Задание 2 (Вычеркивание пресноводных организмов) ---
        let t2Correct = true;
        const allItemsT2 = document.querySelectorAll(".strike-item-t2");
        const toStrikeT2 = ["ряску", "элодею", "большого прудовика", "щуку", "форель"];
        allItemsT2.forEach(item => {
            const name = item.dataset.word;
            const isCrossed = item.classList.contains("crossed-out");
            if (toStrikeT2.includes(name) && !isCrossed) t2Correct = false;
            if (!toStrikeT2.includes(name) && isCrossed) t2Correct = false;
        });
        if (t2Correct) totalScore += 1;

        // --- Задание 3 (Чекбоксы: Наутилус, Кальмар) ---
        const t3Answers = Array.from(document.querySelectorAll('#task3 input[type="checkbox"]:checked')).map(el => el.value);
        const t3CorrectAnswers = ["Наутилус", "Кальмар"];
        if (t3Answers.length === 2 && t3Answers.every(val => t3CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 4 (Сопоставление факторов, 4 пары) ---
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

        // --- Задание 5 (Два селекта: Солёные водоёмы, лужи) ---
        const t5Sel1 = document.getElementById("t5-select1").value;
        const t5Sel2 = document.getElementById("t5-select2").value;
        if (t5Sel1 === "Солёные водоёмы" && t5Sel2 === "лужи") totalScore += 1;

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

        // Отправка данных на сервер
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Замените URL на вашу новую форму для §16
        const formURL = "https://google.com";
        const formData = new FormData();
        
        formData.append("entry.426483672", name);      
        formData.append("entry.538540870", className); 
        formData.append("entry.815205528", score);     
        formData.append("entry.696485465", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
