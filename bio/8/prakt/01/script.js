document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');
    const allInputs = document.querySelectorAll('table input[type="text"]');
    const allTextareas = document.querySelectorAll('textarea');

    // Функция сброса стилей валидации при изменении полей
    const clearStatusOnChange = (element) => {
        element.addEventListener('input', () => {
            element.style.borderColor = '';
            element.style.backgroundColor = '';
        });
    };

    allInputs.forEach(clearStatusOnChange);
    allTextareas.forEach(clearStatusOnChange);

    // Обработчик проверки формы
    submitBtn.addEventListener('click', () => {
        let emptyCount = 0;

        // 1. Проверяем инпуты в таблицах
        allInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444'; // красный цвет рамки
                input.style.backgroundColor = '#fef2f2'; // светло-красный фон
                emptyCount++;
            } else {
                input.style.borderColor = '';
                input.style.backgroundColor = '';
            }
        });

        // 2. Проверяем текстовые поля ответов и вывода
        allTextareas.forEach(textarea => {
            if (!textarea.value.trim()) {
                textarea.style.borderColor = '#ef4444';
                textarea.style.backgroundColor = '#fef2f2';
                emptyCount++;
            } else {
                textarea.style.borderColor = '';
                textarea.style.backgroundColor = '';
            }
        });

        // 3. Выводим итоговый статус
        statusMessage.classList.remove('hidden', 'success', 'warning');

        if (emptyCount > 0) {
            statusMessage.textContent = `⚠️ Работа не завершена. Осталось заполнить полей: ${emptyCount}.`;
            statusMessage.classList.add('warning');
        } else {
            statusMessage.textContent = '✅ Практическая работа успешно заполнена и готова к отправке!';
            statusMessage.classList.add('success');
            
            // Здесь при необходимости можно добавить отправку данных на сервер или сохранение в LocalStorage
        }
    });
});
