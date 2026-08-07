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
    correctAnswers:, // 2 - Рост, 1 - Развитие, 0 - Размножение
    points: 3
  }
];

let currentStep = 0;
let studentData = { name: "", letter: "", points: 0, maxPoints: 0, grade: "" };
let userAnswers = [];

const startBtn = document.getElementById('start-btn');
const printBtn = document.getElementById('print-btn');
const authCard = document.getElementById('step-auth');
const finalCard = document.getElementById('step-final');
const quizContainer = document.getElementById('quiz-container');

if (startBtn) startBtn.addEventListener('click', startQuiz);
if (printBtn) printBtn.addEventListener('click', () => window.print());

function startQuiz() {
  const nameInput = document.getElementById('student-name').value.trim();
  const letterInput = document.getElementById('student-letter').value.trim();

  if (!nameInput || !letterInput) {
    alert("Пожалуйста, заполните ФИО и букву класса!");
    return;
  }

  studentData.name = nameInput;
  studentData.letter = letterInput.toUpperCase();

  if (authCard) authCard.classList.remove('active');
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
      const selectHtmlTemplate = (dropdownIdx) => {
        return `<select class="inline-select" data-drop="${dropdownIdx}">
                  <option value="">Выберите...</option>
                  ${q.dropdownOptions.map((opt, optIdx) => `<option value="${optIdx}">${opt}</option>`).join('')}
                </select>`;
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
    if (targetCard) targetCard.classList.add('active');
  } else {
    finishQuiz();
  }
}

function nextStep() {
  const q = questions[currentStep];
  const targetCard = document.getElementById(`step-q-${currentStep}`);
  
  if (q.type === 'inline-dropdown' && targetCard) {
    const selects = targetCard.querySelectorAll('.inline-select');
    const answers = [];
    selects.forEach(sel => {
      answers.push(sel.value === "" ? null : parseInt(sel.value));
    });
    userAnswers.push(answers);
  }

  currentStep++;
  showStep(currentStep);
}

function calculateGrade(points, max) {
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

  if (finalCard) {
    finalCard.classList.add('active');
  }
}

function generatePrintForm() {
  const printZone = document.getElementById('print-zone');
  if (!printZone) return;

  let html = `
    <div class="print-header">
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
    const isCorrect = correctCount === q.correctAnswers.length;

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
