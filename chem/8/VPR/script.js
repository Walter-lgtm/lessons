/* ==========================================================================
   ЛОГИКА ЛАБОРАТОРИИ // ХИМИЯ ВПР-8 // СCRIPT.JS
   ========================================================================== */

// 1. КОНФИГУРАЦИЯ СВЯЗИ С ГУГЛ-ФОРМОЙ (ЗАМЕНИТЕ НА СВОИ ENTRY И URL)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdhQGT0BN6KKn9Rgm-rGfJ3GlDo3TJ1IZiiK8Wvg3Vf0c8EbA/formResponse";

const FORM_ENTRIES = {
    studentName: "entry.207400458", // ID поля ФИО
    studentClass: "entry.1878450478", // ID поля Класс
    finalGrade: "entry.1302914323",   // ID поля Финальная оценка
    rawScore: "entry.472613353"     // ID поля Набранные баллы
};

// 2. ИНИЦИАЛИЗАЦИЯ И НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
document.addEventListener("DOMContentLoaded", () => {
    const btnStart = document.getElementById("btn-start");
    const screenAuth = document.getElementById("screen-auth");
    const screenQuiz = document.getElementById("screen-quiz");
    
    const studentNameInput = document.getElementById("student-name");
    const studentClassInput = document.getElementById("student-class");

    // Обработчик входа в лабораторию
    btnStart.addEventListener("click", () => {
        const name = studentNameInput.value.trim();
        const className = studentClassInput.value.trim();

        // Простая валидация заполнения авторизации
        if (!name || !className) {
            alert("ДОСТУП ЗАБЛОКИРОВАН: Заполните ФИО и Класс для начала синтеза!");
            return;
        }

        // Плавный переход на экран с заданиями
        screenAuth.classList.remove("active");
        screenQuiz.classList.add("active");
        
        // Автоматический скролл наверх для удобства на Redmi
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
// 3. ИНТЕРАКТИВНЫЕ МЕХАНИКИ ВВОДА (ОПТИМИЗАЦИЯ ПОД REDMI И ТАЧ-ИНТЕРФЕЙСЫ)
document.addEventListener("DOMContentLoaded", () => {
    
    // МЕХАНИКА ЗАДАНИЯ 1: Выбор индивидуального вещества по клику на картинку
    const imgCards = document.querySelectorAll(".task-img");
    const task1HiddenInput = document.getElementById("ans-task-1");

    imgCards.forEach(card => {
        card.addEventListener("click", () => {
            // Снимаем выделение со всех картинок в блоке
            imgCards.forEach(c => c.classList.remove("selected"));
            
            // Выделяем текущую
            card.classList.add("selected");
            
            // Записываем значение в скрытый инпут
            const selectedValue = card.getAttribute("data-img");
            task1HiddenInput.value = selectedValue;
        });
    });

    // МЕХАНИКА ЗАДАНИЯ 3: Одиночный выбор (Радио-плашки)
    const quizOptions = document.querySelectorAll(".lab-option:not(.checkbox-option)");
    const task3HiddenInput = document.getElementById("ans-task-3");

    quizOptions.forEach(option => {
        option.addEventListener("click", () => {
            // Ищем все соседние опции в этом же блоке (родительском контейнере)
            const parent = option.parentElement;
            const siblings = parent.querySelectorAll(".lab-option");
            
            siblings.forEach(s => s.classList.remove("selected"));
            option.classList.add("selected");

            // Ищем скрытый инпут внутри этой карточки задания для фиксации ответа
            const hiddenInput = parent.querySelector('input[type="hidden"]');
            if (hiddenInput) {
                hiddenInput.value = option.getAttribute("data-val");
            } else if (parent.id === "screen-quiz" || option.closest(".task-card")) {
                // Если инпут лежит в корне задания 3
                task3HiddenInput.value = option.getAttribute("data-val");
            }
        });
    });
});
// 4. МЕХАНИКА МНОЖЕСТВЕННОГО ВЫБОРА (ЗАДАНИЕ 19)
document.addEventListener("DOMContentLoaded", () => {
    const checkboxOptions = document.querySelectorAll(".checkbox-option");
    const task19HiddenInput = document.getElementById("ans-task-19");

    checkboxOptions.forEach(option => {
        option.addEventListener("click", () => {
            // Переключаем класс выделения (выбрано / не выбрано)
            option.classList.toggle("selected");

            // Собираем все выбранные цифры в массив
            const parent = option.closest(".task-card");
            const selectedOptions = parent.querySelectorAll(".checkbox-option.selected");
            
            let values = [];
            selectedOptions.forEach(opt => {
                values.push(opt.getAttribute("data-check"));
            });

            // Сортируем цифры по возрастанию, чтобы получить строку вида "34"
            values.sort((a, b) => a - b);
            
            // Записываем результат в скрытое поле
            task19HiddenInput.value = values.join("");
        });
    });
});
// 5. МОДУЛЬ ПРОВЕРКИ И ВАЛИДАЦИИ ОТВЕТОВ С ЗАЩИТОЙ ОТ ПАДЕЖЕЙ
function checkTextAnswer(id, allowedStarts) {
    const element = document.getElementById(id);
    if (!element) return false;
    
    // Очищаем ввод от лишних пробелов и приводим к нижнему регистру
    const val = element.value.trim().toLowerCase().replace(/\s+/g, '');
    if (!val) return false;

    // Проверяем совпадение по началу слова (падежная защита) или полному соответствию
    return allowedStarts.some(start => {
        const target = start.toLowerCase().replace(/\s+/g, '');
        return val.startsWith(target) || val === target;
    });
}

function checkExactAnswer(id, expectedValue) {
    const element = document.getElementById(id);
    if (!element) return false;
    
    // Жёсткое сравнение строк (для формул и чисел, очищенных от пробелов)
    const val = element.value.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    const expected = expectedValue.toString().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
    
    return val === expected;
}
// 6. ГЛАВНЫЙ СЧЁТЧИК БАЛЛОВ И ВАЛИДАТОР ВАРИАНТА
function calculateVPRScore() {
    let score = 0;
    let details = {};

    // Задание 1: Выбор Рис. 2 (Азот)
    const t1 = document.getElementById("ans-task-1").value;
    if (t1 === "2") { score += 1; details.t1 = 1; } else { details.t1 = 0; }

    // Задание 2: Рис 1 и Рис 3 (Названия и формулы)
    // Рис 1: Название (вода/томат/сахар/глюкоза/лимонная) и Формула (H2O, C6H12O6 и др.)
    let t2_1 = checkTextAnswer("ans-2-t1-n", ["вод", "сахар", "глюкоз", "кислот"]) && checkTextAnswer("ans-2-t1-f", ["H2O", "C6H12O6"]);
    // Рис 3: Название (хлорид натрия/соль/вода) и Формула (NaCl, H2O)
    let t2_3 = checkTextAnswer("ans-2-t3-n", ["хлор", "соль", "вод"]) && checkTextAnswer("ans-2-t3-f", ["NaCl", "H2O"]);
    if (t2_1) score += 1;
    if (t2_3) score += 1;

    // Задание 3: Выбор процесса 3 (Ржавление)
    const t3 = document.getElementById("ans-task-3").value;
    if (t3 === "3") { score += 1; details.t3 = 1; } else { details.t3 = 0; }

    // Задание 4: Признак реакции (изменение цвета / ржавление / появление налета)
    if (checkTextAnswer("ans-task-4", ["измен", "потем", "ржав", "покрыт", "налет", "цвет"])) { score += 1; details.t4 = 1; }

    // Задание 5: Молярные массы (H2 = 2, PH3 = 34, COCl2 = 99)
    if (checkExactAnswer("ans-5-1", 2)) score += 1;
    if (checkExactAnswer("ans-5-2", 34)) score += 1;
    if (checkExactAnswer("ans-5-3", 99)) score += 1;

    // Задание 6: Выбор газа 1 (Водород) и объяснение (легче 29 / масса меньше)
    const t6_gas = document.getElementById("ans-6-gas").value;
    const t6_text = checkTextAnswer("ans-6-text", ["меньше", "легче", "29", "воздух"]);
    if (t6_gas === "1" && t6_text) { score += 1; }

    // Задание 7: Элементы А (Магний) и В (Углерод)
    // Элемент А: Магний, 3, II (или 2), металл, MgO
    let t7_a = checkTextAnswer("ans-7-a-name", ["магн"]) && checkExactAnswer("ans-7-a-period", 3) && checkTextAnswer("ans-7-a-group", ["ii", "2"]) && document.getElementById("ans-7-a-type").value === "металл" && checkTextAnswer("ans-7-a-oxide", ["mgo"]);
    // Элемент В: Углерод, 2, IV (или 4), неметалл, CO2
    let t7_b = checkTextAnswer("ans-7-b-name", ["угл"]) && checkExactAnswer("ans-7-b-period", 2) && checkTextAnswer("ans-7-b-group", ["iv", "4"]) && document.getElementById("ans-7-b-type").value === "неметалл" && checkTextAnswer("ans-7-b-oxide", ["co2", "co"]);
    if (t7_a) score += 2;
    if (t7_b) score += 2;

    // Задание 8: Расчёт жиров (150 * 0.004 = 0.6)
    if (checkExactAnswer("ans-task-8", 0.6)) { score += 1; }

    // Задание 9: Доля от нормы (0.6 / 90 * 100 = 0.67 или 0.7)
    if (checkExactAnswer("ans-task-9", 0.7) || checkExactAnswer("ans-task-9", 0.67)) { score += 1; }

    // Задание 10: Формулы перечня (Fe, Cl2, FeCl2/FeCl3, Na2SO3, H2SO4, Na2SO4, SO2, H2O)
    if (checkTextAnswer("ans-10-fe", ["fe"])) score += 1;
    if (checkTextAnswer("ans-10-cl", ["cl2"])) score += 1;
    if (checkTextAnswer("ans-10-fecl3", ["fecl3"])) score += 1;
    if (checkTextAnswer("ans-10-na2so3", ["na2so3"])) score += 1;
    if (checkTextAnswer("ans-10-h2so4", ["h2so4"])) score += 1;
    if (checkTextAnswer("ans-10-na2so4", ["na2so4"])) score += 1;
    if (checkTextAnswer("ans-10-so2", ["so2"])) score += 1;
    if (checkTextAnswer("ans-10-h2o", ["h2o"])) score += 1;

    // Задание 11: Описание газа (хлор / cl2)
    if (checkTextAnswer("ans-task-11", ["хлор", "cl2"])) { score += 1; }

    // Задание 12: Соединение с водородом (H2SO4 и кислота)
    if (checkTextAnswer("ans-12-formula", ["h2so4"]) && document.getElementById("ans-12-class").value === "кислота") { score += 1; }

    // Задание 13: Массовая доля кислорода (Na2SO3=38.10, H2SO4=65.31, Na2SO4=45.07)
    const t13_v = document.getElementById("ans-13-select").value;
    if (t13_v === "Na2SO3" && checkExactAnswer("ans-13-val", 38.10)) score += 1;
    if (t13_v === "H2SO4" && checkExactAnswer("ans-13-val", 65.31)) score += 1;
    if (t13_v === "Na2SO4" && checkExactAnswer("ans-13-val", 45.07)) score += 1;

    // Задание 14: Масса 0.6 моль железа (0.6 * 56 = 33.6)
    if (checkExactAnswer("ans-task-14", 33.6)) { score += 1; }

    // Задание 15: Уравнения (1: Fe+2HCl=FeCl2+H2, 2: CaCl2+Na2CO3=CaCO3+2NaCl)
    if (checkTextAnswer("ans-15-eq1", ["fe+2hcl=fecl2+h2"])) score += 1;
    if (checkTextAnswer("ans-15-eq2", ["cacl2+na2co3=caco3+2nacl"])) score += 1;

    // Задание 16: Тип реакции (1 - замещения, 2 - обмена)
    const t16_num = document.getElementById("ans-16-eq-num").value;
    const t16_type = document.getElementById("ans-16-type").value;
    if (t16_num === "1" && t16_type === "замещения") score += 1;
    if (t16_num === "2" && t16_type === "обмена") score += 1;

    // Задание 17: Разделение смесей (Рис. 2, действие магнитом, объяснение: кальций не притягивается / оба твердые / фильтрация для растворов)
    const t17_img = document.getElementById("ans-17-img").value;
    const t17_meth = checkTextAnswer("ans-17-method", ["магнит"]);
    const t17_text = checkTextAnswer("ans-17-text", ["раствор", "тверд", "сух", "не растворя"]);
    if (t17_img === "2" && t17_meth && t17_text) { score += 2; }

    // Задание 18: Соответствие (А-4, Б-1, В-5, Г-3 -> строка "4153")
    const t18 = document.getElementById("ans-18-a").value === "4" && document.getElementById("ans-18-b").value === "1" && document.getElementById("ans-18-v").value === "5" && document.getElementById("ans-18-g").value === "3";
    if (t18) { score += 2; }

    // Задание 19: Суждения (верно 3 и 4 -> строка "34")
    const t19 = document.getElementById("ans-task-19").value;
    if (t19 === "34") { score += 1; }

    // Конвертация баллов ВПР в оценку
    let grade = 2;
    if (score >= 10 && score <= 18) grade = 3;
    if (score >= 19 && score <= 26) grade = 4;
    if (score >= 27) grade = 5;

    return { score, grade };
}
// 7. ОТПРАВКА ДАННЫХ И ВЫВОД РЕЗУЛЬТАТОВ
document.addEventListener("DOMContentLoaded", () => {
    const btnSubmit = document.getElementById("btn-submit");
    const screenQuiz = document.getElementById("screen-quiz");
    const screenResults = document.getElementById("screen-results");
    
    const studentNameInput = document.getElementById("student-name");
    const studentClassInput = document.getElementById("student-class");
    const finalGradeDisplay = document.getElementById("final-grade");
    const studentSummaryDisplay = document.getElementById("student-summary");

    btnSubmit.addEventListener("click", () => {
        // Подтверждение перед отправкой (удобно на мобильных при случайном тапе)
        if (!confirm("Вы уверены, что хотите завершить лабораторную работу и отправить результаты?")) {
            return;
        }

        // Вычисляем баллы по внутренней системе лаборатории
        const results = calculateVPRScore();
        
        // Отображаем оценку и персональную сводку на финальном экране
        finalGradeDisplay.textContent = results.grade;
        studentSummaryDisplay.innerHTML = `Ученик: <strong>${studentNameInput.value}</strong>, Класс: <strong>${studentClassInput.value}</strong>.<br>Всего набрано баллов: <strong>${results.score}</strong>.`;

        // Упаковываем данные для отправки в Google Форму
        const formData = new FormData();
        formData.append(FORM_ENTRIES.studentName, studentNameInput.value);
        formData.append(FORM_ENTRIES.studentClass, studentClassInput.value);
        formData.append(FORM_ENTRIES.finalGrade, results.grade);
        formData.append(FORM_ENTRIES.rawScore, results.score);

        // Отправка методом no-cors (чтобы обойти ограничения безопасности браузера на чужой домен)
        fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        })
        .then(() => {
            console.log("Данные успешно катапультированы на сервер Google Forms.");
        })
        .catch((error) => {
            console.error("Критический сбой при отправке в сеть:", error);
        });

        // Переключаем интерфейс на экран результатов
        screenQuiz.classList.remove("active");
        screenResults.classList.add("active");
        
        // Автоматический скролл наверх
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
