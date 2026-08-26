/* ==========================================================================
   ЛОГИКА ЛАБОРАТОРИИ // ОГЭ ХИМИЯ // SCRIPT.JS
   ========================================================================== */

// 1. КОНФИГУРАЦИЯ СВЯЗИ С ГУГЛ-ФОРМОЙ (СТРОГО БЕЗ РЕЗЕРВНЫХ ПОЛЕЙ)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfCY1iZD74e9BD6IGC0XzxskOWpSKmctOpNEC6tqygJaCxZAQ/formResponse";

const FORM_ENTRIES = {
    studentName: "entry.412588716", 
    studentClass: "entry.1088983407", 
    finalGrade: "entry.700280698",   
    rawScore: "entry.1154865292"     
};

// 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ВАЛИДАЦИИ ЧИСЕЛ И СТРОК
function checkExactAnswer(id, expectedValue) {
    const element = document.getElementById(id);
    if (!element) return false;
    const val = element.value.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    const expected = expectedValue.toString().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    return val === expected;
}

function getGridValue(idA, idB, idV) {
    const elA = document.getElementById(idA);
    const elB = document.getElementById(idB);
    const elV = document.getElementById(idV);
    if (!elA || !elB || !elV) return "";
    return `${elA.value.trim()}${elB.value.trim()}${elV.value.trim()}`;
}

