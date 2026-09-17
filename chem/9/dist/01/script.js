// script.js - Часть 1: Данные заданий с химической нотацией
const quizData = [
  {
    id: 1,
    title: "Задание 1. Классификация по числу и составу веществ",
    formulas: [
      "А) 2H<sub>2</sub>O = 2H<sub>2</sub> + O<sub>2</sub>",
      "Б) CaO + CO<sub>2</sub> = CaCO<sub>3</sub>",
      "В) Zn + 2HCl = ZnCl<sub>2</sub> + H<sub>2</sub>",
      "Г) NaOH + HCl = NaCl + H<sub>2</sub>O"
    ],
    types: [
      "1) Соединения",
      "2) Разложения",
      "3) Замещения",
      "4) Обмена"
    ],
    correctAnswer: "2134", // А-2, Б-1, В-3, Г-4
    explanations: {
      "А": "Из одного сложного вещества (H<sub>2</sub>O) образуются два простых — это реакция разложения (2).",
      "Б": "Из двух сложных веществ образуется одно еще более сложное — это реакция соединения (1).",
      "В": "Простое вещество (Zn) замещает атомы водорода в сложном веществе (HCl) — это реакция замещения (3).",
      "Г": "Два сложных вещества обмениваются своими составными частями — это реакция обмена (4)."
    }
  },
  {
    id: 2,
    title: "Задание 2. Окислительно-восстановительные реакции (ОВР)",
    formulas: [
      "А) 2KClO<sub>3</sub> = 2KCl + 3O<sub>2</sub>",
      "Б) BaCl<sub>2</sub> + H<sub>2</sub>SO<sub>4</sub> = BaSO<sub>4</sub>↓ + 2HCl",
      "В) S + O<sub>2</sub> = SO<sub>2</sub>",
      "Г) CuO + 2HNO<sub>3</sub> = Cu(NO<sub>3</sub>)<sub>2</sub> + H<sub>2</sub>O"
    ],
    types: [
      "1) ОВР (межмолекулярная)",
      "2) ОВР (внутримолекулярная)",
      "3) Не ОВР (обменная)",
      "4) Не ОВР (соединение без изменения С.О.)"
    ],
    correctAnswer: "2314",
    explanations: {
      "А": "Элементы Хлор и Кислород меняют степени окисления внутри одной молекулы KClO<sub>3</sub> — это внутримолекулярная ОВР (2).",
      "Б": "Реакция ионного обмена, степени окисления элементов не изменяются — это не ОВР (3).",
      "В": "Сера и Кислород изменяют свои степени окисления, это классическая ОВР между разными веществами (1).",
      "Г": "Оксид меди реагирует с кислотой без изменения степеней окисления — это не ОВР (4)."
    }
  },
  {
    id: 3,
    title: "Задание 3. Тепловой эффект реакций",
    formulas: [
      "А) CH<sub>4</sub> + 2O<sub>2</sub> = CO<sub>2</sub> + 2H<sub>2</sub>O + Q",
      "Б) N<sub>2</sub> + O<sub>2</sub> = 2NO - Q",
      "В) C + O<sub>2</sub> = CO<sub>2</sub> + Q",
      "Г) CaCO<sub>3</sub> = CaO + CO<sub>2</sub> - Q"
    ],
    types: [
      "1) Экзотермическая (горение)",
      "2) Эндотермическая (исключение для горения)",
      "3) Экзотермическая (присоединение/окисление)",
      "4) Эндотермическая (разложение)"
    ],
    correctAnswer: "1234",
    explanations: {
      "А": "Горение метана происходит с выделением тепла (+Q) — экзотермическая реакция (1).",
      "Б": "Взаимодействие азота с кислородом — эндоветрическое горение (-Q), важное исключение (2).",
      "В": "Горение угля идет с выделением тепла (+Q) — экзотермическая реакция (3).",
      "Г": "Разложение известняка требует постоянного нагревания, тепло поглощается (-Q) — эндотермическая реакция (4)."
    }
  },
  {
    id: 4,
    title: "Задание 4. Обратимость химических процессов",
    formulas: [
      "А) N<sub>2</sub> + 3H<sub>2</sub> ⇄ 2NH<sub>3</sub>",
      "Б) 2H<sub>2</sub> + O<sub>2</sub> = 2H<sub>2</sub>O",
      "В) SO<sub>2</sub> + O<sub>2</sub> ⇄ SO<sub>3</sub> (в присутствии катализатора)",
      "Г) Ba(NO<sub>3</sub>)<sub>2</sub> + Na<sub>2</sub>SO<sub>4</sub> = BaSO<sub>4</sub>↓ + 2NaNO<sub>3</sub>"
    ],
    types: [
      "1) Обратимая (синтез аммиака)",
      "2) Необратимая (взрывной синтез воды)",
      "3) Обратимая (окисление сернистого газа)",
      "4) Необратимая (идет до конца из-за осадка)"
    ],
    correctAnswer: "1234",
    explanations: {
      "А": "Синтез аммиака — классический пример обратимой реакции, протекает в обоих направлениях (1).",
      "Б": "Гремучий газ реагирует бурно, реакция практически необратима в обычных условиях (2).",
      "В": "Окисление SO<sub>2</sub> в SO<sub>3</sub> на катализаторе является обратимым процессом (3).",
      "Г": "Реакция обмена идет до конца (необратима), так как образуется нерастворимый осадок BaSO<sub>4</sub> (4)."
    }
  },
  {
    id: 5,
    title: "Задание 5. Фазовое состояние (агрегатное состояние реакционной среды)",
    formulas: [
      "А) H<sub>2(г)</sub> + Cl<sub>2(г)</sub> = 2HCl<sub>(г)</sub>",
      "Б) CaCO<sub>3(тв)</sub> + 2HCl<sub>(р-р)</sub> = CaCl<sub>2(р-р)</sub> + CO<sub>2(г)</sub> + H<sub>2</sub>O<sub>(ж)</sub>",
      "В) 2CO<sub>(г)</sub> + O<sub>2(г)</sub> = 2CO<sub>2(г)</sub>",
      "Г) Fe<sub>(тв)</sub> + CuSO<sub>4(р-р)</sub> = FeSO<sub>4(р-р)</sub> + Cu<sub>(тв)</sub>"
    ],
    types: [
      "1) Гомогенная (газ + газ)",
      "2) Гетерогенная (твердое + раствор)",
      "3) Гомогенная (газ + газ, окисление CO)",
      "4) Гетерогенная (твердое + раствор, замещение металла)"
    ],
    correctAnswer: "1234",
    explanations: {
      "А": "Оба исходных вещества — газы, границы раздела фаз нет, реакция гомогенная (1).",
      "Б": "Реагируют твердый известняк и жидкий раствор кислоты, есть граница раздела — реакция гетерогенная (2).",
      "В": "Исходные вещества находятся в одной газовой фазе — реакция гомогенная (3).",
      "Г": "Железо — твердое вещество, сульфат меди — в растворе, реакция идет на поверхности металла — гетерогенная (4)."
    }
  }
];
// НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ФОРМОЙ
// Замените эти значения на данные вашей формы, когда они у вас будут:
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc8fZPeJ8w9IzgGRwxKwONt11xPm7BEE0PCO-yObopIIAtxdA/formResponse"; 
const ENTRY_NAME   = "entry.1692260808"; // ID поля "ФИО"
const ENTRY_CLASS  = "entry.1750905112"; // ID поля "Класс"
const ENTRY_POINTS = "entry.565560636"; // ID поля "Баллы"
const ENTRY_GRADE  = "entry.128728619"; // ID поля "Оценка"

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  renderQuiz();
  setupInputRestrictions();
  
  document.getElementById("submitBtn").addEventListener("click", processQuiz);
});

