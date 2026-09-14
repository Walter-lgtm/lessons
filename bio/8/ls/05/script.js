// ==========================================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И НАВИГАЦИЯ ПО СЛАЙДАМ
// ==========================================================================

let currentSlide = 1;
const totalSlides = 7;

/**
 * Функция обновления видимости слайдов и состояния кнопок навигации
 */
function updateSlides() {
    // Скрываем все слайды и показываем только текущий
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    const activeSlide = document.getElementById(`slide-${currentSlide}`);
    if (activeSlide) {
        activeSlide.classList.add('active');
    }

    // Обновляем текстовый счетчик слайдов
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `Слайд ${currentSlide} / ${totalSlides}`;
    }

    // Логика блокировки/активации навигационных кнопок
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) prevBtn.disabled = (currentSlide === 1);
    if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides);
}

/**
 * Переход на следующий слайд
 */
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlides();
    }
}

/**
 * Переход на предыдущий слайд
 */
function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlides();
    }
}

// ==========================================================================
// ЛОГИКА ИНТЕРАКТИВНЫХ ПОДСКАЗОК (МОДАЛЬНОЕ ОКНО ⓘ)
// ==========================================================================

/**
 * Открытие модального окна с нужной картинкой и заголовком
 * @param {string} imgSrc - Путь к файлу изображения
 * @param {string} title - Текст заголовка в окне
 */
function openModal(imgSrc, title) {
    const modal = document.getElementById('infoModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');

    if (modal && modalImg && modalTitle) {
        modalImg.src = imgSrc;
        modalTitle.textContent = title;
        modal.style.display = 'flex';
    }
}

/**
 * Закрытие модального окна
 */
function closeModal() {
    const modal = document.getElementById('infoModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Закрытие окна при клике на темную область вокруг контента
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
// ==========================================================================
// ТОЧНАЯ МАТРИЦА КРОССВОРДА (СТРОГО ПО СТРУКТУРЕ СКРИНШОТА)
// ==========================================================================

const crosswordMatrix = {
    // 1. МЕЗОГЛЕЯ (Горизонталь, Строка 2)
    "2-4": { letter: "М", num: 1 }, "2-5": { letter: "Е" }, "2-6": { letter: "З" }, "2-7": { letter: "О" }, "2-8": { letter: "Г" }, "2-9": { letter: "Л" }, "2-10": { letter: "Е" }, "2-11": { letter: "Я" },
    
    // 2. МЫШЦА (Горизонталь, Строка 4)
    "4-6": { letter: "М", num: 2 }, "4-7": { letter: "Ы" }, "4-8": { letter: "Ш" }, "4-9": { letter: "Ц" }, "4-10": { letter: "А" },
    
    // 3. ПЛАВАНИЕ (Горизонталь, Строка 5)
    "5-5": { letter: "П", num: 3 }, "5-6": { letter: "Л" }, "5-7": { letter: "А" }, "5-8": { letter: "В" }, "5-9": { letter: "А" }, "5-10": { letter: "Н" }, "5-11": { letter: "И" }, "5-12": { letter: "Е" },
    
    // 4. ЭКЗОСКЕЛЕТ (Горизонталь, Строка 7)
    "7-2": { letter: "Э", num: 4 }, "7-3": { letter: "К" }, "7-4": { letter: "З" }, "7-5": { letter: "О" }, "7-6": { letter: "С" }, "7-7": { letter: "К" }, "7-8": { letter: "Е" }, "7-9": { letter: "Л" }, "7-10": { letter: "Е" }, "7-11": { letter: "Т" },
    
    // 5. ПЛАВНИКИ (Горизонталь, Строка 9)
    "9-3": { letter: "П", num: 5 }, "9-4": { letter: "Л" }, "9-5": { letter: "А" }, "9-6": { letter: "В" }, "9-7": { letter: "Н" }, "9-8": { letter: "И" }, "9-9": { letter: "К" }, "9-10": { letter: "И" },
    
    // 6. ХВОСТ (Горизонталь, Строка 11)
    "11-6": { letter: "Х", num: 6 }, "11-7": { letter: "В" }, "11-8": { letter: "О" }, "11-9": { letter: "С" }, "11-10": { letter: "Т" },

    // Вертикали, которые стыкуются по номерам клеток из вашего задания:
    // 7. БЕГ (Вертикаль, Колонка 4)
    "1-4": { letter: "Б", num: 7 }, /* "2-4" пересечение М */ "3-4": { letter: "Г" },
    
    // 8. ХОДЬБА (Вертикаль, Колонка 7)
    "3-7": { letter: "Х", num: 8 }, /* "4-7" пересечение Ы */ "5-7": { letter: "А" }, "6-7": { letter: "Д" }, "7-7": { letter: "К" }, "8-7": { letter: "Ь" }, "9-7": { letter: "Н" }, "10-7": { letter: "Б" }, "11-7": { letter: "В" },
    
    // 9. ЦИТОСКЕЛЕТ (Вертикаль, Колонка 9)
    "1-9": { letter: "Ц", num: 9 }, /* "2-9" пересечение Л */ "3-9": { letter: "И" }, /* "4-9" пересечение Ц */ "5-9": { letter: "А" }, "6-9": { letter: "Т" }, /* "7-9" пересечение Л */ "8-9": { letter: "О" }, /* "9-9" пересечение К */ "10-9": { letter: "С" }, /* "11-9" пересечение С */ "12-9": { letter: "Е" }, "13-9": { letter: "Л" }, "14-9": { letter: "Е" }, "15-9": { letter: "Т" },
    
    // 10. ГИДРОСКЕЛЕТ (Вертикаль, Колонка 11)
    "1-11": { letter: "Г", num: 10 }, /* "2-11" пересечение Я */ "3-11": { letter: "И" }, "4-11": { letter: "Д" }, /* "5-11" пересечение И */ "6-11": { letter: "Р" }, /* "7-11" пересечение Т */ "8-11": { letter: "О" }, "9-11": { letter: "С" }, "10-11": { letter: "К" }, "11-11": { letter: "Е" }, "12-11": { letter: "Л" }, "13-11": { letter: "Е" }, "14-11": { letter: "Т" },
    
    // 11. ПОЛЕТ (Вертикаль, Колонка 12)
    "4-12": { letter: "П", num: 11 }, /* "5-12" пересечение Е */ "6-12": { letter: "Л" }, "7-12": { letter: "О" }, "8-12": { letter: "Е" }, "9-12": { letter: "Т" },
    
    // 12. ДВИЖЕНИЕ (Вертикаль, Главное слово, Колонка 8)
    "1-8": { letter: "Д", num: 12 }, /* "2-8" пересечение Г */ "3-8": { letter: "В" }, /* "4-8" пересечение Ш */ /* "5-8" пересечение В */ "6-8": { letter: "И" }, /* "7-8" пересечение Е */ "8-8": { letter: "Ж" }, /* "9-8" пересечение И */ "10-8": { letter: "Н" }, /* "11-8" пересечение О */ "12-8": { letter: "И" }, "13-8": { letter: "Е" }
};

/**
 * Инициализация и динамическая генерация сетки кроссворда при загрузке страницы
 */
function initCrossword() {
    const gridContainer = document.getElementById('crosswordGrid');
    if (!gridContainer) return;

    const rows = 14;
    const cols = 17;

    // Генерируем ячейки построчно
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            const cellKey = `${r}-${c}`;
            const cellData = crosswordMatrix[cellKey];

            const cellDiv = document.createElement('div');
            cellDiv.classList.add('crossword-cell');

            if (cellData) {
                // Если координата есть в нашей матрице — это активная ячейка для ввода
                cellDiv.classList.add('active-cell');
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = r;
                input.dataset.col = c;
                
                // Если у ячейки назначен номер вопроса, добавляем маленькую цифру в угол
                if (cellData.num) {
                    const numSpan = document.createElement('span');
                    numSpan.classList.add('cell-number');
                    numSpan.textContent = cellData.num;
                    cellDiv.appendChild(numSpan);
                }

                // Добавляем автоматический переход на следующую ячейку при вводе для удобства
                input.addEventListener('input', (e) => {
                    if (e.target.value.length === 1) {
                        const nextInput = input.parentElement.nextElementSibling?.querySelector('input');
                        if (nextInput) nextInput.focus();
                    }
                });

                cellDiv.appendChild(input);
            } else {
                // Пустая клетка (серый блок-заглушка)
                cellDiv.classList.add('empty');
            }

            gridContainer.appendChild(cellDiv);
        }
    }
}

