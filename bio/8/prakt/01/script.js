document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const pdfBtn = document.getElementById('pdf-btn');
    const statusMessage = document.getElementById('status-message');
    const allInputs = document.querySelectorAll('table input[type="text"]');
    const allTextareas = document.querySelectorAll('textarea');

    // Сброс красной подсветки при вводе данных
    const clearStatusOnChange = (element) => {
        element.addEventListener('input', () => {
            element.style.borderColor = '';
            element.style.backgroundColor = '';
        });
    };

    allInputs.forEach(clearStatusOnChange);
    allTextareas.forEach(clearStatusOnChange);

    // 1. Кнопка "Проверить работу"
    submitBtn.addEventListener('click', () => {
        let emptyCount = 0;

        allInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                input.style.backgroundColor = '#fef2f2';
                emptyCount++;
            } else {
                input.style.borderColor = '';
                input.style.backgroundColor = '';
            }
        });

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

        statusMessage.classList.remove('hidden', 'success', 'warning');

        if (emptyCount > 0) {
            statusMessage.textContent = `⚠️ Работа не завершена. Осталось заполнить полей: ${emptyCount}.`;
            statusMessage.classList.add('warning');
            pdfBtn.classList.add('hidden'); // Прячем кнопку PDF, если есть ошибки
        } else {
            statusMessage.textContent = '✅ Практическая работа успешно заполнена! Теперь вы можете сохранить её в PDF.';
            statusMessage.classList.add('success');
            pdfBtn.classList.remove('hidden'); // Показываем кнопку PDF
        }
    });

    // 2. Кнопка "Сохранить в PDF"
    pdfBtn.addEventListener('click', () => {
        window.print(); // Запуск стандартного сохранения/печати страницы
    });
});
