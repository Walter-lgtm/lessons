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

        // Инициализация интерактивных механик только после входа
        initGlobalDragAndDrop();
        initStrikeMechanic();
        initMatchMechanic();
    });

    // ==========================================
    // 2. УНИВЕРСАЛЬНАЯ МЕХАНИКА DRAG AND DROP (Задания 5 и 10)
    // ==========================================
    let draggedElement = null;

    function initGlobalDragAndDrop() {
        const words = document.querySelectorAll(".drag-word:not(.strike-item)");
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
    // 3. МЕХАНИКА ВЫЧЕРКИВАНИЯ СЛОВ (Задание 6)
    // ==========================================
    function initStrikeMechanic() {
        const strikeItems = document.querySelectorAll(".strike-item");
        strikeItems.forEach(item => {
            item.addEventListener("click", () => {
                // Переключаем класс вычеркивания при каждом клике
                item.classList.toggle("crossed-out");
            });
        });
    }
  // ==========================================
    // 4. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задания 2 и 8)
    // ==========================================
    function initMatchMechanic() {
        // --- Настройка для Задания 2 ---
        let selectedLeftT2 = null;
        const leftItemsT2 = document.querySelectorAll(".t2-left");
        const rightTargetsT2 = document.querySelectorAll(".t2-right");

        leftItemsT2.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("matched")) return;
                leftItemsT2.forEach(i => i.classList.remove("selected"));
                selectedLeftT2 = item;
                item.classList.add("selected");
            });
        });

        rightTargetsT2.forEach(target => {
            target.addEventListener("click", () => {
                if (target.classList.contains("matched") || !selectedLeftT2) return;
                target.dataset.userAnswer = selectedLeftT2.dataset.id;
                target.classList.add("matched");
                selectedLeftT2.classList.add("matched");
                selectedLeftT2.classList.remove("selected");
                selectedLeftT2 = null;
            });
        });

        // --- Настройка для Задания 8 ---
        let selectedLeftT8 = null;
        const leftItemsT8 = document.querySelectorAll(".t8-left");
        const rightTargetsT8 = document.querySelectorAll(".t8-right");

        leftItemsT8.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("matched")) return;
                leftItemsT8.forEach(i => i.classList.remove("selected"));
                selectedLeftT8 = item;
                item.classList.add("selected");
            });
        });

        rightTargetsT8.forEach(target => {
            target.addEventListener("click", () => {
                if (target.classList.contains("matched") || !selectedLeftT8) return;
                target.dataset.userAnswer = selectedLeftT8.dataset.id;
                target.classList.add("matched");
                selectedLeftT8.classList.add("matched");
                selectedLeftT8.classList.remove("selected");
                selectedLeftT8 = null;
            });
        });
    }

    // ==========================================
    // 5. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (3 селекта: клеточная оболочка, пластиды, автотрофами) ---
        const t1Sel1 = document.getElementById("t1-select1").value;
        const t1Sel2 = document.getElementById("t1-select2").value;
        const t1Sel3 = document.getElementById("t1-select3").value;
        if (t1Sel1 === "клеточная оболочка" && t1Sel2 === "пластиды" && t1Sel3 === "автотрофами") totalScore += 1;

        // --- Задание 2 (Сопоставление Т2, 5 пар) ---
        let t2Correct = true;
        let t2Count = 0;
        document.querySelectorAll(".t2-right").forEach(target => {
            if (target.classList.contains("matched")) {
                t2Count++;
                if (target.dataset.id !== target.dataset.userAnswer) t2Correct = false;
            } else {
                t2Correct = false;
            }
        });
        if (t2Count === 5 && t2Correct) totalScore += 1;

        // --- Задание 3 (Чекбоксы условий фотосинтеза: Вода, Свет, Хлорофилл, Углекислый газ) ---
        const t3Answers = Array.from(document.querySelectorAll('#task3 input[type="checkbox"]:checked')).map(el => el.value);
        const t3CorrectAnswers = ["Вода", "Свет", "Хлорофилл", "Углекислый газ"];
        if (t3Answers.length === 4 && t3Answers.every(val => t3CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 4 (Чекбоксы групп животных: Беспозвоночные, Позвоночные) ---
        const t4Answers = Array.from(document.querySelectorAll('#task4 input[type="checkbox"]:checked')).map(el => el.value);
        const t4CorrectAnswers = ["Беспозвоночные", "Позвоночные"];
        if (t4Answers.length === 2 && t4Answers.every(val => t4CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 5 (Drag-and-Drop животных, 3 колонки по 4 плашки) ---
        let t5Correct = true;
        const t5Domestic = Array.from(document.querySelectorAll("#t5-group1 .drag-word")).map(el => el.dataset.word);
        const t5Commercial = Array.from(document.querySelectorAll("#t5-group2 .drag-word")).map(el => el.dataset.word);
        const t5Dangerous = Array.from(document.querySelectorAll("#t5-group3 .drag-word")).map(el => el.dataset.word);

        if (t5Domestic.length !== 4 || !t5Domestic.every(v => ["лошади", "овцы", "коровы", "свиньи"].includes(v))) t5Correct = false;
        if (t5Commercial.length !== 4 || !t5Commercial.every(v => ["креветки", "рыба", "зайцы", "дикие утки"].includes(v))) t5Correct = false;
        if (t5Dangerous.length !== 4 || !t5Dangerous.every(v => ["тарантул (паук)", "львы", "скорпионы", "змеи"].includes(v))) t5Correct = false;
        if (t5Correct) totalScore += 1;

        // --- Задание 6 (Вычеркивание: должны быть вычеркнуты только 5 безусловно съедобных грибов) ---
        let t6Correct = true;
        const allMushrooms = document.querySelectorAll(".strike-item");
        const correctStripped = ["маслята", "белые грибы", "маховики", "подосиновики", "подберёзовики"];
        
        allMushrooms.forEach(item => {
            const name = item.dataset.word;
            const isCrossed = item.classList.contains("crossed-out");
            if (correctStripped.includes(name) && !isCrossed) t6Correct = false; // Должен быть вычеркнут, но не вычеркнут
            if (!correctStripped.includes(name) && isCrossed) t6Correct = false; // Не должен быть вычеркнут, но вычеркнут
        });
        if (t6Correct) totalScore += 1;

        // --- Задание 7 (Радио сходства: По способу питания (гетеротрофы) - значение "2") ---
        const t7Selected = document.querySelector('input[name="q7"]:checked');
        if (t7Selected && t7Selected.value === "2") totalScore += 1;

        // --- Задание 8 (Сопоставление Т8, 4 пары) ---
        let t8Correct = true;
        let t8Count = 0;
        document.querySelectorAll(".t8-right").forEach(target => {
            if (target.classList.contains("matched")) {
                t8Count++;
                if (target.dataset.id !== target.dataset.userAnswer) t8Correct = false;
            } else {
                t8Correct = false;
            }
        });
        if (t8Count === 4 && t8Correct) totalScore += 1;

        // --- Задание 9 (Радио южного растения: Хлопчатник) ---
        const t9Selected = document.querySelector('input[name="q9"]:checked');
        if (t9Selected && t9Selected.value === "Хлопчатник") totalScore += 1;

        // --- Задание 10 (Drag-and-Drop растений, 4 колонки по 3 плашки) ---
        let t10Correct = true;
        const t10Agri = Array.from(document.querySelectorAll("#t10-group1 .drag-word")).map(el => el.dataset.word);
        const t10Toxic = Array.from(document.querySelectorAll("#t10-group2 .drag-word")).map(el => el.dataset.word);
        const t10Red = Array.from(document.querySelectorAll("#t10-group3 .drag-word")).map(el => el.dataset.word);
        const t10Medical = Array.from(document.querySelectorAll("#t10-group4 .drag-word")).map(el => el.dataset.word);

        if (t10Agri.length !== 3 || !t10Agri.every(v => ["свёкла", "морковь", "картофель"].includes(v))) t10Correct = false;
        if (t10Toxic.length !== 3 || !t10Toxic.every(v => ["дурман", "конопля", "белладонна"].includes(v))) t10Correct = false;
        if (t10Red.length !== 3 || !t10Red.every(v => ["венерин башмачок", "лотос", "подснежник"].includes(v))) t10Correct = false;
        if (t10Medical.length !== 3 || !t10Medical.every(v => ["крапива", "чистотел", "подорожник"].includes(v))) t10Correct = false;
        if (t10Correct) totalScore += 1;

        // --- Вывод результатов на терминал ---
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

        // Отправка данных на бэкенд Google
        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfM8ShuP4pFAEYEVyBOk-GQbcgOeMO7DynLeEbjpMjPmT3XBA/formResponse";
        const formData = new FormData();
        
        formData.append("entry.885619680", name);      // Примените экстрактор v2.0 для получения точных ID
        formData.append("entry.627974845", className); 
        formData.append("entry.1767507085", score);     
        formData.append("entry.1992355461", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
