/* ==========================================================================
   ДИНАМИЧЕСКИЙ РЕАКТОР // ПСХЭ МЕНДЕЛЕЕВА 9 КЛАСС // SCRIPT.JS
   ========================================================================== */

// 1. КОНФИГУРАЦИЯ СВЯЗИ С GOOGLE FORMS
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf0iU44KoembNpqw6M8dPcqz8h5Mn6RtR_KteJRiYKNNvOlFQ/formResponse";

const FORM_ENTRIES = {
    studentName: "entry.2100222455", 
    studentClass: "entry.2025383242", 
    finalGrade: "entry.932465497",   
    rawScore: "entry.2080833289"     
};

// Переменная, где будут храниться 10 выбранных для текущего ученика вопросов
let selectedTasksForStudent = [];

// 2. БАЗА ДАННЫХ ВОПРОСОВ (ЗАДАНИЯ 1–10)
const TASKS_POOL = [
    {
        id: 1,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Бор, 2) Азот, 3) Углерод в порядке <strong>увеличения их электроотрицательности</strong>. Запишите последовательность цифр без пробелов.",
        correct: "132" // B -> C -> N (в периоде слева направо увеличивается ЭО)
    },
    {
        id: 2,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Хлор, 2) Фтор, 3) Бром в порядке <strong>увеличения радиуса их атомов</strong>. Запишите последовательность цифр.",
        correct: "213" // F -> Cl -> Br (в группе сверху вниз увеличивается радиус)
    },
    {
        id: 3,
        type: "ordering",
        weight: 1,
        text: "Расположите простые вещества, образованные элементами: 1) Натрий, 2) Кремний, 3) Магний в порядке <strong>ослабления их металлических свойств</strong>. Запишите последовательность цифр.",
        correct: "132" // Na -> Mg -> Si (в периоде слева направо металлические свойства ослабевают)
    },
    {
        id: 4,
        type: "checkbox",
        weight: 2,
        text: "Какие два утверждения верны для характеристики как <strong>Лития</strong>, так и <strong>Натрия</strong>? Выберите два варианта.",
        options: [
            "1. Валентные электроны находятся на втором электронном слое",
            "2. Число валентных электронов в атоме равно 1",
            "3. Образуют высший оксид состава ЭО2",
            "4. Являются щелочными металлами",
            "5. Радиус атома лития больше радиуса атома натрия"
        ],
        correct: "24"
    },
    {
        id: 5,
        type: "checkbox",
        weight: 2,
        text: "Какие два утверждения верны для характеристики как <strong>Магния</strong>, так и <strong>Серы</strong>? Выберите два варианта.",
        options: [
            "1. Относятся к элементам третьего периода",
            "2. Высшая степень окисления равна +6",
            "3. Число электронных слоёв в атоме одинаково и равно 3",
            "4. Образуют летучие водородные соединения",
            "5. Простые вещества при обычных условиях являются газами"
        ],
        correct: "13"
    },
    {
        id: 6,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Фосфор, 2) Мышьяк, 3) Азот в порядке <strong>увеличения кислотных свойств</strong> их высших оксидов. Запишите последовательность цифр.",
        correct: "213" // As -> P -> N (в группе снизу вверх кислотные свойства оксидов усиливаются)
    },
    {
        id: 7,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Кальций, 2) Бериллий, 3) Магний в порядке <strong>усиления основных свойств</strong> образуемых ими высших гидроксидов.",
        correct: "231" // Be(OH)2 -> Mg(OH)2 -> Ca(OH)2 (в группе сверху вниз основные свойства усиливаются)
    },
    {
        id: 8,
        type: "checkbox",
        weight: 2,
        text: "Из предложенного перечня выберите два элемента, которые в соединениях имеют <strong>постоянную степень окисления +2</strong>.",
        options: [
            "1. Кальций",
            "2. Железо",
            "3. Барий",
            "4. Медь",
            "5. Углерод"
        ],
        correct: "13" // Элементы главной подгруппы II группы
    },
    {
        id: 9,
        type: "checkbox",
        weight: 2,
        text: "Какие два утверждения верны для характеристики атома <strong>Фосфора</strong>? Выберите два варианта.",
        options: [
            "1. Заряд ядра атома равен +15",
            "2. На внешнем электронном слое находится 3 электрона",
            "3. Высший оксид имеет формулу P2O5",
            "4. Радиус атома больше, чем у кремния",
            "5. Относится к металлам"
        ],
        correct: "13"
    },
    {
        id: 10,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Кремний, 2) Хлор, 3) Сера в порядке <strong>увеличения числа валентных электронов</strong> в их атомах. Запишите последовательность цифр.",
        correct: "132" // Число валентных электронов равно номеру группы: Si(4) -> S(6) -> Cl(7)
    }
];