/**
 * Проверка введенных учениками ответов в кроссворде
 */
function checkCrossword() {
    let allCorrect = true;
    let hasEmpty = false;

    // Проходим по всем активным инпутам в сетке
    const activeCells = document.querySelectorAll('.active-cell');
    
    activeCells.forEach(cell => {
        const input = cell.querySelector('input');
        const r = input.dataset.row;
        const c = input.dataset.col;
        const cellKey = `${r}-${c}`;
        
        const studentLetter = input.value.trim().toUpperCase();
        const correctLetter = crosswordMatrix[cellKey].letter.toUpperCase();

        if (studentLetter === "") {
            hasEmpty = true;
            allCorrect = false;
            cell.classList.remove('correct', 'wrong');
        } else if (studentLetter === correctLetter) {
            cell.classList.add('correct');
            cell.classList.remove('wrong');
        } else {
            cell.classList.add('wrong');
            cell.classList.remove('correct');
            allCorrect = false;
        }
    });

    // Вывод сообщения по результатам проверки
    const resultDiv = document.getElementById('crosswordResult');
    if (resultDiv) {
        if (hasEmpty) {
            resultDiv.textContent = "Заполните все пустые клетки!";
            resultDiv.className = "result-message error";
        } else if (allCorrect) {
            resultDiv.textContent = "Отлично! Кроссворд разгадан верно!";
            resultDiv.className = "result-message success";
        } else {
            resultDiv.textContent = "Есть ошибки. Попробуйте еще раз!";
            resultDiv.className = "result-message error";
        }
    }
}

// Запуск генерации сетки при полной загрузке DOM-структуры страницы
document.addEventListener('DOMContentLoaded', () => {
    initCrossword();
    updateSlides(); // Инициализируем стартовое состояние слайдов
});
