const questions = [
  {
    type: "inline-dropdown",
    text: "Вставь вместо пропусков верные биологические термины:",
    textTemplate: `
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        {0} — это количественные изменения в структуре любого природного тела, то есть в процессе жизни организмы увеличивают свои размеры и массу.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        {1} — это качественные изменения в структуре любого природного тела.
      </div>
      <div style="line-height: 1.8; margin-bottom: 15px; text-align: left;">
        {2} — это способность воспроизводить себе подобных, передавать свои признаки, свойства и особенности развития из поколения в поколение.
      </div>
    `,
    dropdownOptions: ["Размножение", "Развитие", "Рост", "Обмен веществ", "Дыхание", "Питание"],
    // индексы правильных ответов: 0→Рост, 1→Развитие, 2→Размножение
    correctAnswers: [2, 1, 0],
    points: 3
  }
];

let currentStep = 0;
let studentData = {
  name: "",
  letter: "",
  points: 0,
  maxPoints: 0,
  grade: ""
};
let userAnswers = [];

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
  const nameInput = document.getElementById('student-name').value.trim();
  const letterInput = document.getElementById('student-letter').value.trim();

  if (!nameInput || !letterInput) {
    alert("Пожалуйста, заполните ФИО и букву класса!");
    return;
  }

  studentData.name = nameInput;
  studentData.letter = letterInput.toUpperCase();

  if (authCard) {
    authCard.classList.remove('active');
  }
  userAnswers = []; // сброс ответов
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

      const selectHtmlTemplate = (dropdownIdx) => {
        let html = `<select class="inline-select" data-drop="${dropdownIdx}">`;
        html += `<option value="">Выберите...</option>`;
        q.dropdownOptions.forEach((opt, optIdx) => {
          html += `<option value="${optIdx}">${opt}</option>`;
        });
        html += `</select>`;
        return html;
      };

      q.correctAnswers.forEach((_, dropIdx) => {
        renderedText = renderedText.replace(`{${dropIdx}}`, selectHtmlTemplate(dropIdx));
      });

      content += `<div class="inline-question-block">${renderedText}</div>`;
      content += `<button class="btn next-btn-trigger" style="margin-top: 15px;">Далее</button>`;
    }

    card.innerHTML = content;

    if (q.type === 'inline-dropdown') {
      const nextBtn = card.querySelector('.next-btn-trigger');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => nextStep());
      }
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
  // собираем ответы для текущего шага
  const q = questions[currentStep];
  if (q.type === 'inline-dropdown') {
    const selects = quizContainer.querySelectorAll(`#step-q-${currentStep} .inline-select`);
    const answers = [];
    selects.forEach(sel => {
      answers.push(sel.value);
    });
    userAnswers.push(answers);
  }

  currentStep++;
  showStep(currentStep);
}

function finishQuiz() {
  let totalPoints = 0;
  let maxPoints = 0;

  questions.forEach((q, idx) => {
    maxPoints += q.points || 1;
    if (q.type === 'inline-dropdown' && userAnswers[idx]) {
      // сравниваем массивы ответов
      const isCorrect = userAnswers[idx].every((val, i) => val === String(q.correctAnswers[i]));
      if (isCorrect) {
        totalPoints += q.points || 1;
      }
    }
  });

  studentData.points = totalPoints;
  studentData.maxPoints = maxPoints;

  // здесь можно вывести результат в finalCard и т.п.
  if (finalCard) {
    finalCard.classList.add('active');
    // например: finalCard.innerHTML = `Результат: ${totalPoints} из ${maxPoints}`;
  }
}
