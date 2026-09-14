document.addEventListener('DOMContentLoaded', () => {
    // === НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ТАБЛИЦЕЙ ===
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdyXSo2ckUKNmO0SzRZDaZVSkMx95k5CLOB0ujP-m4S9tHr7w/formResponse'; // Вставьте вашу ссылку
    const ENTRY_NAME = 'entry.1245506676';   // ID поля для ФИО
  const ENTRY_CLASS = 'entry.1414335318';  // ID поля для Класса  
  const ENTRY_SCORE = 'entry.355731812';  // ID поля для Баллов (например: 6 из 7)
const ENTRY_GRADE = 'entry.1031192792';  // ID поля для Оценки (например: 5, 4, 3)

    // Правильные ответы (ключи теста)
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

    submitBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const studentClass = classInput.value.trim();

        // 1. Валидация ввода данных ученика
        if (!name || !studentClass) {
            showStatus('⚠️ Пожалуйста, заполни свои Фамилию, Имя и Класс перед отправкой!', 'warning');
            if (!name) nameInput.style.borderColor = '#ef4444';
            if (!studentClass) classInput.style.borderColor = '#ef4444';
            return;
        }

        // Сброс рамок ввода
        nameInput.style.borderColor = '';
        classInput.style.borderColor = '';

        // 2. Проверка заполненности всех вопросов
        let answeredCount = 0;
        const totalQuestions = Object.keys(CORRECT_ANSWERS).length;

        for (let i = 1; i <= totalQuestions; i++) {
            if (document.querySelector(`input[name="q${i}"]:checked`)) {
                answeredCount++;
            }
        }

        if (answeredCount < totalQuestions) {
            showStatus(`⚠️ Выполнены не все задания! Найдено ответов: ${answeredCount} из ${totalQuestions}.`, 'warning');
            return;
        }

        // 3. Подсчет правильных ответов и вывод фидбека по каждому вопросу
        let correctCount = 0;

        for (let i = 1; i <= totalQuestions; i++) {
            const card = document.querySelector(`.quiz-card[data-q="${i}"]`);
            const selectedRadio = document.querySelector(`input[name="q${i}"]:checked`);
            const feedbackDiv = card.querySelector('.feedback');
            
            feedbackDiv.classList.remove('hidden', 'success-text', 'error-text');
            card.classList.remove('correct-answer', 'wrong-answer');

            // Безопасное очищение строк от точек, пробелов на концах и приведение к нижнему регистру
            const cleanUserAnswer = selectedRadio.value.trim().replace(/\.$/, '').toLowerCase();
            const cleanCorrectAnswer = CORRECT_ANSWERS[`q${i}`].trim().replace(/\.$/, '').toLowerCase();

            if (cleanUserAnswer === cleanCorrectAnswer) {
                correctCount++;
                card.classList.add('correct-answer');
                feedbackDiv.textContent = '✅ Верно!';
                feedbackDiv.classList.add('success-text');
            } else {
                card.classList.add('wrong-answer');
                // Выводим текст ответа красиво, как он зашит в ключах
                feedbackDiv.textContent = `❌ Неверно. Правильный ответ: ${CORRECT_ANSWERS[`q${i}`]}`;
                feedbackDiv.classList.add('error-text');
            }
        }

        // Вычисление школьной оценки (пятибалльная система)
        let grade = 2;
        const percent = (correctCount / totalQuestions) * 100;
        if (percent >= 90) grade = 5;
        else if (percent >= 70) grade = 4;
        else if (percent >= 50) grade = 3;

        const resultText = `Результат: ${correctCount} из ${totalQuestions} баллов. Оценка: ${grade}`;

        /// 4. Скрытая отправка данных в Google-Форму
const formData = new FormData();
formData.append(ENTRY_NAME, name);
formData.append(ENTRY_CLASS, studentClass);
formData.append(ENTRY_SCORE, `${correctCount} из ${totalQuestions}`); // Отправляем чистые баллы
formData.append(ENTRY_GRADE, grade.toString()); // Отправляем чистую оценку (цифру)

        // Отключаем кнопку, чтобы избежать повторных отправк
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка данных...';

        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(() => {
            showStatus(`🎉 Тест завершен! Твой результат: ${correctCount}/${totalQuestions} (Оценка: ${grade}). Данные успешно занесены в журнал учителя.`, 'success');
            submitBtn.textContent = 'Результаты отправлены';
        })
        .catch(err => {
            console.error('Ошибка отправки:', err);
            showStatus(`❌ Произошла техническая ошибка при отправке ответов, но твой результат проверен: ${correctCount}/${totalQuestions} (Оценка: ${grade}). Покажи этот экран учителю.`, 'warning');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Попробовать отправить снова';
        });
    });

    function showStatus(text, type) {
        statusMessage.textContent = text;
        statusMessage.classList.remove('hidden', 'success', 'warning');
        statusMessage.classList.add(type);
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
