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

        // Инициализация интерактивных механик только после входа
        initGlobalDragAndDrop();
    });

    // ==========================================
    // 2. УНИВЕРСАЛЬНАЯ МЕХАНИКА DRAG AND DROP (Задание 2)
    // ==========================================
    let draggedElement = null;

    function initGlobalDragAndDrop() {
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

                const sourceContainer = draggedElement.closest(".task-card");
                const targetContainer = zone.closest(".task-card");
                if (sourceContainer !== targetContainer) return;

                content.appendChild(draggedElement);
                draggedElement = null;
            });
        });
    }
   // ==========================================
    // 3. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Ручной ввод без подсказок: погода, климат, ветер) ---
        const t1Ans1 = document.getElementById("t1-ans1").value.trim().toLowerCase();
        const t1Ans2 = document.getElementById("t1-ans2").value.trim().toLowerCase();
        const t1Ans3 = document.getElementById("t1-ans3").value.trim().toLowerCase();

        const t1Correct1 = (t1Ans1 === "огода" || t1Ans1 === "погода");
        const t1Correct2 = (t1Ans2 === "лимат" || t1Ans2 === "климат");
        const t1Correct3 = (t1Ans3 === "етер" || t1Ans3 === "ветер");

        if (t1Correct1 && t1Correct2 && t1Correct3) totalScore += 1;

        // --- Задание 2 (Drag-and-Drop: 3 корзины, 12 плашек) ---
        let t2Correct = true;
        const t2Forest = Array.from(document.querySelectorAll("#t2-group1 .drag-word")).map(el => el.dataset.word);
        const t2Steppe = Array.from(document.querySelectorAll("#t2-group2 .drag-word")).map(el => el.dataset.word);
        const t2Desert = Array.from(document.querySelectorAll("#t2-group3 .drag-word")).map(el => el.dataset.word);

        if (t2Forest.length !== 4 || !t2Forest.every(v => ["земляника", "ель", "бурундук", "лисица"].includes(v))) t2Correct = false;
        if (t2Steppe.length !== 3 || !t2Steppe.every(v => ["суслик", "ковыль", "сайгак"].includes(v))) t2Correct = false;
        if (t2Desert.length !== 5 || !t2Desert.every(v => ["саксаул", "верблюд", "скорпион", "верблюжья колючка", "тушканчик"].includes(v))) t2Correct = false;
        if (t2Correct) totalScore += 1;

        // --- Задание 3 (4 селекта под графикой p17.jpeg) ---
        const t3Sel1 = document.getElementById("t3-select1").value;
        const t3Sel2 = document.getElementById("t3-select2").value;
        const t3Sel3 = document.getElementById("t3-select3").value;
        const t3Sel4 = document.getElementById("t3-select4").value;

        if (t3Sel1 === "Нормальная влажность" && 
            t3Sel2 === "Засушливость" && 
            t3Sel3 === "Влажность высокая" && 
            t3Sel4 === "Обитание в водоёме") {
            totalScore += 1;
        }

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

        // Расчет оценки по пятибалльной шкале (из 3 возможных баллов)
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

        // Отправка данных на сервер через квантовый шлюз
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Создайте новую форму под §17 и вставьте её URL-шлюз сюда:
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSc83ZuCkYpXIUfAcpWU3Nf5RWNoSqjgGWqEKhnJ3wl2GgIr5Q/formResponse";
        const formData = new FormData();
        
        // Обновите entry-номера через наш консольный экстрактор v3.0
        formData.append("entry.984161973", name);      
        formData.append("entry.2047513822", className); 
        formData.append("entry.1922102118", score);     
        formData.append("entry.1761234010", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
