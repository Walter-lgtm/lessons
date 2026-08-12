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
    // 2. МЕХАНИКА DRAG AND DROP (Задания 4 и 6)
    // ==========================================
    let draggedElement = null;

    function initDragAndDrop() {
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

                // Защита: карточка должна перетаскиваться строго внутри своего задания
                const sourceContainer = draggedElement.closest(".task-card");
                const targetContainer = zone.closest(".task-card");
                if (sourceContainer !== targetContainer) return;

                content.appendChild(draggedElement);
                draggedElement = null;
            });
        });
    }

    initDragAndDrop();
  // ==========================================
        // 3. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
        // ==========================================
        const submitBtn = document.getElementById("submit-quiz-btn");

        submitBtn.addEventListener("click", () => {
            let totalScore = 0;

            // --- Задание 1 (Радио) ---
            const t1Selected = document.querySelector('input[name="q1"]:checked');
            if (t1Selected && t1Selected.value === "Диаграмма") totalScore += 1;

            // --- Задание 2 (Радио) ---
            const t2Selected = document.querySelector('input[name="q2"]:checked');
            if (t2Selected && t2Selected.value === "Наблюдение") totalScore += 1;

            // --- Задание 3 (Радио) ---
            const t3Selected = document.querySelector('input[name="q3"]:checked');
            if (t3Selected && t3Selected.value === "Аристотель") totalScore += 1;

            // --- Задание 4 (Колонки качественное/количественное) ---
            let t4Correct = true;
            const t4Qual = Array.from(document.querySelectorAll("#t4-group1 .drag-word")).map(el => el.dataset.word);
            const t4Quan = Array.from(document.querySelectorAll("#t4-group2 .drag-word")).map(el => el.dataset.word);
            
            const t4QualTrue = ["высокое дерево", "красный цветок", "густой еловый лес", "на небольшой площади почвы растёт очень много елей", "пушистая лисица"];
            const t4QuanTrue = ["длина меха лисицы не менее 5 см", "высота дерева 3 м", "красных цветков на кусте розы 4"];
            
            if (t4Qual.length !== 5 || !t4Qual.every(val => t4QualTrue.includes(val))) t4Correct = false;
            if (t4Quan.length !== 3 || !t4Quan.every(val => t4QuanTrue.includes(val))) t4Correct = false;
            if (t4Correct) totalScore += 1;

            // --- Задание 5 (Радио) ---
            const t5Selected = document.querySelector('input[name="q5"]:checked');
            if (t5Selected && t5Selected.value === "Масса бурундука 70 кг") totalScore += 1;

            // --- Задание 6 (Колонки качественное/количественное) ---
            let t6Correct = true;
            const t6Qual = Array.from(document.querySelectorAll("#t6-group1 .drag-word")).map(el => el.dataset.word);
            const t6Quan = Array.from(document.querySelectorAll("#t6-group2 .drag-word")).map(el => el.dataset.word);
            
            const t6QualTrue = ["мелкие яблоки", "высокий стебель ромашки", "большая группа опят", "тяжёлый слон"];
            const t6QuanTrue = ["слон массой 2 т", "яблоки с маленьким диаметром 3 см", "стебель ромашки 1 м", "на одном пне растут опята в количестве 23"];
            
            if (t6Qual.length !== 4 || !t6Qual.every(val => t6QualTrue.includes(val))) t6Correct = false;
            if (t6Quan.length !== 4 || !t6Quan.every(val => t6QuanTrue.includes(val))) t6Correct = false;
            if (t6Correct) totalScore += 1;

            // --- Задание 7 (Список) ---
            const s7 = document.querySelector("#task7 .hl-select");
            if (s7 && s7.value === s7.dataset.answer) totalScore += 1;

            // --- Задание 8 (Список) ---
            const s8 = document.querySelector("#task8 .hl-select");
            if (s8 && s8.value === s8.dataset.answer) totalScore += 1;

            // --- Задание 9 (Текстовые инпуты с падежной защитой) ---
            const i1 = document.getElementById("t9-i1").value.trim().toLowerCase();
            const i2 = document.getElementById("t9-i2").value.trim().toLowerCase();
            const i3 = document.getElementById("t9-i3").value.trim().toLowerCase();
            
            // Защита от детских опечаток и окончаний (диаграмма, биологических/бумажных, результатов/рисунков)
            const i1Correct = i1.startsWith("диаграмм");
            const i2Correct = i2.startsWith("биолог") || i2.startsWith("бумаж") || i2.startsWith("науч");
            const i3Correct = i3.startsWith("результат") || i3.startsWith("рисун") || i3.startsWith("данн");
            
            if (i1Correct && i2Correct && i3Correct) totalScore += 1;

            // --- Вывод результатов ученику ---
            document.getElementById("quiz-container").classList.add("hidden");
            document.getElementById("res-name").textContent = studentName;
            document.getElementById("res-class").textContent = studentClass;
            document.getElementById("res-score").textContent = totalScore;

            // Расчет по пятибалльной шкале для 9-балльного теста
            let finalGrade = "2";
            if (totalScore >= 8) {
                finalGrade = "5 (Отлично)";
            } else if (totalScore >= 6) {
                finalGrade = "4 (Хорошо)";
            } else if (totalScore >= 4) {
                finalGrade = "3 (Удовл.)";
            } else {
                finalGrade = "2 (Неудовл.)";
            }
            document.getElementById("res-grade").textContent = finalGrade;
            document.getElementById("result-screen").classList.remove("hidden");

            // Передача сформированных данных на сервер Google
            sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
        });

        function sendToGoogleForm(name, className, score, finalGrade) {
            // Укажите URL опубликованной Google Формы в кавычках ниже
            const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScm1QZPIqZEdREVBHi5ZHYjURkYmPseFZ50NPEEpnsbqtWZug/formResponse";
            const formData = new FormData();
            
            // Замените "entry.XXXXX" на реальные ID полей из вашей формы
            formData.append("entry.1787210074", name);      
            formData.append("entry.422586516", className); 
            formData.append("entry.781286552", score);     
            formData.append("entry.2060907470", finalGrade); 

            fetch(formURL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            }).catch(err => console.log("Ошибка отправки данных: ", err));
        }
    });
