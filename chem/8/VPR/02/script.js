/* ==========================================================================
   ЛОГИКА ЛАБОРАТОРИИ // ВАРИАНТ №2 // SCRIPT.JS
   ========================================================================== */

// 1. КОНФИГУРАЦИЯ СВЯЗИ С ГУГЛ-ФОРМОЙ (БЕЗ РЕЗЕРВНОГО ПОЛЯ)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfutDkLr1Oe56HX9rbI7N9F2KepXClijesuhotWeeHZTtvD-Q/formResponse";

const FORM_ENTRIES = {
    studentName: "entry.556141839", 
    studentClass: "entry.1340110711", 
    finalGrade: "entry.853208862",   
    rawScore: "entry.1094094320"     
};

// 2. МОДУЛЬ ПРОВЕРКИ И ВАЛИДАЦИИ ОТВЕТОВ С ЗАЩИТОЙ ОТ ПАДЕЖЕЙ
function checkTextAnswer(id, allowedStarts) {
    const element = document.getElementById(id);
    if (!element) return false;
    
    const val = element.value.trim().toLowerCase().replace(/\s+/g, '');
    if (!val) return false;

    return allowedStarts.some(start => {
        const target = start.toLowerCase().replace(/\s+/g, '');
        return val.startsWith(target) || val === target;
    });
}

function checkExactAnswer(id, expectedValue) {
    const element = document.getElementById(id);
    if (!element) return false;
    
    const val = element.value.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    const expected = expectedValue.toString().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    
    return val === expected;
}

