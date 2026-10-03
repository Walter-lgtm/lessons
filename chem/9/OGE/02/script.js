// ==========================================================================
// 1. БАЗА ДАННЫХ ЗАДАНИЙ (ПО ДАННЫМ С КАРТИНКИ)
// ==========================================================================
const quizData = [
    {
        id: 1,
        element: "фосфора",
        text: "Установите соответствие между формулой вещества и степенью окисления фосфора в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) Ca<sub>3</sub>(PO<sub>4</sub>)<sub>2</sub>", "Б) Na<sub>3</sub>P", "В) PH<sub>3</sub>"],
        variants: ["1) -3", "2) +5", "3) +1", "4) +3"],
        correct: "211",
        explanation: "А) В фосфате кальция Ca<sub>3</sub>(PO<sub>4</sub>)<sub>2</sub> фосфор находится в составе ортофосфат-иона PO<sub>4</sub><sup>3−</sup>, где степень окисления P равна +5.<br>Б) В фосфиде натрия Na<sub>3</sub>P фосфор как более электроотрицательный элемент имеет минимальную степень окисления -3.<br>В) В фосфине PH<sub>3</sub> водород имеет степень окисления +1, следовательно, фосфор имеет степень окисления -3."
    },
    {
        id: 2,
        element: "серы",
        text: "Установите соответствие между формулой вещества и степенью окисления серы в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) Li<sub>2</sub>SO<sub>4</sub>", "Б) (NH<sub>4</sub>)<sub>2</sub>SO<sub>3</sub>", "В) FeS"],
        variants: ["1) -2", "2) +3", "3) +4", "4) +6"],
        correct: "431",
        explanation: "А) В сульфате лития Li<sub>2</sub>SO<sub>4</sub> сера находится в высшей степени окисления +6.<br>Б) В сульфите аммония (NH<sub>4</sub>)<sub>2</sub>SO<sub>3</sub> сера находится в составе сульфит-иона SO<sub>3</sub><sup>2−</sup> со степенью окисления +4.<br>В) В сульфиде железа FeS сера проявляет свою минимальную степень окисления -2."
    },
    {
        id: 3,
        element: "азота",
        text: "Установите соответствие между формулой вещества и степенью окисления азота в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) NO<sub>2</sub>", "Б) (NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>", "В) KNO<sub>2</sub>"],
        variants: ["1) -3", "2) +5", "3) +3", "4) +4"],
        correct: "413",
        explanation: "А) В оксиде азота(IV) NO<sub>2</sub> кислород равен -2, значит, у азота +4.<br>Б) В сульфате аммония азот в ионе аммония NH<sub>4</sub><sup>+</sup> имеет минимальную степень окисления -3.<br>В) В нитрите калия KNO<sub>2</sub> азот находится в степени окисления +3."
    },
    {
        id: 4,
        element: "фосфора",
        text: "Установите соответствие между формулой вещества и степенью окисления фосфора в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) AlPO<sub>4</sub>", "Б) Mg<sub>3</sub>P<sub>2</sub>", "В) HPO<sub>3</sub>"],
        variants: ["1) -3", "2) +5", "3) +1", "4) +3"],
        correct: "212",
        explanation: "А) В фосфате алюминия AlPO<sub>4</sub> фосфор находится в степени окисления +5.<br>Б) В фосфиде магния Mg<sub>3</sub>P<sub>2</sub> бинарное соединение, фосфор имеет степень окисления -3.<br>В) В метафосфорной кислоте HPO<sub>3</sub>: +1 + X + 3*(-2) = 0, откуда X = +5."
    },
    {
        id: 5,
        element: "фосфора",
        text: "Установите соответствие между формулой вещества и степенью окисления фосфора в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) H<sub>3</sub>PO<sub>3</sub>", "Б) (NH<sub>4</sub>)<sub>2</sub>HPO<sub>4</sub>", "В) Ca<sub>3</sub>P<sub>2</sub>"],
        variants: ["1) -3", "2) +5", "3) +1", "4) +3"],
        correct: "421",
        explanation: "А) В фосфористой кислоте H<sub>3</sub>PO<sub>3</sub> водород +1, кислород -2. Степень окисления P равна +3.<br>Б) В гидрофосфате аммония фосфор входит в состав фосфат-аниона, его степень окисления +5.<br>В) В фосфиде кальция Ca<sub>3</sub>P<sub>2</sub> кальций всегда +2, значит у фосфора -3."
    },
    {
        id: 6,
        element: "кремния",
        text: "Установите соответствие между формулой вещества и степенью окисления кремния в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) H<sub>2</sub>SiO<sub>3</sub>", "Б) Na<sub>2</sub>Si<sub>2</sub>O<sub>5</sub>", "В) Mg<sub>2</sub>Si"],
        variants: ["1) -4", "2) -2", "3) +2", "4) +4"],
        correct: "441",
        explanation: "А) В кремниевой кислоте H<sub>2</sub>SiO<sub>3</sub> кремний имеет высшую степень окисления +4.<br>Б) В дисиликате натрия Na<sub>2</sub>Si<sub>2</sub>O<sub>5</sub> кремний также находится в своей устойчивой степени окисления +4.<br>В) В силициде магния Mg<sub>2</sub>Si кремний соединен с металлом и проявляет отрицательную степень окисления -4."
    },
    {
        id: 7,
        element: "хрома",
        text: "Установите соответствие между формулой вещества и степенью окисления хрома в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) CrO<sub>3</sub>", "Б) (NH<sub>4</sub>)<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub>", "В) Cr(OH)<sub>3</sub>"],
        variants: ["1) +6", "2) +2", "3) +3", "4) +4"],
        correct: "113",
        explanation: "А) В высшем оксиде хрома CrO<sub>3</sub> хром проявляет степень окисления +6.<br>Б) В дихромате аммония (NH<sub>4</sub>)<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> в дихромат-ионе хром имеет степень окисления +6.<br>В) В гидроксиде хрома(III) Cr(OH)<sub>3</sub> степень окисления хрома равна +3."
    },
    {
        id: 8,
        element: "хлора",
        text: "Установите соответствие между формулой вещества и степенью окисления хлора в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) CCl<sub>4</sub>", "Б) NH<sub>4</sub>ClO<sub>4</sub>", "В) Mg(ClO<sub>3</sub>)<sub>2</sub>"],
        variants: ["1) -1", "2) +3", "3) +5", "4) +7"],
        correct: "143",
        explanation: "А) В тетрахлорметане CCl<sub>4</sub> хлор более электроотрицателен, чем углерод, его степень окисления -1.<br>Б) В перхлорате аммония NH<sub>4</sub>ClO<sub>4</sub> хлор находится в составе перхлорат-иона ClO<sub>4</sub><sup>−</sup> со степенью окисления +7.<br>В) В хлорате магния Mg(ClO<sub>3</sub>)<sub>2</sub> хлор находится в составе хлорат-иона ClO<sub>3</sub><sup>−</sup> со степенью окисления +5."
    },
    {
        id: 9,
        element: "марганца",
        text: "Установите соответствие между формулой вещества и степенью окисления марганца в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) Mn<sub>2</sub>O<sub>7</sub>", "Б) Mn(OH)<sub>2</sub>", "В) Na<sub>2</sub>MnO<sub>4</sub>"],
        variants: ["1) +2", "2) +7", "3) +4", "4) +6"],
        correct: "214",
        explanation: "А) В оксиде марганца(VII) Mn<sub>2</sub>O<sub>7</sub> марганец имеет высшую степень окисления +7.<br>Б) В гидроксиде марганца(II) Mn(OH)<sub>2</sub> степень окисления равна +2.<br>В) В манганате натрия Na<sub>2</sub>MnO<sub>4</sub> марганец имеет степень окисления +6."
    },
    {
        id: 10,
        element: "марганца",
        text: "Установите соответствие между формулой вещества и степенью окисления марганца в данном веществе: к каждой позиции, обозначенной буквой, подберите соответствующую позицию, обозначенную цифрой.",
        formulas: ["A) MnSO<sub>4</sub>", "Б) KMnO<sub>4</sub>", "В) MnO<sub>2</sub>"],
        variants: ["1) +2", "2) +7", "3) +4", "4) +6"],
        correct: "123",
        explanation: "А) В сульфате марганца(II) MnSO<sub>4</sub> заряд сульфат-иона 2-, значит у марганца +2.<br>Б) В перманганате калия KMnO<sub>4</sub> марганец находится в высшей степени окисления +7.<br>В) В оксиде марганца(IV) MnO<sub>2</sub> (пиролюзите) степень окисления марганца равна +4."
    }
];
// ==========================================================================
// 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ И ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ
// ==========================================================================
let currentQuestionIndex = 0;
let userAnswers = [];
let studentInfo = { name: "", group: "" };
let totalPoints = 0;

