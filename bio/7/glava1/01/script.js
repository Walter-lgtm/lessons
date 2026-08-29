document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. ПЕРЕКЛЮЧЕНИЕ СЛАЙДОВ (НАВИГАЦИЯ МЕНЮ)
    // ==========================================================================
    const menuButtons = document.querySelectorAll('.menu-btn');
    const slides = document.querySelectorAll('.slide');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок и слайдов
            menuButtons.forEach(btn => btn.classList.remove('active'));
            slides.forEach(slide => slide.classList.remove('active'));

            // Активируем текущую кнопку
            button.classList.add('active');

            // Находим и показываем нужный слайд по data-атрибуту
            const targetSlideId = button.getAttribute('data-slide');
            const targetSlide = document.getElementById(targetSlideId);
            
            if (targetSlide) {
                targetSlide.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 2. ИНТЕРАКТИВНАЯ СХЕМА ИЕРАРХИИ (СИСТЕМАТИЧЕСКИЕ ГРУППЫ)
    // ==========================================================================
    const treeItems = document.querySelectorAll('.tree-item');
    const detailsContainer = document.getElementById('hierarchy-details');

    treeItems.forEach(item => {
        item.addEventListener('click', () => {
            // Снимаем выделение с предыдущих элементов
            treeItems.forEach(el => el.classList.remove('selected'));
            
            // Выделяем текущий элемент
            item.classList.add('selected');

            // Извлекаем информацию из атрибута data-info
            const infoText = item.getAttribute('data-info');
            const rankName = item.querySelector('.rank').textContent;
            const exampleName = item.querySelector('.example').textContent;

            // Выводим красивое форматированное описание
            detailsContainer.innerHTML = `
                <p><strong>${rankName} (${exampleName}):</strong> ${infoText}</p>
            `;
            // Небольшая визуальная подсветка блока с деталями
            detailsContainer.style.borderColor = '#1c7ed6';
        });
    });

    // ==========================================================================
    // 3. КОНТРОЛЬ ЗНАНИЙ (ОТКРЫТИЕ ПОДСКАЗОК/ОТВЕТОВ)
    // ==========================================================================
    const showAnswerButtons = document.querySelectorAll('.show-answer-btn');

    showAnswerButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Находим блок ответа внутри той же карточки вопроса
            const answerBlock = button.nextElementSibling;

            if (answerBlock && answerBlock.classList.contains('quiz-answer')) {
                // Переключаем видимость ответа
                answerBlock.classList.toggle('hidden');

                // Меняем текст на кнопке в зависимости от состояния
                if (answerBlock.classList.contains('hidden')) {
                    button.textContent = 'Показать подсказку';
                } else {
                    button.textContent = 'Скрыть подсказку';
                }
            }
        });
    });
    // ==========================================================================
    // 4. ПРОВЕРКА ИНТЕРАКТИВНОГО ПРАКТИКУМА (ЦАРСТВА)
    // ==========================================================================
    const checkGalleryBtn = document.getElementById('check-gallery-btn');
    const galleryItems = document.querySelectorAll('.gallery-quiz-item');
    const resultMessage = document.getElementById('gallery-quiz-result');

    if (checkGalleryBtn) {
        checkGalleryBtn.addEventListener('click', () => {
            let correctCount = 0;
            let totalCount = galleryItems.length;
            let allAnswered = true;

            galleryItems.forEach(item => {
                const select = item.querySelector('.kingdom-select');
                const correctAnswer = item.getAttribute('data-correct');
                const userAnswer = select.value;

                // Сбрасываем старые классы подсветки
                item.classList.remove('correct-answer', 'wrong-answer');

                if (!userAnswer) {
                    allAnswered = false;
                } else if (userAnswer === correctAnswer) {
                    item.classList.add('correct-answer');
                    correctCount++;
                } else {
                    item.classList.add('wrong-answer');
                }
            });

            // Выводим итог проверки
            if (!allAnswered) {
                resultMessage.textContent = 'Пожалуйста, выберите царство для всех организмов!';
                resultMessage.style.color = '#e67e22';
            } else {
                resultMessage.textContent = `Результат: ${correctCount} из ${totalCount} правильно!`;
                if (correctCount === totalCount) {
                    resultMessage.style.color = '#2b8a3e';
                } else {
                    resultMessage.style.color = '#c92a2a';
                }
            }
        });
    }
});