// 3. НАВИГАЦИЯ, КВИЗЫ И ВСТРОЕННЫЕ ОКНА
document.addEventListener("DOMContentLoaded", () => {
    // Переключение главных экранов
    const btnStart = document.getElementById("btn-start");
    const screenAuth = document.getElementById("screen-auth");
    const screenQuiz = document.getElementById("screen-quiz");
    const studentNameInput = document.getElementById("student-name");
    const studentClassInput = document.getElementById("student-class");

    btnStart.addEventListener("click", () => {
        if (!studentNameInput.value.trim() || !studentClassInput.value.trim()) {
            alert("ДОСТУП ЗАБЛОКИРОВАН: Заполните ФИО и Класс для начала синтеза!");
            return;
        }
        screenAuth.classList.remove("active");
        screenQuiz.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Механика задания 1 (Выбор картинки)
    const imgCards = document.querySelectorAll(".task-img");
    const task1Hidden = document.getElementById("ans-task-1");
    imgCards.forEach(card => {
        card.addEventListener("click", () => {
            imgCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            task1Hidden.value = card.getAttribute("data-img");
        });
    });

    // Механика радио-плашек (Задание 3)
    const quizOptions = document.querySelectorAll(".lab-option:not(.checkbox-option)");
    const task3Hidden = document.getElementById("ans-task-3");
    quizOptions.forEach(option => {
        option.addEventListener("click", () => {
            const parent = option.parentElement;
            parent.querySelectorAll(".lab-option").forEach(s => s.classList.remove("selected"));
            option.classList.add("selected");
            task3Hidden.value = option.getAttribute("data-val");
        });
    });

    // Механика множественного выбора (Задание 19)
    const checkboxOptions = document.querySelectorAll(".checkbox-option");
    const task19Hidden = document.getElementById("ans-task-19");
    checkboxOptions.forEach(option => {
        option.addEventListener("click", () => {
            option.classList.toggle("selected");
            let values = [];
            document.querySelectorAll(".checkbox-option.selected").forEach(opt => {
                values.push(opt.getAttribute("data-check"));
            });
            values.sort((a, b) => a - b);
            task19Hidden.value = values.join("");
        });
    });

    // Встроенные окна [Br] и [Ba]
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
// 4. ВНУТРЕННИЙ КАЛЬКУЛЯТОР БАЛЛОВ ВАРИАНТА №2
function calculateVPRScore() {
    let score = 0;

    // Задание 1: Рис. 1 (Водород в баллонах)
    if (document.getElementById("ans-task-1").value === "1") score += 1;

    // Задание 2: Рис 2 (медь/цинк/латунь/бронза/сплав и Cu/Zn) и Рис 3 (кефир/молоко/вода и H2O)
    let t2_2 = checkTextAnswer("ans-2-t2-n", ["мед", "цин", "лат", "бро", "спл", "зол", "ник"]) && checkTextAnswer("ans-2-t2-f", ["cu", "zn", "ni", "au"]);
    let t2_3 = checkTextAnswer("ans-2-t3-n", ["кеф", "мол", "вод", "кисл"]) && checkTextAnswer("ans-2-t3-f", ["h2o", "c3h6o3"]);
    if (t2_2) score += 1;
    if (t2_3) score += 1;

    // Задание 3: Процесс 1 (Цинк + кислота)
    if (document.getElementById("ans-task-3").value === "1") score += 1;

    // Задание 4: Признак химической реакции (выделение газа / пузырьки / растворение цинка)
    if (checkTextAnswer("ans-task-4", ["выд", "пуз", "газ", "раств"])) score += 1;

    // Задание 5: Молярные массы газов (NH3 = 17, CO = 28, CO2 = 44)
    if (checkExactAnswer("ans-5-1", 17)) score += 1;
    if (checkExactAnswer("ans-5-2", 28)) score += 1;
    if (checkExactAnswer("ans-5-3", 44)) score += 1;

    // Задание 6: Номер газа с массой 28 г/моль (Угарный газ -> Номер 2)
    if (document.getElementById("ans-6-gas").value === "2") score += 1;

    // Задание 7: Элемент А (Кремний, 3, 4/IV, неметалл, SiO2) и В (Кальций, 4, 2/II, металл, CaO)
    let t7_a = checkTextAnswer("ans-7-a-name", ["крем"]) && checkExactAnswer("ans-7-a-period", 3) && checkTextAnswer("ans-7-a-group", ["iv", "4"]) && document.getElementById("ans-7-a-type").value === "неметалл" && checkTextAnswer("ans-7-a-oxide", ["sio2"]);
    let t7_b = checkTextAnswer("ans-7-b-name", ["каль"]) && checkExactAnswer("ans-7-b-period", 4) && checkTextAnswer("ans-7-b-group", ["ii", "2"]) && document.getElementById("ans-7-b-type").value === "металл" && checkTextAnswer("ans-7-b-oxide", ["cao"]);
    if (t7_a) score += 2;
    if (t7_b) score += 2;

    // Задание 8: Определение моря (Азовское)
    if (checkTextAnswer("ans-task-8", ["азов"])) score += 1;

    // Задание 9: Масса твёрдого остатка солей (250 * 0.026 = 6.5)
    if (checkExactAnswer("ans-task-9", 6.5)) score += 1;

    // Задание 10: Формулы перечня (Na, Cl2, NaCl, Mg(NO3)2, KOH, KNO3, Mg(OH)2)
    if (checkTextAnswer("ans-10-na", ["na"])) score += 1;
    if (checkTextAnswer("ans-10-cl", ["cl2"])) score += 1;
    if (checkTextAnswer("ans-10-nacl", ["nacl"])) score += 1;
    if (checkTextAnswer("ans-10-mgno32", ["mg(no3)2", "mgno32"])) score += 1;
    if (checkTextAnswer("ans-10-koh", ["koh"])) score += 1;
    if (checkTextAnswer("ans-10-kno3", ["kno3"])) score += 1;
    if (checkTextAnswer("ans-10-mgoh2", ["mg(oh)2", "mgoh2"])) score += 1;

    // Задание 11: Описание мягкого металла (Натрий / Na)
    if (checkTextAnswer("ans-task-11", ["натр", "na"])) score += 1;

    // Задание 12: Сложное вещество без щелочных металлов (Нитрат магния -> соль ИЛИ Гидроксид магния -> основание)
    const t12_name = document.getElementById("ans-12-name").value.trim().toLowerCase();
    const t12_class = document.getElementById("ans-12-class").value;
    if (t12_name.startsWith("нитр") && t12_name.includes("магн") && t12_class === "соль") score += 1;
    else if (t12_name.startsWith("гидр") && t12_name.includes("магн") && t12_class === "основание") score += 1;

    // Задание 13: Массовая доля кислорода (Mg(NO3)2=64.9, KOH=28.6, KNO3=47.5, Mg(OH)2=55.2)
    const t13_sel = document.getElementById("ans-13-select").value;
    if (t13_sel === "Mg(NO3)2" && checkExactAnswer("ans-13-val", 64.9)) score += 1;
    if (t13_sel === "KOH" && checkExactAnswer("ans-13-val", 28.6)) score += 1;
    if (t13_sel === "KNO3" && checkExactAnswer("ans-13-val", 47.5)) score += 1;
    if (t13_sel === "Mg(OH)2" && checkExactAnswer("ans-13-val", 55.2)) score += 1;

    // Задание 14: Масса 0.6 моль хлора (0.6 * 71 = 42.6)
    if (checkExactAnswer("ans-task-14", 42.6)) score += 1;

    // Задание 15: Уравнения реакций (1: Fe+S=FeS, 2: Ca(OH)2+2HNO3=Ca(NO3)2+2H2O)
    if (checkTextAnswer("ans-15-eq1", ["fe+s=fes"])) score += 1;
    if (checkTextAnswer("ans-15-eq2", ["ca(oh)2+2hno3=ca(no3)2+2h2o"])) score += 1;

    // Задание 16: Тип реакции (1 -> соединения, 2 -> обмена)
    const t16_num = document.getElementById("ans-16-eq-num").value;
    const t16_type = document.getElementById("ans-16-type").value;
    if (t16_num === "1" && t16_type === "соединения") score += 1;
    if (t16_num === "2" && t16_type === "обмена") score += 1;

    // Задание 17: Прибор 2 (магнит), метод (действие магнитом), обоснование (сера не притягивается / фильтрование для растворимых)
    const t17_img = document.getElementById("ans-17-img").value;
    const t17_meth = checkTextAnswer("ans-17-method", ["магн"]);
    const t17_text = checkTextAnswer("ans-17-text", ["раств", "тверд", "сух", "немагн", "притяг"]);
    if (t17_img === "2" && t17_meth && t17_text) score += 2;

    // Задание 18: Соответствие применения (А-4, Б-5, В-2, Г-3 -> "4523")
    const t18 = document.getElementById("ans-18-a").value === "4" && document.getElementById("ans-18-b").value === "5" && document.getElementById("ans-18-v").value === "2" && document.getElementById("ans-18-g").value === "3";
    if (t18) score += 2;

    // Задание 19: Верные суждения (2 и 3 -> "23")
    if (document.getElementById("ans-task-19").value === "23") score += 1;

    // Шкала перевода баллов ВПР-8 в пятибалльную оценку
    let grade = 2;
    if (score >= 10 && score <= 18) grade = 3;
    if (score >= 19 && score <= 26) grade = 4;
    if (score >= 27) grade = 5;

    return { score, grade };
}

// 5. МОДУЛЬ ОТПРАВКИ И ФИНАЛИЗАЦИИ
document.addEventListener("DOMContentLoaded", () => {
    const btnSubmit = document.getElementById("btn-submit");
    const screenQuiz = document.getElementById("screen-quiz");
    const screenResults = document.getElementById("screen-results");
    const studentNameInput = document.getElementById("student-name");
    const studentClassInput = document.getElementById("student-class");
    const finalGradeDisplay = document.getElementById("final-grade");
    const studentSummaryDisplay = document.getElementById("student-summary");

    btnSubmit.addEventListener("click", () => {
        if (!confirm("Вы уверены, что хотите завершить лабораторную работу и отправить результаты?")) return;

        const results = calculateVPRScore();
        finalGradeDisplay.textContent = results.grade;
        studentSummaryDisplay.innerHTML = `Ученик: <strong>${studentNameInput.value}</strong>, Класс: <strong>${studentClassInput.value}</strong>.<br>Всего набрано баллов: <strong>${results.score}</strong>.`;

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
        .then(() => { console.log("Отчет успешно катапультирован."); })
        .catch((err) => { console.error("Ошибка сети:", err); });

        screenQuiz.classList.remove("active");
        screenResults.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
