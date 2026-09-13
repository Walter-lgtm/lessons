// ==========================================================================
// 1. СОСТОЯНИЕ ИНИЦИАЛИЗАЦИИ И НАВИГАЦИЯ ШАГОВ
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Хранилище магических очков и текущего шага
    let magicScore = 0;
    let currentStepIndex = 0;

    // Массив ID всех экранов в порядке их прохождения
    const steps = [
        'step-start', 
        'step-task1', 
        'step-task2', 
        'step-task3', 
        'step-task4', 
        'step-task5', 
        'step-result'
    ];

    const scoreDisplay = document.getElementById('current-score');
    const progressBar = document.getElementById('progress-bar');
    const lokiSpeech = document.getElementById('loki-speech');

    // Функция обновления шкалы прогресса (для 5 заданий)
    function updateProgress(stepNumber) {
        if (stepNumber === 0) {
            progressBar.style.width = '0%';
        } else if (stepNumber >= steps.length - 1) {
            progressBar.style.width = '100%';
        } else {
            // Рассчитываем процент прохождения на основе 5 основных задач
            const percentage = ((stepNumber) / 5) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    // Универсальная функция для переключения экранов теста
    function showStep(index) {
        steps.forEach(id => {
            const stepEl = document.getElementById(id);
            if (stepEl) stepEl.classList.remove('active');
        });
        
        const nextStepEl = document.getElementById(steps[index]);
        if (nextStepEl) nextStepEl.classList.add('active');
        
        currentStepIndex = index;
        updateProgress(index);
    }

    // Кнопка СТАРТ: запускает тест
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            lokiSpeech.textContent = "Испытание началось! Не разочаруй меня, ученик. Распредели шпионов по их обителям!";
            showStep(1); // Переходим к Заданию 1
        });
    }

    // ==========================================================================
    // 2. ОБРАБОТЧИКИ ДЛЯ ПЕРВЫХ ЧЕТЫРЕХ ЗАДАНИЙ
    // ==========================================================================
    const nextButtons = document.querySelectorAll('.next-step-btn');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnType = b.target.getAttribute('data-type');
            let isCorrect = false;

            // Обработка Задания 1 (Выпадающие списки / Select)
            if (btnType === 'select') {
                const cards = document.querySelectorAll('.bio-card');
                let cardCorrectCount = 0;

                cards.forEach(card => {
                    const select = card.querySelector('.magic-select');
                    const correctAnswer = card.getAttribute('data-correct');
                    if (select && select.value === correctAnswer) {
                        card.classList.add('card-success');
                        cardCorrectCount++;
                    } else {
                        card.classList.add('card-error');
                    }
                });

                if (cardCorrectCount === cards.length) {
                    magicScore += 20; // +20 очков за идеальное выполнение
                    lokiSpeech.textContent = "Поразительно! Ты раскрыл всех шпионов. Переходим к морским глубинам...";
                } else {
                    lokiSpeech.textContent = `Ха! Ты угадал лишь ${cardCorrectCount} из 4. Но ладно, я пропущу тебя дальше.`;
                }
                
                scoreDisplay.textContent = magicScore;
                setTimeout(() => showStep(currentStepIndex + 1), 2500);
            }

            // Обработка Заданий 2, 3, 4 (Радио-кнопки / Radio плитки)
            if (btnType === 'radio') {
                const radioName = b.target.getAttribute('data-name');
                const selectedRadio = document.querySelector(`input[name="${radioName}"]:checked`);

                if (!selectedRadio) {
                    lokiSpeech.textContent = "Эй, не пытайся сбежать от ответа! Выбери хоть какой-то вариант плитки!";
                    return;
                }

                // Ищем родительскую плитку-label для красивой визуализации
                const parentTile = selectedRadio.closest('.option-tile');
                const isTileCorrect = parentTile.classList.contains('correct');

                if (isTileCorrect) {
                    magicScore += 20;
                    parentTile.style.borderColor = "var(--emerald-neon)";
                    parentTile.style.boxShadow = "0 0 15px var(--emerald-neon)";
                    
                    // Реплики Локи под каждый текстовый вопрос
                    if (radioName === 'q2') lokiSpeech.textContent = "Верно! Николай Николаевич — зоолог. Тор думал, что он ищет русалок, ха-ха!";
                    if (radioName === 'q3') lokiSpeech.textContent = "Точно! Ботаник правит гербариями. Травников оставь для сомнительных зелий!";
                    if (radioName === 'q4') lokiSpeech.textContent = "Превосходно! Генетика — истинная магия ДНК. Свинки в надежных руках.";
                } else {
                    parentTile.style.borderColor = "#ff4d4d";
                    parentTile.style.boxShadow = "0 0 15px #ff4d4d";
                    lokiSpeech.textContent = "Мимо! Твой ответ слаб, как молнии Тора без его молота! Двигаемся дальше.";
                }

                scoreDisplay.textContent = magicScore;
                // Небольшая задержка, чтобы ребенок успел увидеть вспышку цвета плитки
                setTimeout(() => showStep(currentStepIndex + 1), 2200);
            }
        });
    });
  // ==========================================================================
    // 3. МЕХАНИКА ИСПЫТАНИЯ V (ОРГАНИЗМЫ И ЦАРСТВА)
    // ==========================================================================
    let selectedOrganism = null; // Переменная для хранения временно выбранного организма
    const organismItems = document.querySelectorAll('#organisms-pool .match-item');
    const kingdomButtons = document.querySelectorAll('#kingdoms-pool .kingdom-btn');

    // Клик по плитке организма
    organismItems.forEach(item => {
        item.addEventListener('click', () => {
            // Если организм уже сопоставлен успешно — ничего не делаем
            if (item.classList.contains('matched-success')) return;

            // Снимаем выделение со всех остальных организмов
            organismItems.forEach(el => el.classList.remove('selected'));

            // Выделяем текущий кликнутый организм
            item.classList.add('selected');
            selectedOrganism = item;
            
            lokiSpeech.textContent = `Выбран организм: «${item.textContent}». В какое Царство его отправим?`;
        });
    });

    // Клик по кнопке Царства
    kingdomButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Если ребенок не выбрал сначала организм, а сразу тыкает в царство
            if (!selectedOrganism) {
                lokiSpeech.textContent = "Упрямый ученик! Сначала выбери карточку организма слева!";
                return;
            }

            const targetKingdom = selectedOrganism.getAttribute('data-kingdom');
            const chosenKingdom = btn.getAttribute('data-id');

            if (targetKingdom === chosenKingdom) {
                // Если сопоставлено верно
                magicScore += 5; // +5 очков за каждый правильный организм (всего 8 * 5 = 40 очков)
                scoreDisplay.textContent = magicScore;

                selectedOrganism.classList.remove('selected');
                selectedOrganism.classList.add('matched-success');
                selectedOrganism.textContent += " ✓"; // Визуальная галочка успеха

                lokiSpeech.textContent = `Верно! Сила Асгарда растет! Переходим к следующему организму.`;
                selectedOrganism = null; // Сбрасываем выбор
                
                checkAllMatched(); // Проверяем, не закончились ли организмы
            } else {
                // Если совершена ошибка
                lokiSpeech.textContent = `Ха-ха! Ну какой же это ${btn.textContent}? Подумай еще раз над «${selectedOrganism.textContent}»!`;
                selectedOrganism.classList.remove('selected');
                selectedOrganism = null;
            }
        });
    });

    // Функция проверки: если все 8 организмов сопоставлены, активируем финальную кнопку
    function checkAllMatched() {
        const remaining = document.querySelectorAll('#organisms-pool .match-item:not(.matched-success)');
        if (remaining.length === 0) {
            lokiSpeech.textContent = "Невероятно, ты распределил всех существ! Жми кнопку завершения ритуала!";
            const finishBtn = document.getElementById('finish-btn');
            if (finishBtn) finishBtn.style.animation = "fadeInStep 0.5s ease, pulse 1.5s infinite";
        }
    }

    // ==========================================================================
    // 4. ЛОГИКА ФИНАЛА (ПОДСЧЁТ РЕЗУЛЬТАТОВ)
    // ==========================================================================
    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            showStep(6); // Переходим на финальный экран (step-result)
            
            const finalTitle = document.getElementById('final-title');
            const finalMsg = document.getElementById('final-msg');

            // Всего максимум очков: 20 (Зад1) + 20 (Зад2) + 20 (Зад3) + 20 (Зад4) + 40 (Зад5) = 120 очков
            if (magicScore >= 100) {
                finalTitle.textContent = "👑 Магистр Биологии Асгарда!";
                finalMsg.innerHTML = `Ты набрал <strong>${magicScore} из 120 очков</strong>! Локи аплодирует стоя, Один восхищен, а Тор-лягушка завистливо квакает в углу. Ты настоящий биомаг!`;
                lokiSpeech.textContent = "Я поражен твоим интеллектом! Ты достоин править девятью мирами вместе со мной! 🟢✨";
            } else if (magicScore >= 60) {
                finalTitle.textContent = "⚡ Младший Биомаг";
                finalMsg.innerHTML = `Твой результат: <strong>${magicScore} из 120 очков</strong>. Весьма неплохо для жителя Мидгарда! Тор чешет затылок и пытается понять, где он просчитался.`;
                lokiSpeech.textContent = "Хорошая работа. Ты определенно умнее большинства асгардских стражников, но до моего коварства тебе еще расти!";
            } else {
                finalTitle.textContent = "🐸 Ученик Тора-лягушки";
                finalMsg.innerHTML = `Ты набрал всего <strong>${magicScore} из 120 очков</strong>. Похоже, на уроках биологии ты листал Тик-Ток вместо учебника!`;
                lokiSpeech.textContent = "Ха-ха-ха! Ну что за конфуз! Даже Хеймдалль закрыл глаза от этого зрелища. А ну-ка перезапускай ритуал и попробуй снова!";
            }
        });
    }
});
