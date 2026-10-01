// ──────────────────────────────────────────────────────────────
//  Вопросы и ответы (тема: Кровообращение у позвоночных, 8 кл)
// ──────────────────────────────────────────────────────────────
const quizData = [
  {
    question: "У рыб кровеносная система:",
    options: [
      "замкнутая, один круг кровообращения",
      "незамкнутая, два круга кровообращения",
      "замкнутая, два круга кровообращения",
      "незамкнутая, один круг кровообращения"
    ],
    correct: 0,
    explanation: "У рыб замкнутая кровеносная система и один круг кровообращения: сердце двухкамерное, кровь проходит через жабры и ткани."
  },
  {
    question: "Сердце земноводных:",
    options: [
      "двухкамерное",
      "трёхкамерное без перегородки",
      "трёхкамерное с неполной перегородкой",
      "четырёхкамерное"
    ],
    correct: 1,
    explanation: "У земноводных сердце трёхкамерное (2 предсердия, 1 желудочек) без перегородки — кровь смешивается."
  },
  {
    question: "У пресмыкающихся (кроме крокодилов) в желудочке сердца:",
    options: [
      "нет перегородки",
      "есть полная перегородка",
      "есть неполная перегородка",
      "желудочек разделён на два"
    ],
    correct: 2,
    explanation: "У большинства пресмыкающихся в желудочке есть неполная перегородка — это уменьшает смешивание артериальной и венозной крови."
  },
  {
    question: "У птиц и млекопитающих:",
    options: [
      "один круг кровообращения",
      "два круга кровообращения, сердце трёхкамерное",
      "два круга кровообращения, сердце четырёхкамерное",
      "один круг, сердце четырёхкамерное"
    ],
    correct: 2,
    explanation: "Птицы и млекопитающие имеют два круга кровообращения и четырёхкамерное сердце — артериальная и венозная кровь не смешиваются."
  },
  {
    question: "Артерии — это сосуды, которые:",
    options: [
      "всегда несут артериальную кровь",
      "всегда несут венозную кровь",
      "несут кровь от сердца",
      "несут кровь к сердцу"
    ],
    correct: 2,
    explanation: "Артерии несут кровь от сердца (независимо от её типа). Например, лёгочная артерия несёт венозную кровь."
  }
];

// ──────────────────────────────────────────────────────────────
//  Настройки Google Формы — ЗАМЕНИТЕ НА СВОИ ЗНАЧЕНИЯ
// ──────────────────────────────────────────────────────────────
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd0v9FjkSy6oXk1tNjNSO1KHUCVFwobADU6bqRDU8o05wG6KQ/formResponse";

const ENTRY_NAME   = "entry.1397607906";  // ← ID поля "ФИО"
const ENTRY_CLASS  = "entry.1263138614";  // ← ID поля "Класс"
const ENTRY_POINTS = "entry.1408807663";  // ← ID поля "Баллы"
const ENTRY_GRADE  = "entry.1385354300";  // ← ID поля "Оценка"

// ──────────────────────────────────────────────────────────────
//  Логика приложения
// ──────────────────────────────────────────────────────────────
let answers = [];

function init() {
  document.getElementById("student-form").addEventListener("submit", startQuiz);
  document.getElementById("check-btn").addEventListener("click", checkAnswers);
  document.getElementById("restart-btn").addEventListener("click", restartQuiz);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
}

function startQuiz(e) {
  e.preventDefault();
  const name = document.getElementById("student-name").value.trim();
  const cls  = document.getElementById("student-class").value.trim();

  if (!name || !cls) {
    alert("Пожалуйста, заполните ФИО и класс.");
    return;
  }

  answers = Array(quizData.length).fill(null);
  renderQuiz();
  showScreen("quiz-screen");
}

function renderQuiz() {
  const container = document.getElementById("question-block");
  container.innerHTML = "";

  quizData.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "question-card";

    const qText = document.createElement("div");
    qText.className = "question-text";
    qText.textContent = `${idx + 1}. ${q.question}`;

    const list = document.createElement("ul");
    list.className = "options-list";

    q.options.forEach((opt, optIdx) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.dataset.index = optIdx;
      li.addEventListener("click", () => selectOption(li, idx, optIdx));
      list.appendChild(li);
    });

    card.appendChild(qText);
    card.appendChild(list);
    container.appendChild(card);
  });
}