// 3. НАВИГАЦИЯ, МНОЖЕСТВЕННЫЙ ТАЧ-ВЫБОР И МОДАЛЬНЫЕ ОКНА
document.addEventListener("DOMContentLoaded", () => {
    // Авторизация и переход к тесту ОГЭ
    const btnStart = document.getElementById("btn-start");
    const screenAuth = document.getElementById("screen-auth");
    const screenQuiz = document.getElementById("screen-quiz");
    const studentNameInput = document.getElementById("student-name");
    const studentClassInput = document.getElementById("student-class");

    btnStart.addEventListener("click", () => {
        if (!studentNameInput.value.trim() || !studentClassInput.value.trim()) {
            alert("ДОСТУП ЗАБЛОКИРОВАН: Заполните ФИО и Класс для начала симуляции ОГЭ!");
            return;
        }
        screenAuth.classList.remove("active");
        screenQuiz.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Умная логика чекбоксов (разделение по data-id заданий)
    const checkboxOptions = document.querySelectorAll(".checkbox-option");
    checkboxOptions.forEach(option => {
        option.addEventListener("click", () => {
            option.classList.toggle("selected");
            
            const taskId = option.getAttribute("data-id");
            const hiddenInput = document.getElementById(`ans-task-${taskId.replace("t", "")}`);
            
            if (hiddenInput) {
                // Собираем выбранные элементы только для конкретного задания
                const selectedOptions = document.querySelectorAll(`.checkbox-option.selected[data-id="${taskId}"]`);
                let values = [];
                selectedOptions.forEach(opt => {
                    values.push(opt.getAttribute("data-check"));
                });
                // Сортируем цифры для стандартизации проверки (например, "15")
                values.sort((a, b) => a - b);
                hiddenInput.value = values.join("");
            }
        });
    });

    // Справочные неоновые окна [Br] и [Ba]
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
// 4. ВЫЧИСЛЕНИЕ ПЕРВИЧНЫХ БАЛЛОВ ПО СТАНДАРТАМ ФИПИ ОГЭ
function checkTwoFormulaScore(userAns, correctAns) {
    if (userAns === correctAns) return 2;
    if (userAns.length !== correctAns.length) {
        // Проверка на 1 ошибку при несовпадении длин (например, введено 2 цифры вместо 3)
        let diffCount = 0;
        let maxLen = Math.max(userAns.length, correctAns.length);
        for (let i = 0; i < maxLen; i++) {
            if (userAns[i] !== correctAns[i]) diffCount++;
        }
        return diffCount === 1 ? 1 : 0;
    }
    // Посимвольное сравнение строк одинаковой длины
    let errors = 0;
    for (let i = 0; i < correctAns.length; i++) {
        if (userAns[i] !== correctAns[i]) errors++;
    }
    if (errors === 0) return 2;
    if (errors === 1) return 1;
    return 0;
}

function calculateOGEScore() {
    let primaryScore = 0;

    // Задание 1 (2 балла): Ответ "15" (Азот как простое вещество)
    const t1 = document.getElementById("ans-task-1").value;
    primaryScore += checkTwoFormulaScore(t1, "15");

    // Задание 2 (1 балл): Период X = 2, Заряд ядра Y = 6
    if (checkExactAnswer("ans-2-x", 2) && checkExactAnswer("ans-2-y", 6)) primaryScore += 1;

    // Задание 3 (1 балл): Порядок "123" (увеличение восстановительных свойств)
    if (checkExactAnswer("ans-task-3", 123)) primaryScore += 1;

    // Задание 4 (2 балла): Степень окисления хлора. Ответ "125" (NH4Cl=-1, Ca(ClO)2=+1, Ba(ClO3)2=+5)
    const t4 = getGridValue("ans-4-a", "ans-4-b", "ans-4-v");
    primaryScore += checkTwoFormulaScore(t4, "125");

    // Задание 5 (1 балл): Ответ "25" (CaO и NaF)
    const t5 = document.getElementById("ans-task-5").value;
    if (t5 === "25") primaryScore += 1;

    // Задание 6 (2 балла): Ответ "25" (Алюминий и Кремний: 3 слоя, радиус меньше натрия)
    const t6 = document.getElementById("ans-task-6").value;
    primaryScore += checkTwoFormulaScore(t6, "25");

    // Задание 7 (1 балл): Соль = 3, Амф. оксид = 5
    if (checkExactAnswer("ans-7-salt", 3) && checkExactAnswer("ans-7-oxide", 5)) primaryScore += 1;

    // Задание 8 (1 балл): Ответ "13" (С серой реагируют HNO3 и Al)
    const t8 = document.getElementById("ans-task-8").value;
    if (t8 === "13") primaryScore += 1;

    // Задание 9 (2 балла): Ответ "354" (Взаимодействие амфотерных соединений со щелочами)
    const t9 = getGridValue("ans-9-a", "ans-9-b", "ans-9-v");
    primaryScore += checkTwoFormulaScore(t9, "354");

    // Задание 10 (2 балла): Ответ "123" (Реагенты для Fe2O3, H2SO4, P)
    const t10 = getGridValue("ans-10-a", "ans-10-b", "ans-10-v");
    primaryScore += checkTwoFormulaScore(t10, "123");

    // Задание 11 (1 балл): Ответ "15" (Реакции обмена)
    const t11 = document.getElementById("ans-task-11").value;
    if (t11 === "15") primaryScore += 1;

    // Задание 12 (2 балла): Ответ "312" (Признаки реакций Cu, Ba, Fe)
    const t12 = getGridValue("ans-12-a", "ans-12-b", "ans-12-v");
    primaryScore += checkTwoFormulaScore(t12, "312");

    // Задание 13 (1 балл): Ответ "12" (Диссоциация FeCl3)
    const t13 = document.getElementById("ans-task-13").value;
    if (t13 === "12") primaryScore += 1;

    // Задание 14 (1 балл): Ответ "14" (Исходные вещества для H+ + OH- = H2O)
    const t14 = document.getElementById("ans-task-14").value;
    if (t14 === "14") primaryScore += 1;

    // Задание 15 (2 балла): Ответ "122" (Окисление/Восстановление)
    const t15 = getGridValue("ans-15-a", "ans-15-b", "ans-15-v");
    primaryScore += checkTwoFormulaScore(t15, "122");

    // Задание 16 (1 балл): Ответ "24" (Верные суждения по технике безопасности)
    const t16 = document.getElementById("ans-task-16").value;
    if (t16 === "24") primaryScore += 1;

    // Задание 17 (2 балла): Ответ "213" (Различение растворов реактивами)
    const t17 = getGridValue("ans-17-a", "ans-17-b", "ans-17-v");
    primaryScore += checkTwoFormulaScore(t17, "213");

    // Задание 18 (1 балл): Массовая доля магния в MgHPO4. M(MgHPO4)=24+1+31+64=120. w(Mg)=24/120=20%
    if (checkExactAnswer("ans-task-18", 20)) primaryScore += 1;

    // Задание 19 (1 балл): Масса таблетки гидрофосфата. Норма 300 мг. В 2 таблетках должно быть 300 мг магния. 
    // В одной таблетке — 150 мг магния. m(MgHPO4) = 150 / 0.2 = 750 мг
    if (checkExactAnswer("ans-task-19", 750)) primaryScore += 1;

    // ШКАЛА ПЕРЕВОДА ПЕРВИЧНЫХ БАЛЛОВ ОГЭ ПО ХИМИИ В ОЦЕНКУ (ДЛЯ ПЕРВОЙ ЧАСТИ)
    // Максимум за 1 часть — 28 баллов. Официальные пороги: 0-9 (оценка 2), 10-20 (оценка 3), 21-30 (оценка 4), 31+ (оценка 5).
    // Так как пишется только 1 часть (макс 28 б), порог "пятерки" физически недостижим без 2 части, 
    // но мы адаптируем шкалу под срез знаний первой части для мотивации учеников.
    let grade = 2;
    if (primaryScore >= 8 && primaryScore <= 15) grade = 3;
    if (primaryScore >= 16 && primaryScore <= 23) grade = 4;
    if (primaryScore >= 24) grade = 5;

    return { score: primaryScore, grade: grade };
}

// 5. МОДУЛЬ СЕТЕВОЙ ОТПРАВКИ И БЛОКИРОВКИ ИНТЕРФЕЙСА
document.addEventListener("DOMContentLoaded", () => {
    const btnSubmit = document.getElementById("btn-submit");
    const screenQuiz = document.getElementById("screen-quiz");
    const screenResults = document.getElementById("screen-results");
    const studentNameInput = document.getElementById("student-name");
    const studentClassInput = document.getElementById("student-class");
    const finalGradeDisplay = document.getElementById("final-grade");
    const studentSummaryDisplay = document.getElementById("student-summary");

    btnSubmit.addEventListener("click", () => {
        if (!confirm("Вы уверены, что хотите завершить симуляцию ОГЭ и отправить бланк ответов?")) return;

        const results = calculateOGEScore();
        finalGradeDisplay.textContent = results.grade;
        studentSummaryDisplay.innerHTML = `Ученик: <strong>${studentNameInput.value}</strong>, Класс: <strong>${studentClassInput.value}</strong>.<br>Первичные баллы ОГЭ (Часть 1): <strong>${results.score}</strong> из 28.`;

        const formData = new FormData();
        formData.append(FORM_ENTRIES.studentName, studentNameInput.value);
        formData.append(FORM_ENTRIES.studentClass, studentClassInput.value);
        formData.append(FORM_ENTRIES.finalGrade, results.grade);
        formData.append(FORM_ENTRIES.rawScore, results.score);

        fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        })
        .then(() => { console.log("Бланк ОГЭ успешно отправлен в базу данных."); })
        .catch((err) => { console.error("Ошибка передачи данных бланка:", err); });

        screenQuiz.classList.remove("active");
        screenResults.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