// Функция тасования массивов (Алгоритм Фишера-Йетса)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// 3. БАЗА ДАННЫХ ВОПРОСОВ (ЗАДАНИЯ 11–20)
const ADDITIONAL_TASKS = [
    {
        id: 11,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Фтор, 2) Азот, 3) Кислород в порядке <strong>ослабления их неметаллических свойств</strong>. Запишите последовательность цифр.",
        correct: "132" // F -> O -> N (в периоде справа налево неметаллические свойства ослабевают)
    },
    {
        id: 12,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Алюминий, 2) Натрий, 3) Магний в порядке <strong>увеличения энергии ионизации</strong> их атомов. Запишите последовательность цифр.",
        correct: "231" // Na -> Mg -> Al (в периоде слева направо энергия ионизации возрастает)
    },
    {
        id: 13,
        type: "checkbox",
        weight: 2,
        text: "Какие два утверждения верны для характеристики как <strong>Углерода</strong>, так и <strong>Кремния</strong>? Выберите два варианта.",
        options: [
            "1. Относятся к р-элементам",
            "2. Высший оксид имеет общую формулу ЭО3",
            "3. Число валентных электронов равно 4",
            "4. Радиус атома углерода больше радиуса атома кремния",
            "5. Простые вещества являются металлами"
        ],
        correct: "13"
    },
    {
        id: 14,
        type: "checkbox",
        weight: 2,
        text: "Какие два утверждения верны для характеристики атома <strong>Хлора</strong>? Выберите два варианта.",
        options: [
            "1. Заряд ядра атома равен +17",
            "2. Высшая степень окисления равна +5",
            "3. На внешнем электронном слое находится 7 электронов",
            "4. Электронная оболочка содержит 2 электронных слоя",
            "5. Является s-элементом"
        ],
        correct: "13"
    },
    {
        id: 15,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Калий, 2) Литий, 3) Натрий в порядке <strong>ослабления их восстановительных свойств</strong>. Запишите последовательность цифр.",
        correct: "132" // K -> Na -> Li (в группе снизу вверх восстановительные свойства ослабевают)
    },
    {
        id: 16,
        type: "ordering",
        weight: 1,
        text: "Расположите химические элементы: 1) Сера, 2) Хлор, 3) Фосфор в порядке <strong>увеличения радиуса их атомов</strong>. Запишите последовательность цифр.",
        correct: "213" // Cl -> S -> P (в периоде справа налево радиус атома увеличивается)
    },
    {
        id: 17,
        type: "checkbox",
        weight: 2,
        text: "Из предложенного перечня выберите два элемента, которые могут проявлять степень окисления <strong>как -4, так и +4</strong>.",
        options: [
            "1. Азот",
            "2. Углерод",
            "3. Кремний",
            "4. Кислород",
            "5. Сера"
        ],
        correct: "23" // Элементы IVA группы
    },
    {
        id: 18,
        type: "checkbox",
        weight: 2,
        text: "Какие два утверждения верны для характеристики атома <strong>Кальция</strong>? Выберите два варианта.",
        options: [
            "1. Относится к щелочным металлам",
            "2. Радиус атома меньше, чем у магния",
            "3. Число электронных слоёв равно 4",
            "4. На внешнем электронном слое находится 2 электрона",
            "5. Заряд ядра атома равен +40"
        ],
        correct: "34"
    },
    {
        id: 19,
        type: "ordering",
        weight: 1,
        text: "Расположите летучие водородные соединения: 1) СH<sub>4</sub>, 2) HF, 3) NH<sub>3</sub> в порядке <strong>усиления их кислотных свойств</strong> в водных растворах.",
        correct: "132" // CH4 -> NH3 -> HF (в периоде слева направо кислотные свойства водородных соединений усиливаются)
    },
    {
        id: 20,
        type: "checkbox",
        weight: 2,
        text: "Какие два утверждения верны для характеристики как <strong>Калия</strong>, так и <strong>Брома</strong>? Выберите два варианта.",
        options: [
            "1. Находятся в одном периоде",
            "2. Находятся в одной группе",
            "3. Число электронных слоёв равно 4",
            "4. Являются неметаллами",
            "5. Имеют одинаковое число валентных электронов"
        ],
        correct: "13"
    }
];

// Объединяем пулы вопросов воедино
TASKS_POOL.push(...ADDITIONAL_TASKS);
// 4. МОДУЛЬ ГЕНЕРАЦИИ И ВЫВОДА ВАРИАНТА НА ЭКРАН
function generateStudentVariant() {
    const container = document.getElementById("dynamic-tasks-container");
    if (!container) return;
    
    container.innerHTML = ""; // Очищаем контейнер

    // Копируем исходный пул, перемешиваем его и забираем ровно 10 случайных вопросов
    let poolCopy = [...TASKS_POOL];
    shuffleArray(poolCopy);
    selectedTasksForStudent = poolCopy.slice(0, 10);

    // Отрисовываем каждое задание на экране в зависимости от его типа
    selectedTasksForStudent.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        
        // Порядковый номер на тесте (от 1 до 10)
        let htmlContent = `<h2>Задание ${index + 1}</h2>`;
        htmlContent += `<p class="task-text">${task.text}</p>`;

        if (task.type === "ordering") {
            // Однострочный строковый ввод для последовательности цифр (Тип А)
            htmlContent += `
                <div class="lab-field">
                    <input type="number" id="dyn-ans-${task.id}" class="hl-inline-input" 
                           style="text-align: center; font-family: monospace; letter-spacing: 2px;" 
                           inputmode="numeric">
                </div>
            `;
        } else if (task.type === "checkbox") {
            // Множественный выбор ОГЭ на неоновых плашках (Тип Б)
            task.options.forEach(option => {
                // Извлекаем цифру варианта (первый символ строки, например "1")
                const checkNum = option.trim().charAt(0);
                htmlContent += `
                    <div class="lab-option checkbox-option" data-task-id="${task.id}" data-check="${checkNum}">
                        <span>${option}</span>
                    </div>
                `;
            });
            // Скрытое поле для аккумуляции выбранных чекбоксов
            htmlContent += `<input type="hidden" id="dyn-ans-${task.id}">`;
        }

        taskCard.innerHTML = htmlContent;
        container.appendChild(taskCard);
    });

    // Навешиваем обработчик кликов/тапов на вновь созданные динамические плашки-чекбоксы
    activateDynamicCheckboxes();
}