// Элементы интерфейса (Экраны)
const authScreen = document.getElementById('auth-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

// Элементы управления и ввода
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const studentNameInput = document.getElementById('student-name');
const studentClassInput = document.getElementById('student-class');
const userAnswerInput = document.getElementById('user-answer');

// Динамические контейнеры
const questionContainer = document.getElementById('question-container');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

// ==========================================================================
// 3. ОБРАБОТЧИКИ СОБЫТИЙ И ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
// ==========================================================================

// Авторизация и запуск теста
startBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    const group = studentClassInput.value.trim();

    if (!name || !group) {
        alert("Пожалуйста, заполните поля ФИО и Класс перед началом!");
        return;
    }

    studentInfo.name = name;
    studentInfo.group = group;

    authScreen.classList.add('hidden');
    authScreen.classList.remove('active');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('active');

    loadQuestion();
});

// Ограничение ввода в поле ответа: только цифры, максимум 3 символа
userAnswerInput.addEventListener('input', (e) => {
    // Удаляем всё, кроме цифр от 1 до 4 (так как варианты ответов 1-4)
    let value = e.target.value.replace(/[^1-4]/g, '');
    if (value.length > 3) {
        value = value.slice(0, 3);
    }
    e.target.value = value;
});

// Обработка клика по кнопке "Ответить / Далее"
nextBtn.addEventListener('click', () => {
    const answer = userAnswerInput.value.trim();

    if (answer.length !== 3) {
        alert("Ответ должен состоять ровно из 3 цифр!");
        return;
    }

    // Сохраняем ответ ученика
    userAnswers.push(answer);
    
    currentQuestionIndex++;
    userAnswerInput.value = ""; // Очищаем поле ввода

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// ==========================================================================
// 4. ОТОБРАЖЕНИЕ ЗАДАНИЯ
// ==========================================================================
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    
    // Обновляем прогресс-бар
    progressText.textContent = `Вопрос ${currentQuestionIndex + 1} из ${quizData.length}`;
    const progressPercent = ((currentQuestionIndex) / quizData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Генерируем таблицу в стиле ОГЭ
    let tableHtml = `
        <p class="task-description">${currentQuestion.text}</p>
        <table class="chemistry-table">
            <thead>
                <tr>
                    <th style="width: 50%;">ФОРМУЛА ВЕЩЕСТВА</th>
                    <th style="width: 50%;">СТЕПЕНЬ ОКИСЛЕНИЯ ${currentQuestion.element.toUpperCase()}</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Определяем максимальное количество строк для рендеринга таблицы
    const maxRows = Math.max(currentQuestion.formulas.length, currentQuestion.variants.length);

    for (let i = 0; i < maxRows; i++) {
        const formula = currentQuestion.formulas[i] || "";
        const variant = currentQuestion.variants[i] || "";
        tableHtml += `
            <tr>
                <td>${formula}</td>
                <td>${variant}</td>
            </tr>
        `;
    }

    tableHtml += `
            </tbody>
        </table>
    `;

    questionContainer.innerHTML = tableHtml;
    userAnswerInput.focus(); // Автофокус на поле ввода для удобства
}
// ==========================================================================
// 5. ПОДСЧЕТ БАЛЛОВ, ОЦЕНКА И Google Forms
// ==========================================================================

function calculateGrade(points) {
    // Шкала перевода баллов ОГЭ по химии (из расчета 1 балл за 1 правильное задание)
    if (points >= 9) return "5 (Отлично)";
    if (points >= 7) return "4 (Хорошо)";
    if (points >= 4) return "3 (Удовлетворительно)";
    return "2 (Неудовлетворительно)";
}

function showResults() {
    // Считаем прогресс-бар до конца
    progressFill.style.width = "100%";

    // Переключаем экраны
    quizScreen.classList.add('hidden');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('active');

    // Считаем баллы
    totalPoints = 0;
    quizData.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            totalPoints++;
        }
    });

    const finalGrade = calculateGrade(totalPoints);

    // Выводим результаты на экран
    document.getElementById('final-points').textContent = totalPoints;
    document.getElementById('final-grade').textContent = finalGrade.split(' ')[0]; // Только цифра оценки

    // Формируем детальный разбор ошибок
    generateReview();

    // Отправляем данные в Google Форму
    sendDataToGoogleSheets(finalGrade);
}

// Генерируем разбор ответов для ученика
function generateReview() {
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = ""; // Очищаем контейнер

    quizData.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.correct;
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'wrong'}`;

        reviewItem.innerHTML = `
            <div class="review-title">Задание №${question.id} (${isCorrect ? 'Правильно' : 'Ошибка'})</div>
            <div class="review-answers">
                <strong>Ваш ответ:</strong> ${userAnswers[index]} | 
                <strong>Правильный ответ:</strong> ${question.correct}
            </div>
            <div class="review-explanation">
                <strong>Объяснение:</strong><br>${question.explanation}
            </div>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
}

// Отправка данных в Google Таблицу через iframe
function sendDataToGoogleSheets(grade) {
    const statusMsg = document.getElementById('sending-status');
    statusMsg.textContent = "Сохранение результатов в базу данных...";

    try {
        // Заполняем скрытые поля формы данными ученика
        document.getElementById('entry-name').value = studentInfo.name;
        document.getElementById('entry-class').value = studentInfo.group;
        document.getElementById('entry-points').value = totalPoints;
        document.getElementById('entry-grade').value = grade;

        // Отправляем форму
        document.getElementById('google-form').submit();
        
        statusMsg.style.color = "var(--success-color)";
        statusMsg.textContent = "Результаты успешно сохранены!";
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        statusMsg.style.color = "var(--error-color)";
        statusMsg.textContent = "Ошибка при сохранении результатов. Обратитесь к учителю.";
    }
}

// Перезапуск теста
restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    userAnswers = [];
    totalPoints = 0;

    // Сбрасываем поля ввода
    userAnswerInput.value = "";
    studentNameInput.value = "";
    studentClassInput.value = "";

    // Возвращаемся на экран авторизации
    resultScreen.classList.add('hidden');
    resultScreen.classList.remove('active');
    authScreen.classList.remove('hidden');
    authScreen.classList.add('active');
});
