const questions = [
  {
    type: "inline-dropdown",
    text: "Вставь вместо пропусков верные термины:",
    textTemplate: `
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        {0} — это способность организмов реагировать на изменения в окружающей среде.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        {1} — это процесс поступления веществ в организм, их превращения и удаления продуктов распада.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        {2} — это свойство живых существ производить себе подобных.
      </div>
    `,
    dropdownOptions: ["Размножение", "Обмен веществ", "Раздражимость", "Рост", "Развитие", "Питание"],
    correctAnswers: [2, 1, 0],
    points: 3
  },
  {
    type: "matching",
    text: "Сопоставь признак живого и его объяснение:",
    pairs: [
      { term: "Рост", definition: "Увеличение размеров и массы организма" },
      { term: "Развитие", definition: "Качественные изменения, появление новых свойств и функций" },
      { term: "Размножение", definition: "Воспроизведение себе подобных, передача наследственных признаков" },
      { term: "Обмен веществ", definition: "Поглощение веществ, их превращение и выделение продуктов жизнедеятельности" }
    ],
    correctAnswers: [0, 1, 2, 3],
    points: 4
  },
  {
    type: "true-false",
    text: "Определи, верно или неверно утверждение:",
    statements: [
      "Все объекты неживой природы способны к размножению.",
      "Растения могут реагировать на свет, поворачиваясь к нему.",
      "Обмен веществ происходит только у животных.",
      "Почва связывает живую и неживую природу: в ней живут организмы, а сама она состоит из минеральных частиц."
    ],
    correctAnswers: [false, true, false, true],
    points: 4
  },
  {
    // БЫЛО image-label — СТАЛО matching: связь живой и неживой природы
    type: "matching",
    text: "Соотнеси компонент природы с его ролью в поддержании жизни:",
    pairs: [
      { term: "Солнце", definition: "Источник энергии для фотосинтеза и нагрева среды" },
      { term: "Вода", definition: "Необходима для всех жизненных процессов, растворяет и переносит вещества" },
      { term: "Почва", definition: "Среда обитания для многих организмов и источник минеральных веществ" },
      { term: "Воздух", definition: "Содержит кислород для дыхания и углекислый газ для фотосинтеза" }
    ],
    correctAnswers: [0, 1, 2, 3],
    points: 4
  },
  {
    type: "inline-dropdown",
    text: "Выбери подходящие слова для описания среды обитания:",
    textTemplate: `
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        В {0} среде обитания мало кислорода и много воды; здесь живут рыбы и водоросли.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        В {1} среде обитания много кислорода, резкие перепады температуры; здесь обитают птицы и насекомые.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        В {2} среде обитания стабильная температура, мало света; здесь живут кроты и дождевые черви.
      </div>
    `,
    dropdownOptions: ["Водная", "Наземно-воздушная", "Почвенная", "Организменная"],
    correctAnswers: [0, 1, 2],
    points: 3
  },
  {
    type: "matching",
    text: "Сопоставь фактор среды и пример его влияния на живые организмы:",
    pairs: [
      { term: "Температура", definition: "При сильном похолодании многие насекомые впадают в оцепенение" },
      { term: "Влажность", definition: "В засушливых местах растения имеют длинные корни, чтобы доставать воду" },
      { term: "Свет", definition: "Растения тянутся к свету, листья располагаются так, чтобы улавливать больше солнечных лучей" },
      { term: "Состав почвы", definition: "На плодородных почвах растения растут быстрее и дают больший урожай" }
    ],
    correctAnswers: [0, 1, 2, 3],
    points: 4
  },
  {
    type: "true-false",
    text: "Оцени утверждения о единстве живой и неживой природы:",
    statements: [
      "Живые организмы не зависят от неживой природы.",
      "Для жизни растениям нужны вода, минеральные вещества из почвы и солнечный свет.",
      "Горные породы и минералы не участвуют в круговороте веществ.",
      "Отмершие растения и животные разлагаются и становятся частью неживой природы (почвы, минералов)."
    ],
    correctAnswers: [false, true, false, true],
    points: 4
  },
  {
    type: "inline-dropdown",
    text: "Закончи предложения, выбрав нужные слова:",
    textTemplate: `
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        Все живые существа состоят из {0}, но и в неживой природе встречаются те же химические элементы.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        Живые организмы используют вещества и энергию {1}, чтобы расти, питаться и размножаться.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        Отмирание одних организмов и появление новых — часть общего {2} в природе.
      </div>
    `,
    dropdownOptions: ["клеток", "неживой природы", "круговорота веществ", "атомов", "энергии солнца", "обмена веществ"],
    correctAnswers: [0, 1, 2],
    points: 3
  },
  {
    // БЫЛО image-label — СТАЛО matching: группы организмов
    type: "matching",
    text: "Сопоставь группу организмов и её ключевую особенность:",
    pairs: [
      { term: "Растения", definition: "Создают органические вещества из неорганических с помощью света (фотосинтез)" },
      { term: "Животные", definition: "Питаются готовыми органическими веществами, большинство активно передвигается" },
      { term: "Грибы", definition: "Поглощают питательные вещества всей поверхностью тела, не способны к фотосинтезу" },
      { term: "Бактерии", definition: "Очень мелкие одноклеточные организмы, часто выполняют роль разрушителей в природе" }
    ],
    correctAnswers: [0, 1, 2, 3],
    points: 4
  },
  {
    type: "true-false",
    text: "Проверь знания о признаках живого:",
    statements: [
      "Камень может расти, если на нём оседают частицы песка и глины.",
      "Рост кристалла соли похож на рост живого организма, но не является признаком жизни.",
      "Вирусы проявляют признаки живого только внутри клетки-хозяина.",
      "Любой объект, который двигается, является живым."
    ],
    correctAnswers: [false, true, true, false],
    points: 4
  }
];