// Активация тач-выбора на динамических плашках
function activateDynamicCheckboxes() {
    const options = document.querySelectorAll(".checkbox-option");
    options.forEach(option => {
        option.addEventListener("click", () => {
            option.classList.toggle("selected");
            
            const taskId = option.getAttribute("data-task-id");
            const hiddenInput = document.getElementById(`dyn-ans-${taskId}`);
            
            if (hiddenInput) {
                const selected = document.querySelectorAll(`.checkbox-option.selected[data-task-id="${taskId}"]`);
                let values = [];
                selected.forEach(opt => {
                    values.push(opt.getAttribute("data-check"));
                });
                values.sort((a, b) => a - b);
                hiddenInput.value = values.join("");
            }
        });
    });
}

// 5. ПОДСЧЕТ БАЛЛОВ ПО ОФИЦИАЛЬНЫМ ПРАВИЛАМ ФИПИ ДЛЯ ОГЭ
function checkTwoFormulaScore(userAns, correctAns) {
    if (userAns === correctAns) return 2;
    if (userAns.length !== correctAns.length) {
        let diffCount = 0;
        let maxLen = Math.max(userAns.length, correctAns.length);
        for (let i = 0; i < maxLen; i++) {
            if (userAns[i] !== correctAns[i]) diffCount++;
        }
        return diffCount === 1 ? 1 : 0;
    }
    let errors = 0;
    for (let i = 0; i < correctAns.length; i++) {
        if (userAns[i] !== correctAns[i]) errors++;
    }
    if (errors === 0) return 2;
    if (errors === 1) return 1;
    return 0;
}

function calculateDynamicScore() {
    let rawScore = 0;
    let maxPossibleScore = 0;

    selectedTasksForStudent.forEach(task => {
        const input = document.getElementById(`dyn-ans-${task.id}`);
        const userValue = input ? input.value.trim() : "";
        
        if (task.type === "ordering") {
            maxPossibleScore += 1;
            if (userValue === task.correct) rawScore += 1;
        } else if (task.type === "checkbox") {
            maxPossibleScore += 2;
            rawScore += checkTwoFormulaScore(userValue, task.correct);
        }
    });

    // Шкала перевода процентов набранных баллов в оценку по ФГОС
    const percentage = (rawScore / maxPossibleScore) * 100;
    let grade = 2;
    if (percentage >= 45 && percentage < 70) grade = 3;
    if (percentage >= 70 && percentage < 90) grade = 4;
    if (percentage >= 90) grade = 5;

    return { score: rawScore, grade: grade, max: maxPossibleScore };
}

// 6. СВЯЗУЮЩИЙ ИНТЕРФЕЙСНЫЙ МОДУЛЬ
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

    // Обработчик входа и запуска генератора
    btnStart.addEventListener("click", () => {
        if (!studentNameInput.value.trim() || !studentClassInput.value.trim()) {
            alert("ДОСТУП ЗАБЛОКИРОВАН: Заполните ФИО и Класс для начала контрольного синтеза!");
            return;
        }
        
        // Генерация уникального варианта для ученика
        generateStudentVariant();

        screenAuth.classList.remove("active");
        screenQuiz.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Обработчик завершения и отправки данных
    btnSubmit.addEventListener("click", () => {
        if (!confirm("Вы уверены, что хотите завершить выполнение заданий и отправить лабораторный отчёт?")) return;

        const results = calculateDynamicScore();
        finalGradeDisplay.textContent = results.grade;
        studentSummaryDisplay.innerHTML = `Ученик: <strong>${studentNameInput.value}</strong>, Класс: <strong>${studentClassInput.value}</strong>.<br>Успешно набрано баллов: <strong>${results.score}</strong> из ${results.max}.`;

        // Упаковка и отправка no-cors POST-запроса на Google Forms
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
        .then(() => { console.log("Отчёт успешно отправлен"); })
        .catch((err) => { console.error("Ошибка сети при передаче отчёта:", err); });

        screenQuiz.classList.remove("active");
        screenResults.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Логика встроенных модальных окон справочников [Br] и [Ba]
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