// Полностью исправленная и надежная генерация заданий
function renderQuiz() {
  const container = document.getElementById("quiz-container");
  let html = "";

  for (let i = 0; i < quizData.length; i++) {
    const task = quizData[i];
    
    // Собираем строки с формулами
    let formulasHtml = "";
    for (let j = 0; j < task.formulas.length; j++) {
      formulasHtml += "<div>" + task.formulas[j] + "</div>";
    }

    // Собираем строки с типами реакций
    let typesHtml = "";
    for (let k = 0; k < task.types.length; k++) {
      typesHtml += "<div>" + task.types[k] + "</div>";
    }

    // Собираем весь каркас задания
    html += `
      <div class="task-card" id="task-${task.id}">
        <div class="task-title">${task.title}</div>
        <div class="quiz-grid">
          <div class="column-formulas">${formulasHtml}</div>
          <div class="column-types">${typesHtml}</div>
        </div>
        <div class="answer-zone">
          <label for="input-${task.id}">Ваш ответ (последовательность 4 цифр):</label>
          <input type="text" 
                 id="input-${task.id}" 
                 class="answer-input" 
                 maxlength="4" 
                 placeholder="1234" 
                 data-task-id="${task.id}">
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// Ограничение ввода: только цифры, максимум 4 символа
function setupInputRestrictions() {
  document.getElementById("quiz-container").addEventListener("input", (e) => {
    if (e.target.classList.contains("answer-input")) {
      // Удаляем всё, кроме цифр
      e.target.value = e.target.value.replace(/\D/g, "");
    }
  });
}

// Главная функция проверки и отправки результатов
function processQuiz() {
  const nameInput = document.getElementById("studentName");
  const classInput = document.getElementById("studentClass");

  // Валидация данных ученика
  const name = nameInput.value.trim();
  const studentClass = classInput.value.trim();

  if (!name || !studentClass) {
    alert("Пожалуйста, заполните ваши ФИО и Класс перед отправкой!");
    nameInput.focus();
    return;
  }

  let totalPoints = 0;
  let feedbackHtml = "";

  // Проверка каждого задания
  quizData.forEach((task) => {
    const userInput = document.getElementById(`input-${task.id}`).value.trim();
    const isCorrect = (userInput === task.correctAnswer);

    if (isCorrect) {
      totalPoints++;
      feedbackHtml += `
        <div class="feedback-item correct">
          <div class="feedback-title">✓ ${task.title} — Верно!</div>
        </div>
      `;
    } else {
      // Формируем детальный разбор ошибок
      let errorsDetails = "";
      const letters = ["А", "Б", "В", "Г"];
      
      // Идем по каждой букве уравнения и проверяем, совпадает ли цифра ответа
      for (let i = 0; i < 4; i++) {
        const userDigit = userInput[i] || "?";
        const correctDigit = task.correctAnswer[i];
        
        if (userDigit !== correctDigit) {
          errorsDetails += `
            <div class="error-explanation">
              <strong>Ошибка в уравнении ${letters[i]}:</strong> Ваша цифра: <strong>${userDigit}</strong>. 
              <br>${task.explanations[letters[i]]}
            </div>
          `;
        }
      }

      feedbackHtml += `
        <div class="feedback-item wrong">
          <div class="feedback-title">✗ ${task.title}</div>
          <div class="feedback-details">
            Ваш ответ: <span style="color:var(--error-color)">${userInput || "пусто"}</span>, 
            правильный ответ: <span style="color:var(--success-color)">${task.correctAnswer}</span>.
          </div>
          ${errorsDetails}
        </div>
      `;
    }
  });

  // Расчет школьной оценки
  let grade = 2;
  if (totalPoints === 5) grade = 5;
  else if (totalPoints === 4) grade = 4;
  else if (totalPoints === 3) grade = 3;

  // Отображение результатов на экране ученика
  document.getElementById("totalPoints").innerText = totalPoints;
  
  const gradeBadge = document.getElementById("finalGrade");
  gradeBadge.innerText = grade;
  
  // Меняем цвет плашки оценки
  if (grade >= 4) {
    gradeBadge.style.backgroundColor = "var(--success-color)";
  } else if (grade === 3) {
    gradeBadge.style.backgroundColor = "#ecc94b"; // желтый
  } else {
    gradeBadge.style.backgroundColor = "var(--error-color)";
  }

  document.getElementById("detailed-feedback").innerHTML = feedbackHtml;
  document.getElementById("result-block").classList.remove("hidden");

  // Деактивируем кнопку, чтобы избежать повторной отправки
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "Результаты отправлены учителю";
  submitBtn.style.backgroundColor = "#a0aec0";

  // Отправка данных в Google Таблицу через Google Форму
  sendToGoogleForm(name, studentClass, totalPoints, grade);

  // Скроллим страницу к результатам
  document.getElementById("result-block").scrollIntoView({ behavior: 'smooth' });
}

// Фоновая отправка данных в форму
function sendToGoogleForm(name, studentClass, points, grade) {
  // На всякий случай проверяем, изменены ли дефолтные значения url формы
  if (GOOGLE_FORM_URL.includes("e/1FAIpQLSfXXXXXXXXXXXXXXX")) {
    console.warn("Данные не отправлены в Google: настройте параметры связи с вашей формой.");
    return;
  }

  // Подставляем данные в невидимые инпуты нашей технической формы
  document.getElementById("gName").name = ENTRY_NAME;
  document.getElementById("gName").value = name;

  document.getElementById("gClass").name = ENTRY_CLASS;
  document.getElementById("gClass").value = studentClass;

  document.getElementById("gPoints").name = ENTRY_POINTS;
  document.getElementById("gPoints").value = points;

  document.getElementById("gGrade").name = ENTRY_GRADE;
  document.getElementById("gGrade").value = grade;

  // Направляем экшн формы на адрес Google и делаем сабмит
  const form = document.getElementById("googleForm");
  form.action = GOOGLE_FORM_URL;
  form.method = "POST";
  form.submit();
}