let currentStep = 0;
let studentData = { name: "", letter: "", points: 0, maxPoints: 0, grade: "" };
let userAnswers = [];

// Получаем элементы только после того, как DOM готов
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const printBtn = document.getElementById('print-btn');
  const authCard = document.getElementById('step-auth');
  const finalCard = document.getElementById('step-final');
  const quizContainer = document.getElementById('quiz-container');

  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  function startQuiz() {
    const nameInput = document.getElementById('student-name')?.value.trim() || "";
    const letterInput = document.getElementById('student-letter')?.value.trim() || "";

    if (!nameInput || !letterInput) {
      alert("Пожалуйста, заполните ФИО и букву класса!");
      return;
    }

    studentData.name = nameInput;
    studentData.letter = letterInput.toUpperCase();

    if (authCard) {
      authCard.classList.remove('active');
    }
    userAnswers = [];
    currentStep = 0;
    renderQuiz();
    showStep(0);
  }

  function renderQuiz() {
  if (!quizContainer) return;
  quizContainer.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = "card q-card";
    card.id = `step-q-${index}`;

    let content = `<div class="question-text">Задание №${index + 1}. ${q.text}</div>`;

    if (q.type === 'inline-dropdown') {
      let renderedText = q.textTemplate;
      const selectHtmlTemplate = (dropIdx) => {
        return `<select class="inline-select" data-drop="${dropIdx}">
                  <option value="">Выберите...</option>
                  ${q.dropdownOptions.map((opt, optIdx) => `<option value="${optIdx}">${opt}</option>`).join('')}
                </select>`;
      };
      q.correctAnswers.forEach((_, dropIdx) => {
        renderedText = renderedText.replace(`{${dropIdx}}`, selectHtmlTemplate(dropIdx));
      });
      content += `<div class="inline-question-block">${renderedText}</div>`;
    }

    else if (q.type === 'matching') {
      // простой вариант: два столбца — слева термины, справа выпадающие списки с определениями
      const terms = q.pairs.map(p => p.term);
      const definitions = q.pairs.map(p => p.definition);
      content += `
        <div class="matching-grid">
          <div class="col-terms">
            ${terms.map((t, i) => `<div class="term-item">${t}</div>`).join('')}
          </div>
          <div class="col-defs">
            ${definitions.map((d, i) => `
              <select class="inline-select match-select" data-pair="${i}">
                <option value="">Выберите определение</option>
                ${definitions.map((def, idx) => `<option value="${idx}">${def}</option>`).join('')}
              </select>
            `).join('')}
          </div>
        </div>
      `;
    }

    else if (q.type === 'true-false') {
      content += `
        <div class="tf-list">
          ${q.statements.map((s, i) => `
            <label class="tf-item">
              <span class="tf-statement">${s}</span>
              <select class="inline-select tf-select" data-stmt="${i}">
                <option value="true">Верно</option>
                <option value="false">Неверно</option>
              </select>
            </label>
          `).join('')}
        </div>
      `;
    }

    else if (q.type === 'image-label') {
      // картинка + подписи (пока без перетаскивания: подписи — выпадающие списки рядом с местами)
      content += `
        <div class="image-label-wrapper">
          <img src="${q.imageUrl}" alt="Схема клетки" class="question-img">
          <div class="label-options">
            ${q.labels.map((lbl, i) => `
              <div class="label-row">
                <span class="label-name">${lbl}</span>:
                <select class="inline-select label-select" data-label="${i}">
                  <option value="">Выберите место</option>
                  ${q.labelPositions.map((_, idx) => `<option value="${idx}">Место ${idx + 1}</option>`).join('')}
                </select>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    content += `<button class="btn next-btn-trigger" style="margin-top: 20px;">Далее</button>`;
    card.innerHTML = content;

    // вешаем обработчик на кнопку «Далее»
    const nextBtn = card.querySelector('.next-btn-trigger');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => nextStep());
    }
    quizContainer.appendChild(card);
  });
}

  function showStep(stepIndex) {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => c.classList.remove('active'));

    if (stepIndex < questions.length) {
      const targetCard = document.getElementById(`step-q-${stepIndex}`);
      if (targetCard) {
        targetCard.classList.add('active');
      }
    } else {
      finishQuiz();
    }
  }

  function nextStep() {
  const q = questions[currentStep];
  const targetCard = document.getElementById(`step-q-${currentStep}`);
  const answers = [];

  if (q.type === 'inline-dropdown' && targetCard) {
    const selects = targetCard.querySelectorAll('.inline-select');
    selects.forEach(sel => {
      answers.push(sel.value === "" ? null : parseInt(sel.value, 10));
    });
  }

  else if (q.type === 'matching' && targetCard) {
    const selects = targetCard.querySelectorAll('.match-select');
    selects.forEach(sel => {
      const idx = parseInt(sel.dataset.pair, 10);
      answers[idx] = sel.value === "" ? null : parseInt(sel.value, 10);
    });
  }

  else if (q.type === 'true-false' && targetCard) {
    const selects = targetCard.querySelectorAll('.tf-select');
    selects.forEach(sel => {
      const idx = parseInt(sel.dataset.stmt, 10);
      answers[idx] = sel.value === "true"; // true/false
    });
  }

  else if (q.type === 'image-label' && targetCard) {
    const selects = targetCard.querySelectorAll('.label-select');
    selects.forEach(sel => {
      const idx = parseInt(sel.dataset.label, 10);
      answers[idx] = sel.value === "" ? null : parseInt(sel.value, 10);
    });
  }

  userAnswers.push(answers);
  currentStep++;
  showStep(currentStep);
}

  function calculateGrade(points, max) {
    if (max === 0) return "2";
    const percent = (points / max) * 100;
    if (percent >= 90) return "5";
    if (percent >= 70) return "4";
    if (percent >= 50) return "3";
    return "2";
  }

  function finishQuiz() {
    let totalPoints = 0;
    let maxPoints = 0;

    questions.forEach((q, idx) => {
      maxPoints += q.points || 1;
      if (q.type === 'inline-dropdown' && userAnswers[idx]) {
        q.correctAnswers.forEach((correctVal, i) => {
          if (userAnswers[idx][i] === correctVal) {
            totalPoints += 1;
          }
        });
      }
    });

    studentData.points = totalPoints;
    studentData.maxPoints = maxPoints;
    studentData.grade = calculateGrade(totalPoints, maxPoints);

    const resName = document.getElementById('res-name');
    const resClass = document.getElementById('res-class');
    const resPoints = document.getElementById('res-points');
    const resMaxPoints = document.getElementById('res-max-points');
    const resGrade = document.getElementById('res-grade');

    if (resName) resName.innerText = studentData.name;
    if (resClass) resClass.innerText = `5-${studentData.letter}`;
    if (resPoints) resPoints.innerText = totalPoints;
    if (resMaxPoints) resMaxPoints.innerText = maxPoints;
    if (resGrade) resGrade.innerText = studentData.grade;

    generatePrintForm();

    const finalCard = document.getElementById('step-final');
    if (finalCard) {
      finalCard.classList.add('active');
    }
  }

  function generatePrintForm() {
    const printZone = document.getElementById('print-zone');
    if (!printZone) return;

    let html = `
      <div class="print-header" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
          <h1>РЕЗУЛЬТАТЫ ВЫПОЛНЕНИЯ ЗАДАНИЯ</h1>
          <p><strong>Предмет:</strong> Биология (5 класс)</p>
          <p><strong>Тема:</strong> §1. Живая и неживая природа — единое целое?</p>
      </div>
      <p style="margin-top: 15px;"><strong>Ученик(ца):</strong> ${studentData.name}</p>
      <p><strong>Класс:</strong> 5-${studentData.letter}</p>
      <p><strong>Набрано баллов:</strong> ${studentData.points} из ${studentData.maxPoints}</p>
      <p><strong>Оценка:</strong> ${studentData.grade}</p>
      <p style="font-size: 12px; margin-top:5px; color:#555;">Разбалловка: 90%+ — «5», 70%+ — «4», 50%+ — «3»</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
              <tr>
                  <th style="border: 1px solid #000; padding: 8px; text-align: left;">№</th>
                  <th style="border: 1px solid #000; padding: 8px; text-align: left;">Задание</th>
                  <th style="border: 1px solid #000; padding: 8px; text-align: left;">Результат</th>
              </tr>
          </thead>
          <tbody>`;

    questions.forEach((q, index) => {
      let correctCount = 0;
      if (userAnswers[index]) {
        q.correctAnswers.forEach((correctVal, i) => {
          if (userAnswers[index][i] === correctVal) correctCount++;
        });
      }

      html += `
          <tr>
              <td style="border: 1px solid #000; padding: 8px;">${index + 1}</td>
              <td style="border: 1px solid #000; padding: 8px;">${q.text}</td>
              <td style="border: 1px solid #000; padding: 8px;"><strong>Правильно ${correctCount} из ${q.correctAnswers.length}</strong></td>
          </tr>`;
    });

    html += `</tbody></table>`;
    printZone.innerHTML = html;
  }
});
