/* ==========================================================================
   ЛОГИКА ХИМИЧЕСКОЙ ЛАБОРАТОРИИ // ДОМАШНЕЕ ЗАДАНИЕ 9 КЛАСС // SCRIPT.JS
   ========================================================================== */

// 1. КОНФИГУРАЦИЯ СВЯЗИ С ГУГЛ-ФОРМОЙ (БЕЗ РЕЗЕРВНЫХ ПОЛЕЙ)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeDmWVI4s0D_DjIE0sNNhg_unBpIhcVHjMl1ONJtdlHaJR87Q/formResponse";

const FORM_ENTRIES = {
    studentName: "entry.995210903", 
    studentClass: "entry.710469293", 
    finalGrade: "entry.923911174",   
    rawScore: "entry.1379428636"     
};

// 2. ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ТОЧНОЙ ВЕРИФИКАЦИИ ЧИСЕЛ И СТРОК
function checkExactAnswer(id, expectedValue) {
    const element = document.getElementById(id);
    if (!element) return false;
    const val = element.value.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    const expected = expectedValue.toString().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    return val === expected;
}

// 3. КАЛЬКУЛЯТОР БАЛЛОВ ПО ХИМИЧЕСКИМ КРИТЕРИЯМ ДОМАШНЕЙ РАБОТЫ
function calculateHomeworkScore() {
    let score = 0;

    // Задание 1: Азот (X=2, Y=14)
    if (checkExactAnswer("ans-1-x", 2) && checkExactAnswer("ans-1-y", 14)) score += 1;

    // Задание 2: Хлор (X=7, Y=20)
    if (checkExactAnswer("ans-2-x", 7) && checkExactAnswer("ans-2-y", 20)) score += 1;

    // Задание 3: Углерод (X=2, Y=12)
    if (checkExactAnswer("ans-3-x", 2) && checkExactAnswer("ans-3-y", 12)) score += 1;

    // Задание 4: Возрастание кислотных свойств (Al -> Si -> S) -> "132"
    if (checkExactAnswer("ans-task-4", 132)) score += 1;

    // Задание 5: Увеличение радиусов атомов (C -> Li -> Na) -> "132"
    if (checkExactAnswer("ans-task-5", 132)) score += 1;

    // Задание 6: Уменьшение радиусов атомов (Si -> P -> F) -> "132"
    if (checkExactAnswer("ans-task-6", 132)) score += 1;

    // Перевод первичных баллов в пятибалльную оценку (Строгий критерий: "5" только за 6 из 6)
    let grade = 2;
    if (score === 3) grade = 3;
    if (score === 4 || score === 5) grade = 4; // Теперь 4 и 5 баллов — это твёрдая "четвёрка"
    if (score === 6) grade = 5;                 // "Пятёрка" выдаётся строго за идеальный синтез

    return { score, grade };
}

