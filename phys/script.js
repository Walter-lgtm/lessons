let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let studentId = '';
let studentData = {}; // Сюда запишем ФИО и класс после проверки

// 1. Загрузка данных
async function loadTest() {
  try {
    const response = await fetch('data/test_data.json');
    const data = await response.json();
    questions = data.questions;
    document.getElementById('test-title').innerText = data.test_info.title;
  } catch (error) {
    console.error('Ошибка загрузки теста:', error);
    alert('Не удалось загрузить вопросы. Проверьте консоль.');
  }
}

// 2. Экран входа (получение ID)
function startTest() {
  studentId = document.getElementById('studentId').value.trim();
  if (!studentId) {
    alert('Пожалуйста, введите ID ученика');
    return;
  }

  // Здесь можно добавить запрос к базе учеников, чтобы получить ФИО
  // Пока просто сохраняем ID для отправки
  studentData.id = studentId;
  
  showScreen('question-screen');
  renderQuestion();
}

// 3. Отрисовка вопроса
function renderQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById('q-text').innerText = q.text;
  
  const imgContainer = document.getElementById('q-image-container');
  imgContainer.innerHTML = '';
  if (q.image) {
    const img = document.createElement('img');
    img.src = q.image;
    img.className = 'question-img';
    imgContainer.appendChild(img);
  }

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(index + 1, btn); // +1 так как массив с 0
    optionsContainer.appendChild(btn);
  });

  updateNavButtons();
}

// 4. Проверка ответа
function checkAnswer(selectedIndex, btnElement) {
  const correctIndex = questions[currentQuestionIndex].correct_answer;
  
  // Визуализация
  if (selectedIndex === correctIndex) {
    btnElement.classList.add('correct');
    score++;
  } else {
    btnElement.classList.add('wrong');
    // Подсветим правильный
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => {
      const idx = Array.from(allBtns).indexOf(b) + 1;
      if (idx === correctIndex) b.classList.add('correct');
    });
  }

  // Блокируем кнопки
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      renderQuestion();
    } else {
      finishTest();
    }
  }, 1500); // Пауза, чтобы ученик увидел правильный ответ
}

// 5. Навигация
function updateNavButtons() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next'); // В режиме поштучного перехода эта кнопка скрыта или заменена логикой ответа
  
  prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
  // Кнопка "Далее" здесь не нужна, так как переход происходит после выбора ответа
}

function goBack() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

// 6. Финиш и отправка
function finishTest() {
  showScreen('result-screen');
  document.getElementById('final-score').innerText = score;
  document.getElementById('total-questions').innerText = questions.length;
}

async function sendResults() {
  // Сбор данных
  const resultsPayload = {
    id: studentData.id,
    name: studentData.name || "Неизвестно", // Будет заполнено скриптом позже
    grade: studentData.grade || 7,          // Будет заполнено скриптом позже
    score: score,
    total: questions.length,
    answers: questions.map((q, i) => ({
      questionId: q.id,
      selected: null, // Тут сложно отследить без сложной логики, можно сохранить только балл
      correct: q.correct_answer
    }))
  };

  console.log('Отправка данных:', resultsPayload);

  try {
    // ЗАМЕНИ ЭТОТ URL НА URL ТВОЕГО GOOGLE APPS SCRIPT
    const scriptUrl = 'ВАШ_URL_GOOGLE_APPS_SCRIPT_HERE'; 
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultsPayload)
    });

    if (response.ok) {
      alert('Результаты успешно сохранены!');
      window.location.reload(); // Перезагрузка страницы
    } else {
      throw new Error('Ошибка сохранения');
    }
  } catch (e) {
    console.error(e);
    alert('Ошибка при отправке результатов. Проверьте консоль или соединение.');
  }
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Инициализация
loadTest();
