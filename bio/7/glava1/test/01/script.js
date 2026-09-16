document.addEventListener('DOMContentLoaded', () => {
    // === НАСТРОЙКА ИНТЕГРАЦИИ С GOOGLE ТАБЛИЦЕЙ ===
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeGorkLRvH6PjKdCmiJBMn-_N379ZB1_CUeY4mb-QKfrRZ9Ag/formResponse'; // Вставьте вашу ссылку
    const ENTRY_NAME = 'entry.1115638690';   // ID поля для ФИО
    const ENTRY_CLASS = 'entry.1108561854';  // ID поля для Класса
    const ENTRY_SCORE = 'entry.1447583204';  // ID поля для Чистых Баллов
    const ENTRY_GRADE = 'entry.725792167';  // ID поля для Оценки

    // Правильные ответы (биологические ключи темы "Водоросли")
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

    // Функция безопасной очистки строк для пуленепробиваемого сравнения
    const cleanStr = (str) => str.trim().replace(/\.$/, '').toLowerCase();

    submitBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const studentClass = classInput.value.trim();

        // 1. Проверка заполнения личных данных ученика
        if (!name || !studentClass) {
            showStatus('⚠️ Пожалуйста, заполни свои Фамилию, Имя и Класс перед отправкой!', 'warning');
            if (!name) nameInput.style.borderColor = '#ef4444';
            if (!studentClass) classInput.style.borderColor = '#ef4444';
            return;
        }

        nameInput.style.borderColor = '';
        classInput.style.borderColor = '';

        // 2. Проверка, что отвечены все 10 вопросов
        let answeredCount = 0;
        const totalQuestions = Object.keys(CORRECT_ANSWERS).length;

        for (let i = 1; i <= totalQuestions; i++) {
            if (document.querySelector(`input[name="q${i}"]:checked`)) {
                answeredCount++;
            }
        }

        if (answeredCount < totalQuestions) {
            showStatus(`⚠️ Выполнены не все задания! Отмечено ответов: ${answeredCount} из ${totalQuestions}.`, 'warning');
            return;
        }

        // 3. Проверка ответов и визуальный фидбек
        let correctCount = 0;

        for (let i = 1; i <= totalQuestions; i++) {
            const card = document.querySelector(`.quiz-card[data-q="${i}"]`);
            const selectedRadio = document.querySelector(`input[name="q${i}"]:checked`);
            const feedbackDiv = card.querySelector('.feedback');
            
            feedbackDiv.classList.remove('hidden', 'success-text', 'error-text');
            card.classList.remove('correct-answer', 'wrong-answer');

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
        }

        // Вычисление оценки (10 вопросов: 9-10 = "5", 7-8 = "4", 5-6 = "3")
        let grade = 2;
        const percent = (correctCount / totalQuestions) * 100;
        if (percent >= 90) grade = 5;
        else if (percent >= 70) grade = 4;
        else if (percent >= 50) grade = 3;

        // 4. Скрытая отправка результатов в Google-Форму
        const formData = new FormData();
        formData.append(ENTRY_NAME, name);
        formData.append(ENTRY_CLASS, studentClass);
        formData.append(ENTRY_SCORE, `${correctCount} из ${totalQuestions}`);
        formData.append(ENTRY_GRADE, grade.toString());

        // Защита от спама кликами
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка данных...';

        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(() => {
            showStatus(`🎉 Тест успешно завершен! Твой результат: ${correctCount}/${totalQuestions} (Оценка: ${grade}). Данные отправлены учителю.`, 'success');
            submitBtn.textContent = 'Результаты отправлены';
        })
        .catch(err => {
            console.error('Ошибка отправки:', err);
            showStatus(`❌ Результат проверен: ${correctCount}/${totalQuestions} (Оценка: ${grade}). Но возникла ошибка сети при передаче. Покажи этот экран учителю.`, 'warning');
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