// 4. ИНИЦИАЛИЗАЦИЯ И СЕТЕВОЙ ИНТЕРФЕЙСНЫЙ МОДУЛЬ
document.addEventListener("DOMContentLoaded", () => {
    const btnStart = document.getElementById("btn-start");
    const btnSubmit = document.getElementById("btn-submit");
    const screenAuth = document.getElementById("screen-auth");
    const screenQuiz = document.getElementById("screen-quiz");
    const screenResults = document.getElementById("screen-results");
    
    const studentNameInput = document.getElementById("student-name");
    const studentClassInput = document.getElementById("student-class");
    const finalGradeDisplay = document.getElementById("final-grade");
    const studentSummaryDisplay = document.getElementById("student-summary");

    // Вход в лабораторию и запуск теста
    btnStart.addEventListener("click", () => {
        if (!studentNameInput.value.trim() || !studentClassInput.value.trim()) {
            alert("ДОСТУП ЗАБЛОКИРОВАН: Заполните ФИО и Класс для начала выполнения работы!");
            return;
        }
        screenAuth.classList.remove("active");
        screenQuiz.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Обработчик завершения домашнего задания и no-cors отправки
    btnSubmit.addEventListener("click", () => {
        if (!confirm("Вы уверены, что хотите завершить работу и отправить отчёт?")) return;

        const results = calculateHomeworkScore();
        finalGradeDisplay.textContent = results.grade;
        studentSummaryDisplay.innerHTML = `Ученик: <strong>${studentNameInput.value}</strong>, Класс: <strong>${studentClassInput.value}</strong>.<br>Успешно набрано баллов: <strong>${results.score}</strong> из 6.`;

        // Формирование пакета данных для Google Forms
        const formData = new FormData();
        formData.append(FORM_ENTRIES.studentName, studentNameInput.value);
        formData.append(FORM_ENTRIES.studentClass, studentClassInput.value);
        formData.append(FORM_ENTRIES.finalGrade, results.grade);
        formData.append(FORM_ENTRIES.rawScore, results.score);

       localStorage.setItem("chemistry_hw_9_submitted", "true");
       localStorage.setItem("chemistry_hw_9_score", results.score);
       localStorage.setItem("chemistry_hw_9_grade", results.grade); 
       // Скрытая отправка запроса
        fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        })
        .then(() => { console.log("Отчёт по строению атома успешно доставлен на сервер."); })
        .catch((err) => { console.error("Сбой при передаче отчёта:", err); });

        // Переключение на экран итогов
        screenQuiz.classList.remove("active");
        screenResults.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Модуль управления встроенными окнами справочников [Br] и [Sc]
    const btnOpenPshe = document.getElementById("btn-open-pshe");
    const btnOpenRastvor = document.getElementById("btn-open-rastvor");
    const btnClosePshe = document.getElementById("btn-close-pshe");
    const btnCloseRastvor = document.getElementById("btn-close-rastvor");
    const modalPshe = document.getElementById("modal-pshe");
    const modalRastvor = document.getElementById("modal-rastvor");

    if (btnOpenPshe) btnOpenPshe.addEventListener("click", () => { modalPshe.classList.add("active"); document.body.style.overflow = "hidden"; });
    if (btnClosePshe) btnClosePshe.addEventListener("click", () => { modalPshe.classList.remove("active"); document.body.style.overflow = ""; });
    if (btnOpenRastvor) btnOpenRastvor.addEventListener("click", () => { modalRastvor.classList.add("active"); document.body.style.overflow = "hidden"; });
    if (btnCloseRastvor) btnCloseRastvor.addEventListener("click", () => { modalRastvor.classList.remove("active"); document.body.style.overflow = ""; });
});
// 5. ПРОВЕРКА ПОВТОРНОГО ВХОДА (АНТИ-СПАМ СИСТЕМА)
document.addEventListener("DOMContentLoaded", () => {
    const hasSubmitted = localStorage.getItem("chemistry_hw_9_submitted");
    
    if (hasSubmitted) {
        // Если флаг в памяти смартфона найден — мгновенно блокируем тест
        const screenAuth = document.getElementById("screen-auth");
        const screenQuiz = document.getElementById("screen-quiz");
        const screenResults = document.getElementById("screen-results");
        const finalGradeDisplay = document.getElementById("final-grade");
        const studentSummaryDisplay = document.getElementById("student-summary");

        const savedScore = localStorage.getItem("chemistry_hw_9_score") || "0";
        const savedGrade = localStorage.getItem("chemistry_hw_9_grade") || "2";

        if (screenAuth) screenAuth.classList.remove("active");
        if (screenQuiz) screenQuiz.classList.remove("active");
        if (screenResults) {
            screenResults.classList.add("active");
            finalGradeDisplay.textContent = savedGrade;
            studentSummaryDisplay.innerHTML = `<span style="color: var(--hazard-orange);">[ ДОСТУП ПРЕКРАЩЕН ]</span><br>Вы уже отправляли лабораторный отчёт ранее. Набрано баллов: <strong>${savedScore}</strong> из 6.`;
        }
    }
});
