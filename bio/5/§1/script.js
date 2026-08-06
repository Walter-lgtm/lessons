// Пока что здесь пустая база вопросов. Как только вы скинете фото, я наполню этот массив реальными данными!
const questions = [
    {
        type: "single", // Один вариант
        text: "Пример вопроса: Что изучает биология?",
        options: ["Машины", "Живую природу", "Звезды", "Минералы"],
        correct: 1, // Индекс правильного ответа (с нуля)
        points: 1
    }
];

let currentStep = 0;
let studentData = { name: "", letter: "", points: 0, maxPoints: 0, grade: "" };
let userAnswers = [];

// Элементы интерфейса
const startBtn = document.getElementById('start-btn');
const printBtn = document.getElementById('print-btn');
const authCard = document.getElementById('step-auth');
const finalCard = document.getElementById('step-final');
const quizContainer = document.getElementById('quiz-container');

startBtn.addEventListener('click', startQuiz);
printBtn.addEventListener('click', () => window.print());

function startQuiz() {
    const nameInput = document.getElementById('student-name').value.trim();
    const letterInput = document.getElementById('student-letter').value.trim();

    if (!nameInput || !letterInput) {
        alert("Пожалуйста, заполните ФИО и букву класса!");
        return;
    }

    studentData.name = nameInput;
    studentData.letter = letterInput.toUpperCase();

    authCard.classList.remove('active');
    renderQuiz();
    showStep(0);
}

function renderQuiz() {
    quizContainer.innerHTML = "";
    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = `card q-card`;
        card.id = `step-q-${index}`;

        let content = `<div class="question-text">Задание №${index + 1}. ${q.text}</div>`;
        
        if (q.img) {
            content += `<img src="${q.img}" class="question-img" alt="Иллюстрация">`;
        }

        if (q.type === 'single') {
            content += `<ul class="options-list">`;
            q.options.forEach((opt, oIdx) => {
                content += `<li class="option-item" onclick="selectSingle(${index}, ${oIdx})">${opt}</li>`;
            });
            content += `</ul>`;
        }
        
        card.innerHTML = content;
        quizContainer.appendChild(card);
    });
}

function showStep(stepIndex) {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => c.classList.remove('active'));

    if (stepIndex < questions.length) {
        document.getElementById(`step-q-${stepIndex}`).classList.add('active');
    } else {
        finishQuiz();
    }
}

function selectSingle(qIdx, optIdx) {
    userAnswers[qIdx] = optIdx;
    
    // Эффект выделения перед автопереходом
    const items = document.querySelectorAll(`#step-q-${qIdx} .option-item`);
    items.forEach((item, i) => {
        if(i === optIdx) item.classList.add('selected');
    });

    // Автопереход через полсекунды
    setTimeout(() => {
        currentStep++;
        showStep(currentStep);
    }, 500);
}

function calculateGrade(points, max) {
    const percent = (points / max) * 100;
    if (percent >= 90) return "5";
    if (percent >= 70) return "4";
    if (percent >= 50) return "3";
    return "2";
}

function finishQuiz() {
    let score = 0;
    let maxPoints = 0;

    questions.forEach((q, index) => {
        maxPoints += q.points;
        if (q.type === 'single' && userAnswers[index] === q.correct) {
            score += q.points;
        }
    });

    studentData.points = score;
    studentData.maxPoints = maxPoints;
    studentData.grade = calculateGrade(score, maxPoints);

    // Заполнение финального экрана
    document.getElementById('res-name').innerText = studentData.name;
    document.getElementById('res-class').innerText = `5-${studentData.letter}`;
    document.getElementById('res-points').innerText = score;
    document.getElementById('res-max-points').innerText = maxPoints;
    document.getElementById('res-grade').innerText = studentData.grade;

    // Сборка печатной ведомости (PDF)
    generatePrintForm();

    // Сюда мы позже прикрутим отправку в Google Таблицу
    sendToGoogleSheets(studentData);

    finalCard.classList.add('active');
}

function generatePrintForm() {
    const printZone = document.getElementById('print-zone');
    let html = `
        <div class="print-header">
            <h1>РЕЗУЛЬТАТЫ ВЫПОЛНЕНИЯ ЗАДАНИЯ</h1>
            <p><strong>Предмет:</strong> Биология (5 класс)</p>
            <p><strong>Тема:</strong> §1. Живая и неживая природа — единое целое?</p>
        </div>
        <p><strong>Ученик(ца):</strong> ${studentData.name}</p>
        <p><strong>Класс:</strong> 5-${studentData.letter}</p>
        <p><strong>Набрано баллов:</strong> ${studentData.points} из ${studentData.maxPoints}</p>
        <p><strong>Оценка:</strong> ${studentData.grade}</p>
        <p style="font-size: 12px; margin-top:5px; color:#555;">Разбалловка: 90%+ — «5», 70%+ — «4», 50%+ — «3»</p>
        
        <table class="print-table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Задание</th>
                    <th>Результат</th>
                </tr>
            </thead>
            <tbody>;`

    questions.forEach((q, index) => {
        const isCorrect = userAnswers[index] === q.correct;
        const statusText = isCorrect ? "Верно" : "Ошибка";
        const rowClass = isCorrect ? "" : "print-row-wrong";
        html += `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${q.text}</td>
                <td><strong>${statusText}</strong></td>
            </tr>`;
    });

    html += `</tbody></table>`;
    printZone.innerHTML = html;
}

function sendToGoogleSheets(data) {
    console.log("Данные готовы к отправке в таблицы:", data);
    // Логику отправки подключим сразу после настройки скрипта таблиц
}
