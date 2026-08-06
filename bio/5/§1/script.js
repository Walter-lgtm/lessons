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
        correctAnswers:,
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
        if (targetCard) targetCard.classList.add('active');
    } else {
        finishQuiz();
    }
}

function nextStep() {
    const currentQ = questions[currentStep];
    if (currentQ && currentQ.type === 'inline-dropdown') {
        const selects = document.querySelectorAll(`#step-q-${currentStep} .inline-select`);
        let answersArr = [];
        selects.forEach(sel => {
            answersArr.push(sel.value === "" ? null : parseInt(sel.value));
        });
        userAnswers[currentStep] = answersArr;
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
    let score = 0;
    let maxPoints = 0;

    questions.forEach((q, index) => {
        maxPoints += q.points;
        const ans = userAnswers[index];

        if (q.type === 'inline-dropdown' && Array.isArray(ans)) {
            q.correctAnswers.forEach((correctAnsIdx, dropIdx) => {
                if (ans[dropIdx] === correctAnsIdx) {
                    score += 1; 
                }
            });
        }
    });

    studentData.points = score;
    studentData.maxPoints = maxPoints;
    studentData.grade = calculateGrade(score, maxPoints);

    const resName = document.getElementById('res-name');
    const resClass = document.getElementById('res-class');
    const resPoints = document.getElementById('res-points');
    const resMaxPoints = document.getElementById('res-max-points');
    const resGrade = document.getElementById('res-grade');

    if (resName) resName.innerText = studentData.name;
    if (resClass) resClass.innerText = `5-${studentData.letter}`;
    if (resPoints) resPoints.innerText = score;
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
        <p><strong>Ученик(ца):</strong> ${studentData.name}</p>
        <p><strong>Класс:</strong> 5-${studentData.letter}</p>
        <p><strong>Набрано баллов:</strong> ${studentData.points} из ${studentData.maxPoints}</p>
        <p><strong>Оценка:</strong> ${studentData.grade}</p>
        <p style="font-size: 12px; margin-top:5px; color:#555;">Разбалловка: 90%+ — «5», 70%+ — «4密, 50%+ — «3»</p>
        
        <table class="print-table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Задание</th>
                    <th>Результат</th>
                </tr>
            </thead>
            <tbody>`;

    questions.forEach((q, index) => {
        const ans = userAnswers[index];
        let isCorrect = false;
        let details = "";

        if (q.type === 'inline-dropdown') {
            let correctCount = 0;
            q.correctAnswers.forEach((correctAnsIdx, dropIdx) => {
                if (ans && ans[dropIdx] === correctAnsIdx) correctCount++;
            });
            isCorrect = correctCount === q.correctAnswers.length;
            details = `Правильно ${correctCount} из ${q.correctAnswers.length}`;
        }

        const rowClass = isCorrect ? "" : "print-row-wrong";
        html += `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${q.text}</td>
                <td><strong>${details}</strong></td>
            </tr>`;
    });

    html += `</tbody></table>`;
    printZone.innerHTML = html;
}
