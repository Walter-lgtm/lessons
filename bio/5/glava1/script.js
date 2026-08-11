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
    // 2. МЕХАНИКА DRAG AND DROP (Задания 2 и 9)
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

                // Для Задания 2 (картинки): если в ячейке уже есть элемент, возвращаем его в пул
                if (zone.classList.contains("mini-zone") && content.children.length > 0) {
                    const existingElement = content.children[0];
                    sourceContainer.querySelector(".drag-words-container").appendChild(existingElement);
                }

                content.appendChild(draggedElement);
                draggedElement = null;
            });
        });
    }

    initDragAndDrop();
  // ==========================================
    // 3. МЕХАНИКА ВЫЧЕРКИВАНИЯ СЛОВ (Задание 8)
    // ==========================================
    const strikeButtons = document.querySelectorAll(".strike-btn");
    
    strikeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("strikethrough");
        });
    });

    // ==========================================
    // 4. МЕХАНИКА СОПОСТАВЛЕНИЯ ПАР (Задание 7)
    // ==========================================
    let selectedLeftItem = null;
    const leftItems = document.querySelectorAll("#left-col .match-item");
    const rightTargets = document.querySelectorAll("#right-col .match-target");

    leftItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("matched")) return;
            leftItems.forEach(i => i.classList.remove("selected"));
            selectedLeftItem = item;
            item.classList.add("selected");
        });
    });

    rightTargets.forEach(target => {
        target.addEventListener("click", () => {
            if (target.classList.contains("matched") || !selectedLeftItem) return;

            target.dataset.userAnswer = selectedLeftItem.dataset.id;
            target.classList.add("matched");
            selectedLeftItem.classList.add("matched");
            selectedLeftItem.classList.remove("selected");
            selectedLeftItem = null;
        });
    });

    // Отмена сопоставления по двойному клику
    rightTargets.forEach(target => {
        target.addEventListener("dblclick", () => {
            if (!target.classList.contains("matched")) return;

            const savedId = target.dataset.userAnswer;
            const relatedLeftItem = document.querySelector(`#left-col .match-item[data-id="${savedId}"]`);

            if (relatedLeftItem) {
                relatedLeftItem.classList.remove("matched");
            }
            target.classList.remove("matched");
            delete target.dataset.userAnswer;
        });
    });

    // ==========================================
    // 5. ПРОВЕРКА ОТВЕТОВ И ОТПРАВКА НА СЕРВЕР
    // ==========================================
    const submitBtn = document.getElementById("submit-quiz-btn");

    submitBtn.addEventListener("click", () => {
        let totalScore = 0;

        // --- Задание 1 (Списки) ---
        let t1Correct = true;
        document.querySelectorAll("#task1 .hl-select").forEach(select => {
            if (select.value !== select.dataset.answer) t1Correct = false;
        });
        if (t1Correct) totalScore += 1;

        // --- Задание 2 (Оборудование) ---
        let t2Correct = true;
        document.querySelectorAll("#task2 .group-zone").forEach(zone => {
            const placedWord = zone.querySelector(".drag-word");
            if (!placedWord || placedWord.dataset.word !== zone.dataset.answer) {
                t2Correct = false;
            }
        });
        if (t2Correct) totalScore += 1;

        // --- Задание 3 (Радио) ---
        const t3Selected = document.querySelector('input[name="q3"]:checked');
        if (t3Selected && t3Selected.value === "весы") totalScore += 1;

        // --- Задание 4 (Списки) ---
        let t4Correct = true;
        document.querySelectorAll("#task4 .hl-select").forEach(select => {
            if (select.value !== select.dataset.answer) t4Correct = false;
        });
        if (t4Correct) totalScore += 1;

        // --- Задание 5 (Радио) ---
        const t5Selected = document.querySelector('input[name="q5"]:checked');
        if (t5Selected && t5Selected.value === "Наблюдения") totalScore += 1;

        // --- Задание 6 (Чекбоксы) ---
        const t6Answers = Array.from(document.querySelectorAll('input[name="q6"]:checked')).map(el => el.value);
        const t6CorrectAnswers = ["Чучела животных", "Гербарий", "Постоянные препараты"];
        if (t6Answers.length === 3 && t6Answers.every(val => t6CorrectAnswers.includes(val))) totalScore += 1;

        // --- Задание 7 (Сопоставление) ---
        let t7Correct = true;
        let t7Count = 0;
        document.querySelectorAll("#right-col .match-target").forEach(target => {
            if (target.classList.contains("matched")) {
                t7Count++;
                if (target.dataset.id !== target.dataset.userAnswer) t7Correct = false;
            } else {
                t7Correct = false;
            }
        });
        if (t7Count === 4 && t7Correct) totalScore += 1;

        // --- Задание 8 (Вычеркивание) ---
        let t8Correct = true;
        document.querySelectorAll("#strike-t8 .strike-btn").forEach(btn => {
            const isStriked = btn.classList.contains("strikethrough");
            const shouldBeStriked = btn.dataset.wrong === "true";
            if (isStriked !== shouldBeStriked) t8Correct = false;
        });
        if (t8Correct) totalScore += 1;

        // --- Задание 9 (Колонки живое/фиксированное) ---
        let t9Correct = true;
        const t9Live = Array.from(document.querySelectorAll("#t9-group1 .drag-word")).map(el => el.dataset.word);
        const t9Fixed = Array.from(document.querySelectorAll("#t9-group2 .drag-word")).map(el => el.dataset.word);
        
        const t9LiveTrue = ["рыбки в аквариуме", "морковь на пришкольном участке", "сыроежки", "заяц в лесу"];
        const t9FixedTrue = ["цветок нарцисса в гербарии", "бабочка белянка в школьной коллекции", "скелет рыбы в пластиковом футляре", "чучело волка в краеведческом музее"];
        
        if (t9Live.length !== 4 || !t9Live.every(val => t9LiveTrue.includes(val))) t9Correct = false;
        if (t9Fixed.length !== 4 || !t9Fixed.every(val => t9FixedTrue.includes(val))) t9Correct = false;
        if (t9Correct) totalScore += 1;

        // --- Задание 10 (Радио) ---
        const t10Selected = document.querySelector('input[name="q10"]:checked');
        if (t10Selected && t10Selected.value === "в дневнике наблюдений") totalScore += 1;

        // --- Вывод результатов ---
        document.getElementById("quiz-container").classList.add("hidden");
        document.getElementById("res-name").textContent = studentName;
        document.getElementById("res-class").textContent = studentClass;
        document.getElementById("res-score").textContent = totalScore;

        let finalGrade = "2";
        if (totalScore >= 9) finalGrade = "5 (Отлично)";
        else if (totalScore >= 7) finalGrade = "4 (Хорошо)";
        else if (totalScore >= 5) finalGrade = "3 (Удовл.)";
        else finalGrade = "2 (Неудовл.)";
        
        document.getElementById("res-grade").textContent = finalGrade;
        document.getElementById("result-screen").classList.remove("hidden");

        sendToGoogleForm(studentName, studentClass, totalScore, finalGrade);
    });

    function sendToGoogleForm(name, className, score, finalGrade) {
        // Укажите URL опубликованной Google Формы в кавычках ниже
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfeQfRBZMpZoQHL76y2AWGEps1cfXv9jjjnLBjoyAyf2HXxtA/formResponse";
        const formData = new FormData();
        
        // Замените "entry.XXXXX" на реальные ID полей из вашей формы
        formData.append("entry.1549143272", name);      
        formData.append("entry.1903526463", className); 
        formData.append("entry.1614062159", score);     
        formData.append("entry.43753287", finalGrade); 

        fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        }).catch(err => console.log("Ошибка отправки данных: ", err));
    }
});
