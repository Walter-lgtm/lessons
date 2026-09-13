// ===================================================
// КИБЕРМАГИЯ ЛОКИ: ЛОГИКА АДАПТИВНОГО КРОССВОРДА
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ База данных кроссворда Асгарда успешно развернута!");

    // 1. БАЗА ПРАВИЛЬНЫХ ОТВЕТОВ (КЛЮЧИ КРОССВОРДА)
    const crosswordAnswers = {
        h1: "ГЕНЕТИК",
        h2: "ЭКОЛОГИЯ",
        h3: "БОТАНИК",
        h4: "МОРФОЛОГИЯ",
        h5: "АНАТОМИЯ",
        v6: "БИОЛОГИЯ",
        v7: "МИКРОБИОЛОГИЯ",
        v8: "СЕЛЕКЦИЯ",
        v9: "ЗООЛОГИЯ",
        v10: "ГРИБЫ",
        v11: "ФИЗИОЛОГИЯ"
    };

    // Объект для хранения ответов ученика (изначально пустой)
    let studentAnswers = {
        h1: "", h2: "", h3: "", h4: "", h5: "",
        v6: "", v7: "", v8: "", v9: "", v10: "", v11: ""
    };

    // Переменная для отслеживания текущего выбранного вопроса
    let currentQuestionId = null;

    // Ссылки на элементы интерфейса
    const qItems = document.querySelectorAll('.q-item');
    const inputModal = document.getElementById('input-modal');
    const modalQuestionText = document.getElementById('modal-question-text');
    const userAnswerInput = document.getElementById('user-answer-input');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const checkAllBtn = document.getElementById('check-all-btn');
    const lokiText = document.getElementById('loki-text');

    // 2. ОТКРЫТИЕ МОДАЛЬНОГО ОКНА ПРИ ТАПЕ НА ВОПРОС
    qItems.forEach(item => {
        item.addEventListener('click', () => {
            currentQuestionId = item.getAttribute('data-id');
            
            // Берем текст вопроса и выводим его в модальное окно
            modalQuestionText.textContent = item.textContent;
            
            // Подставляем ранее введенный ответ ученика (если он был)
            userAnswerInput.value = studentAnswers[currentQuestionId];
            
            // Показываем модальное окно
            inputModal.classList.remove('hidden');
            
            // Фокусируемся на поле ввода (удобно для ПК и мобильных клавиатур)
            setTimeout(() => userAnswerInput.focus(), 100);
        });
    });

    // 3. ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА (ОТМЕНА)
    modalCancelBtn.addEventListener('click', () => {
        inputModal.classList.add('hidden');
        userAnswerInput.value = "";
    });

    // 4. СОХРАНЕНИЕ ОТВЕТА (КНОПКА "ЗАПИСАТЬ")
    modalSaveBtn.addEventListener('click', saveAnswer);

    // Дополнительно: сохранение при нажатии Enter на клавиатуре телефона/ПК
    userAnswerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveAnswer();
    });

    function saveAnswer() {
        if (!currentQuestionId) return;

        // Берем текст, убираем лишние пробелы по бокам и переводим в КАПС
        let processedValue = userAnswerInput.value.trim().toUpperCase();

        // Сохраняем в память приложения
        studentAnswers[currentQuestionId] = processedValue;

        // Находим текущий вопрос в списке на экране
        const currentItem = document.querySelector(`.q-item[data-id="${currentQuestionId}"]`);

        // Локальная интерактивная проверка: если слово совпало с базой Асгарда
        if (processedValue === crosswordAnswers[currentQuestionId]) {
            currentItem.classList.add('solved'); // Окрашиваем вопрос в зеленый
        } else {
            currentItem.classList.remove('solved'); // Снимаем окраску, если исправили на неверное
        }

        // Закрываем окно
        inputModal.classList.add('hidden');
        userAnswerInput.value = "";
        
        // Маленький подбадривающий комментарий от Локи при каждом ответе
        lokiText.innerHTML = "«Так-так, ответ записан в свитки! Давай проверим остальные дисциплины!»";
        lokiText.style.color = "#a3c2b2";
    }

    // 5. ИТОГОВАЯ ПРОВЕРКА ВСЕГО КРОССВОРДА (КНОПКА "ПРОВЕРИТЬ БИОМАГИЮ")
    checkAllBtn.addEventListener('click', () => {
        let allCorrect = true;
        let solvedCount = 0;

        // Проверяем каждое слово по базе данных
        for (let key in crosswordAnswers) {
            if (studentAnswers[key] === crosswordAnswers[key]) {
                solvedCount++;
            } else {
                allCorrect = false;
            }
        }

        // Логика финала домашней работы
        if (allCorrect) {
            // Эффект полной победы
            lokiText.innerHTML = "«🚨 НЕВЕРОЯТНО! Все 11 дисциплин угаданы верно! Смертные пятиклассники превзошли Тора в знаниях! Домашка выполнена на отлично! Ступайте с миром!»";
            lokiText.style.color = "#00ff88"; // Текст Локи становится победно-зеленым
            checkAllBtn.style.display = "none"; // Прячем кнопку, так как всё решено
            
            // Запускаем праздничную вспышку на кнопке "Назад"
            const backBtn = document.querySelector('.back-to-menu-btn');
            if (backBtn) backBtn.style.boxShadow = '0 0 25px #00ff88';
        } else {
            // Если угадана только часть слов
            lokiText.innerHTML = `«Хм... Вы разгадали только ${solvedCount} из 11 дисциплин. Тор-лягушка хихикает в углу! Ищите ошибки, сверяйтесь с конспектом и попробуйте еще раз!»`;
            lokiText.style.color = "#e6c687"; // Золотой предупреждающий цвет
        }
    });
});
