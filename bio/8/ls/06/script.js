document.addEventListener('DOMContentLoaded', () => {
    // === НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ТАБЛИЦЕЙ ===
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfo0K7JySzAf5yFSXPsaO5MvadTm4i6Mx8oCdAw7_0UjZTHqw/formResponse'; // Вставьте вашу ссылку
    const ENTRY_NAME = 'entry.1348655516';   // ID поля для ФИО
    const ENTRY_CLASS = 'entry.1044871766';  // ID поля для Класса
    const ENTRY_SCORE = 'entry.1931539764';  // ID поля для Чистых Баллов
    const ENTRY_GRADE = 'entry.111597408';  // ID поля для Оценки

    // Правильные ответы (биологические ключи темы "Питание и пищеварение")
    const CORRECT_ANSWERS = {
        q1: 'порошицу',
        q2: 'кишечная',
        q3: 'радула',
        q4: 'железистый',
        q5: 'четыре'
    };

    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');
    const nameInput = document.getElementById('student-name');
    const classInput = document.getElementById('student-class');
    const timerClock = document.getElementById('timer-clock');
    const timerBox = document.getElementById('quiz-timer');

    // Функция безопасной очистки строк для пуленепробиваемого сравнения
    const cleanStr = (str) => str.trim().replace(/\.\$/, '').toLowerCase();
    
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
                processQuiz(true); // Форсированная автоматическая отправка
            }
        }, 1000);
    }

    // Запуск отсчета
    startTimer();

    // Ручная отправка по кнопке
    submitBtn.addEventListener('click', () => {
        processQuiz(false);
    });

    // Главная функция обработки и отправки теста
    function processQuiz(isTimeOver = false) {
        const name = nameInput.value.trim() || (isTimeOver ? "Время истекло (Аноним)" : "");
        const studentClass = classInput.value.trim() || (isTimeOver ? "—" : "");

        // Если ученик отправляет сам, проверяем заполнение ФИО и класса
        if (!isTimeOver && (!name || !studentClass)) {
            showStatus('⚠️ Пожалуйста, заполни свои Фамилию, Имя и Класс перед отправкой!', 'warning');
            if (!name) nameInput.style.borderColor = '#ef4444';
            if (!studentClass) classInput.style.borderColor = '#ef4444';
            return;
        }

        // Если ученик отправляет сам, проверяем, что отвечено на ВСЕ вопросы
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

        // Останавливаем таймер и скрываем его блок
        clearInterval(timerInterval);
        timerBox.style.display = 'none';

        // Замораживаем интерфейс радиокнопок
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = true);

        // Проверка правильности
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
                    feedbackDiv.textContent = `❌ Неверно. Правильный ответ: ${CORRECT_ANSWERS['q' + i]}`;
                    feedbackDiv.classList.add('error-text');
                }
            } else {
                card.classList.add('wrong-answer');
                feedbackDiv.textContent = `❌ Нет ответа. Правильный ответ: ${CORRECT_ANSWERS['q' + i]}`;
                feedbackDiv.classList.add('error-text');
            }
        }

        // Шкала оценок для 5 вопросов: 5 верных = "5", 4 верных = "4", 3 верных = "3", меньше = "2"
        let grade = 2;
        if (correctCount === 5) grade = 5;
        else if (correctCount === 4) grade = 4;
        else if (correctCount === 3) grade = 3;

        // Формирование данных формы
        const formData = new FormData();
        formData.append(ENTRY_NAME, name);
        formData.append(ENTRY_CLASS, studentClass);
        formData.append(ENTRY_SCORE, `${correctCount} из ${totalQuestions}`);
        formData.append(ENTRY_GRADE, grade.toString());

        submitBtn.disabled = true;
        submitBtn.textContent = 'Результаты зафиксированы';

        // Отправка запроса в Google Forms
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
            showStatus(`❌ Результат зафиксирован: ${correctCount}/${totalQuestions} (Оценка: ${grade}). Ошибка сети при передаче. Пожалуйста, покажи этот экран учителю.`, 'warning');
        });
    }

    function showStatus(text, type) {
        statusMessage.textContent = text;
        statusMessage.classList.remove('hidden', 'success', 'warning');
        statusMessage.classList.add(type);
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
