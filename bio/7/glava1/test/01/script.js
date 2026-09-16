document.addEventListener('DOMContentLoaded', () => {
    // === НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ТАБЛИЦЕЙ ===
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeGorkLRvH6PjKdCmiJBMn-_N379ZB1_CUeY4mb-QKfrRZ9Ag/formResponse'; 
    const ENTRY_NAME = 'entry.1115638690';   
    const ENTRY_CLASS = 'entry.1108561854';  
    const ENTRY_SCORE = 'entry.1447583204';  
    const ENTRY_GRADE = 'entry.725792167';  

    const CORRECT_ANSWERS = {
        q1: 'В их клетках происходит фотосинтез',
        q2: 'клеточное строение',
        q3: 'Улотрикс',
        q4: 'У водорослей',
        q5: 'К низшим',
        q6: 'Одной клеткой',
        q7: 'Ризоидов',
        q8: 'Слоевища и ризоидов',
        q9: 'Всем телом',
        q10: 'Сахар'
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
            
            // Форматирование времени в MM:SS
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerClock.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Предупреждение, если осталось меньше минуты
            if (timeRemaining <= 60) {
                timerBox.classList.add('time-warning');
            }

            // Время вышло
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                processQuiz(true); // Форсированная отправка
            }
        }, 1000);
    }

    // Запускаем таймер сразу после загрузки страницы
    startTimer();

    // Слушатель на кнопку ручной отправки
    submitBtn.addEventListener('click', () => {
        processQuiz(false);
    });

    // Основная функция обработки и отправки теста
    function processQuiz(isTimeOver = false) {
        const name = nameInput.value.trim() || (isTimeOver ? "Время истекло (Аноним)" : "");
        const studentClass = classInput.value.trim() || (isTimeOver ? "—" : "");

        // Если ученик отправляет сам, проверяем заполнение ФИО
        if (!isTimeOver && (!name || !studentClass)) {
            showStatus('⚠️ Пожалуйста, заполни свои Фамилию, Имя и Класс перед отправкой!', 'warning');
            if (!name) nameInput.style.borderColor = '#ef4444';
            if (!studentClass) classInput.style.borderColor = '#ef4444';
            return;
        }

        // Если отправляет сам, проверяем, что ответил на ВСЕ вопросы
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

        // Останавливаем таймер, если отправка произошла вручную
        clearInterval(timerInterval);
        timerBox.style.display = 'none';

        // Блокируем все радиокнопки, чтобы нельзя было изменить ответы
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = true);

        // Подсчет результатов
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
                // Если время вышло, а ответа нет
                card.classList.add('wrong-answer');
                feedbackDiv.textContent = `❌ Нет ответа. Правильный ответ: ${CORRECT_ANSWERS[`q${i}`]}`;
                feedbackDiv.classList.add('error-text');
            }
        }

        // Оценка
        let grade = 2;
        const percent = (correctCount / totalQuestions) * 100;
        if (percent >= 90) grade = 5;
        else if (percent >= 70) grade = 4;
        else if (percent >= 50) grade = 3;

        // Сбор данных
        const formData = new FormData();
        formData.append(ENTRY_NAME, name);
        formData.append(ENTRY_CLASS, studentClass);
        formData.append(ENTRY_SCORE, `${correctCount} из ${totalQuestions}`);
        formData.append(ENTRY_GRADE, grade.toString());

        submitBtn.disabled = true;
        submitBtn.textContent = 'Результаты зафиксированы';

        // Отправка данных
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
