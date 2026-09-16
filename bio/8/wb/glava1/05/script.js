document.addEventListener('DOMContentLoaded', () => {
    // === НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ТАБЛИЦЕЙ ===
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdyXSo2ckUKNmO0SzRZDaZVSkMx95k5CLOB0ujP-m4S9tHr7w/formResponse'; 
    const ENTRY_NAME = 'entry.1245506676';   
    const ENTRY_CLASS = 'entry.1414335318';  
    const ENTRY_SCORE = 'entry.355731812';  
    const ENTRY_GRADE = 'entry.1031192792';  

    // Ключи именно для первого теста (7 вопросов со скриншота)
    const CORRECT_ANSWERS = {
        q1: 'насекомых.',
        q2: 'Неспособность к росту',
        q3: 'Ребра',
        q4: 'Способность к росту',
        q5: 'Опора тела',
        q6: 'рыб.',
        q7: 'шейного отдела.'
    };

    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');
    const nameInput = document.getElementById('student-name');
    const classInput = document.getElementById('student-class');
    const timerClock = document.getElementById('timer-clock');
    const timerBox = document.getElementById('quiz-timer');

    const cleanStr = (str) => str.trim().replace(/\.$/, '').toLowerCase();
    
    // === ЛОГИКА ТАЙМЕРА (5 минут = 300 секунд) ===
    let timeRemaining = 300; 
    let timerInterval = null;

    function startTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerClock.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeRemaining <= 60) {
                timerBox.classList.add('time-warning');
            }

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                processQuiz(true); // Форсированная отправка
            }
        }, 1000);
    }

    startTimer();

    submitBtn.addEventListener('click', () => {
        processQuiz(false);
    });

    function processQuiz(isTimeOver = false) {
        const name = nameInput.value.trim() || (isTimeOver ? "Время истекло (Аноним)" : "");
        const studentClass = classInput.value.trim() || (isTimeOver ? "—" : "");

        if (!isTimeOver && (!name || !studentClass)) {
            showStatus('⚠️ Пожалуйста, заполни свои Фамилию, Имя и Класс перед отправкой!', 'warning');
            if (!name) nameInput.style.borderColor = '#ef4444';
            if (!studentClass) classInput.style.borderColor = '#ef4444';
            return;
        }

        let answeredCount = 0;
        const totalQuestions = Object.keys(CORRECT_ANSWERS).length;

        for (let i = 1; i <= totalQuestions; i++) {
            if (document.querySelector(`input[name="q${i}"]:checked`)) {
                answeredCount++;
            }
        }

        if (!isTimeOver && answeredCount < totalQuestions) {
            showStatus(`⚠️ Выполнены не все задания! Отмечено ответов: ${answeredCount} из ${totalQuestions}.`, 'warning');
            return;
        }

        clearInterval(timerInterval);
        timerBox.style.display = 'none';

        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = true);

        let correctCount = 0;

        for (let i = 1; i <= totalQuestions; i++) {
            const card = document.querySelector(`.quiz-card[data-q="${i}"]`);
            const selectedRadio = document.querySelector(`input[name="q${i}"]:checked`);
            const feedbackDiv = card.querySelector('.feedback');
            
            feedbackDiv.classList.remove('hidden', 'success-text', 'error-text');
            card.classList.remove('correct-answer', 'wrong-answer');

            if (selectedRadio) {
                if (cleanStr(selectedRadio.value) === cleanStr(CORRECT_ANSWERS[`q${i}`])) {
                    correctCount++;
                    card.classList.add('correct-answer');
                    feedbackDiv.textContent = '✅ Верно!';
                    feedbackDiv.classList.add('success-text');
                } else {
                    card.classList.add('wrong-answer');
                    feedbackDiv.textContent = `❌ Неверно. Правильный ответ: ${CORRECT_ANSWERS[`q${i}`]}`;
                    feedbackDiv.classList.add('error-text');
                }
            } else {
                card.classList.add('wrong-answer');
                feedbackDiv.textContent = `❌ Нет ответа. Правильный ответ: ${CORRECT_ANSWERS[`q${i}`]}`;
                feedbackDiv.classList.add('error-text');
            }
        }

        // Оценка для 7 вопросов (6-7 = "5", 5 = "4", 4 = "3")
        let grade = 2;
        const percent = (correctCount / totalQuestions) * 100;
        if (percent >= 85) grade = 5;
        else if (percent >= 70) grade = 4;
        else if (percent >= 50) grade = 3;

        const formData = new FormData();
        formData.append(ENTRY_NAME, name);
        formData.append(ENTRY_CLASS, studentClass);
        formData.append(ENTRY_SCORE, `${correctCount} из ${totalQuestions}`);
        formData.append(ENTRY_GRADE, grade.toString());

        submitBtn.disabled = true;
        submitBtn.textContent = 'Результаты зафиксированы';

        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(() => {
            const msgPrefix = isTimeOver ? '⏰ Время истекло! ' : '🎉 Тест успешно завершен! ';
            showStatus(`${msgPrefix} Твой результат: ${correctCount}/${totalQuestions} (Оценка: ${grade}). Данные отправлены учителю.`, 'success');
        })
        .catch(err => {
            console.error('Ошибка отправки:', err);
            showStatus(`❌ Результат зафиксирован: ${correctCount}/${totalQuestions} (Оценка: ${grade}). Ошибка сети при передаче. Покажи экран учителю.`, 'warning');
        });
    }

    function showStatus(text, type) {
        statusMessage.textContent = text;
        statusMessage.classList.remove('hidden', 'success', 'warning');
        statusMessage.classList.add(type);
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
