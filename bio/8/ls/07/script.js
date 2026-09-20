// === Slide Navigation ===
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let currentSlideIndex = 0;

document.getElementById('totalSlides').textContent = totalSlides;

// Create dots
const dotsContainer = document.getElementById('slideDots');
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}
const dots = document.querySelectorAll('.dot');

function updateSlide() {
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === currentSlideIndex) {
            slide.classList.add('active');
        } else if (i < currentSlideIndex) {
            slide.classList.add('prev');
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });

    document.getElementById('currentSlide').textContent = currentSlideIndex + 1;
    document.getElementById('progressFill').style.width = ((currentSlideIndex + 1) / totalSlides * 100) + '%';

    // Disable buttons at edges
    document.getElementById('prevBtn').disabled = currentSlideIndex === 0;
    document.getElementById('nextBtn').disabled = currentSlideIndex === totalSlides - 1;
}

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= totalSlides) newIndex = totalSlides - 1;
    currentSlideIndex = newIndex;
    updateSlide();
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateSlide();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        changeSlide(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        changeSlide(-1);
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides - 1);
    }
});

// Touch navigation
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slides-container').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.slides-container').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) changeSlide(1);
        else changeSlide(-1);
    }
});

// === Quiz ===
const quizData = [
    {
        question: "Какой способ питания характерен для амёбы обыкновенной?",
        options: [
            "Фотосинтез",
            "Фагоцитоз — захват пищи ложноножками",
            "Поглощение пищи ресничками",
            "Осмотрофное питание"
        ],
        correct: 1
    },
    {
        question: "Через что инфузория-туфелька выделяет непереваренные остатки?",
        options: [
            "Через мембрану",
            "Через сократительную вакуоль",
            "Через порошицу",
            "Через реснички"
        ],
        correct: 2
    },
    {
        question: "Какой тип питания у эвглены зелёной на свету?",
        options: [
            "Только гетеротрофный",
            "Только автотрофный",
            "Смешанный (миксотрофный)",
            "Паразитический"
        ],
        correct: 2
    },
    {
        question: "У какого организма впервые появляется полостное пищеварение?",
        options: [
            "Амёба",
            "Инфузория",
            "Гидра",
            "Эвглена"
        ],
        correct: 2
    },
    {
        question: "Сколько ветвей кишечника у белой планарии?",
        options: [
            "Одна ветвь",
            "Две ветви",
            "Три ветви (одна вперёд, две назад)",
            "Четыре ветви"
        ],
        correct: 2
    },
    {
        question: "Какого отдела пищеварительной трубки НЕТ у дождевого червя?",
        options: [
            "Зоб",
            "Желудок",
            "Печень",
            "Пищевод"
        ],
        correct: 2
    }
];

let quizAnswers = [];

function renderQuiz() {
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '';

    quizData.forEach((item, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = (qIndex + 1) + '. ' + item.question;
        questionDiv.appendChild(questionTitle);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'quiz-options';

        item.options.forEach((option, oIndex) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = option;
            btn.addEventListener('click', () => handleQuizAnswer(qIndex, oIndex, btn, optionsDiv));
            optionsDiv.appendChild(btn);
        });

        questionDiv.appendChild(optionsDiv);
        quizContainer.appendChild(questionDiv);
    });
}

function handleQuizAnswer(qIndex, oIndex, btn, optionsDiv) {
    // Disable all options for this question
    const allOptions = optionsDiv.querySelectorAll('.quiz-option');
    allOptions.forEach(o => {
        o.disabled = true;
    });

    // Mark correct/wrong
    allOptions[quizData[qIndex].correct].classList.add('correct');

    if (oIndex === quizData[qIndex].correct) {
        quizAnswers[qIndex] = true;
    } else {
        quizAnswers[qIndex] = false;
        btn.classList.add('wrong');
    }

    updateQuizResult();
}

function updateQuizResult() {
    const answered = quizAnswers.filter(a => a !== undefined).length;
    const correct = quizAnswers.filter(a => a === true).length;
    const resultDiv = document.getElementById('quizResult');

    if (answered === 0) {
        resultDiv.innerHTML = '';
        return;
    }

    let feedback = '';
    if (answered === quizData.length) {
        if (correct === quizData.length) {
            feedback = '🎉 Отлично! Все ответы верны!';
        } else if (correct >= quizData.length * 0.7) {
            feedback = '👍 Хорошо! Но есть над чем поработать.';
        } else if (correct >= quizData.length * 0.5) {
            feedback = '📚 Неплохо, но стоит повторить материал.';
        } else {
            feedback = '🧐 Нужно ещё раз изучить тему!';
        }
    } else {
        feedback = `Отвечено: ${answered} из ${quizData.length}`;
    }

    resultDiv.innerHTML = `
        <div class="score">Результат: ${correct} / ${quizData.length}</div>
        <div class="feedback">${feedback}</div>
    `;
}

// Init
renderQuiz();
updateSlide();