function selectOption(element, questionIndex, optionIndex) {
  const parent = element.parentElement;
  parent.querySelectorAll("li").forEach(li => li.classList.remove("selected"));
  element.classList.add("selected");
  answers[questionIndex] = optionIndex;
}

function checkAnswers() {
  // Проверяем, что на все вопросы дан ответ
  const unanswered = answers.findIndex(a => a === null);
  if (unanswered !== -1) {
    alert(`Ответьте на вопрос №${unanswered + 1}, пожалуйста.`);
    return;
  }

  let score = 0;
  const feedback = [];

  quizData.forEach((q, idx) => {
    if (answers[idx] === q.correct) {
      score++;
    } else {
      feedback.push({
        question:       q.question,
        selectedAnswer: q.options[answers[idx]],
        correctAnswer:  q.options[q.correct],
        explanation:    q.explanation
      });
    }
  });

  const grade = getGrade(score, quizData.length);

  sendToGoogleForm(score, grade);
  showFeedback(feedback);
  showResults(score, grade, feedback);

  // Прячем кнопку «Проверить», показываем «Далее» (на случай повторного показа)
  document.getElementById("check-btn").classList.add("hidden");
  document.getElementById("next-btn").classList.remove("hidden");
}

function getGrade(points, total) {
  const percent = (points / total) * 100;
  if (percent >= 90) return "5";
  if (percent >= 70) return "4";
  if (percent >= 50) return "3";
  return "2";
}

// ─── Отправка в Google Форму ───────────────────────────────────
function sendToGoogleForm(points, grade) {
  const name = document.getElementById("student-name").value;
  const cls  = document.getElementById("student-class").value;

  const formData = new FormData();
  formData.append(ENTRY_NAME,   name);
  formData.append(ENTRY_CLASS,   cls);
  formData.append(ENTRY_POINTS,  points);
  formData.append(ENTRY_GRADE,   grade);

  fetch(GOOGLE_FORM_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).catch(() => {
    console.log("Отправка в Google Форму завершена (no-cors).");
  });
}

// ─── Вывод обратной связи на экране теста ───────────────────────
function showFeedback(feedback) {
  const fbArea = document.getElementById("feedback-area");
  fbArea.innerHTML = "";
  fbArea.className = "feedback";

  if (feedback.length > 0) {
    fbArea.classList.add("error");
    fbArea.style.display = "block";

    const title = document.createElement("p");
    title.innerHTML = `<strong>Допущены ошибки. Разбор:</strong>`;
    fbArea.appendChild(title);

    const ul = document.createElement("ul");
    feedback.forEach(f => {
      const li = document.createElement("li");
      li.innerHTML =
        `<strong>${f.question}</strong><br>` +
        `Ваш ответ: <em>${f.selectedAnswer}</em><br>` +
        `Правильный ответ: ${f.correctAnswer}<br>` +
        `<small>${f.explanation}</small>`;
      ul.appendChild(li);
    });
    fbArea.appendChild(ul);
  } else {
    fbArea.classList.add("success");
    fbArea.style.display = "block";
    fbArea.textContent = "Все ответы верны! Отличная работа 🎉";
  }
}

// ─── Экран результатов ──────────────────────────────────────────
function showResults(score, grade, feedback) {
  const content = document.getElementById("results-content");
  content.innerHTML = `
    <p>Баллы: <strong>${score} из ${quizData.length}</strong></p>
    <p>Оценка: <strong>${grade}</strong></p>
    ${feedback.length ? "<p>Разбор ошибок:</p>" : ""}
    <table class="results-table">
      <thead>
        <tr>
          <th>Вопрос</th>
          <th>Правильный ответ</th>
          <th>Пояснение</th>
        </tr>
      </thead>
      <tbody>
        ${feedback.map(f => `
          <tr>
            <td>${f.question}</td>
            <td>${f.correctAnswer}</td>
            <td>${f.explanation}</td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;
  showScreen("results-screen");
}

function restartQuiz() {
  document.getElementById("student-form").reset();
  answers = [];
  document.getElementById("check-btn").classList.remove("hidden");
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("feedback-area").style.display = "none";
  document.getElementById("feedback-area").className = "feedback";
  showScreen("start-screen");
}

init();
