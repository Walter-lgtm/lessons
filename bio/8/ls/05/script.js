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
// МАТРИЦА И ЛОГИКА ИНТЕРАКТИВНОГО КРОССВОРДА
// ==========================================================================

// Координатная сетка кроссворда (14 строк x 17 столбцов)
// Каждая запись содержит: правильную букву и необязательный номер вопроса для отображения в углу ячейки
const crosswordMatrix = {
    // Горизонталь 1: МЕЗОГЛЕЯ (Строка 3, начинается с колонки 10)
    "3-10": { letter: "М", num: 1 }, "3-11": { letter: "Е" }, "3-12": { letter: "З" }, "3-13": { letter: "О" }, "3-14": { letter: "Г" }, "3-15": { letter: "Л" }, "3-16": { letter: "Е" }, "3-17": { letter: "Я" },
    
    // Горизонталь 2: МЫШЦА (Строка 5, начинается с колонки 3)
    "5-3": { letter: "М", num: 2 }, "5-4": { letter: "Ы" }, "5-5": { letter: "Ш" }, "5-6": { letter: "Ц" }, "5-7": { letter: "А" },
    
    // Горизонталь 3: ПЛАВАНИЕ (Строка 6, начинается с колонки 9)
    "6-9": { letter: "П", num: 3 }, "6-10": { letter: "Л" }, "6-11": { letter: "А" }, "6-12": { letter: "В" }, "6-13": { letter: "А" }, "6-14": { letter: "Н" }, "6-15": { letter: "И" }, "6-16": { letter: "Е" },
    
    // Горизонталь 4: ЭКЗОСКЕЛЕТ (Строка 8, начинается с колонки 3)
    "8-3": { letter: "Э", num: 4 }, "8-4": { letter: "К" }, "8-5": { letter: "З" }, "8-6": { letter: "О" }, "8-7": { letter: "С" }, "8-8": { letter: "К" }, "8-9": { letter: "Е" }, "8-10": { letter: "Л" }, "8-11": { letter: "Е" }, "8-12": { letter: "Т" },
    
    // Горизонталь 5: ПЛАВНИКИ (Строка 10, начинается с колонки 1)
    "10-1": { letter: "П", num: 5 }, "10-2": { letter: "Л" }, "10-3": { letter: "А" }, "10-4": { letter: "В" }, "10-5": { letter: "Н" }, "10-6": { letter: "И" }, "10-7": { letter: "К" }, "10-8": { letter: "И" },
    
    // Горизонталь 6: ХВОСТ (Строка 10, начинается с колонки 11)
    "10-11": { letter: "Х", num: 6 }, "10-12": { letter: "В" }, "10-13": { letter: "О" }, "10-14": { letter: "С" }, "10-15": { letter: "Т" },

    // Вертикаль 7: БЕГ (Пересекается в "5-7"(А). Идёт вниз: строки 4-6, колонка 7)
    "4-7": { letter: "Б", num: 7 }, /* "5-7" это А */ "6-7": { letter: "Г" },
    
    // Вертикаль 8: ХОДЬБА (Строки 1-6, колонка 9. Пересекает "6-9"(П))
    "1-9": { letter: "Х", num: 8 }, "2-9": { letter: "О" }, "3-9": { letter: "Д" }, "4-9": { letter: "Ь" }, "5-9": { letter: "Б" }, /* "6-9" это П */
    
    // Вертикаль 9: ЦИТОСКЕЛЕТ (Строки 4-13, колонка 5. Пересекает "5-5"(Ш) и "8-5"(З))
    "4-5": { letter: "Ц", num: 9 }, /* "5-5" это Ш */ "6-5": { letter: "И" }, "7-5": { letter: "Т" }, /* "8-5" это З */ "9-5": { letter: "О" }, "10-5": { letter: "С" }, "11-5": { letter: "К" }, "12-5": { letter: "Е" }, "13-5": { letter: "Л" }, "14-5": { letter: "Е" }, "15-5": { letter: "Т" },
    
    // Вертикаль 10: ГИДРОСКЕЛЕТ (Строки 4-14, колонка 13. Пересекает "3-13"(О), "6-13"(А), "10-13"(О))
    "4-13": { letter: "Г", num: 10 }, "5-13": { letter: "И" }, /* "6-13" это А */ "7-13": { letter: "Д" }, "8-13": { letter: "Р" }, "9-13": { letter: "О" }, /* "10-13" это О */ "11-13": { letter: "С" }, "12-13": { letter: "К" }, "13-13": { letter: "Е" }, "14-13": { letter: "Л" }, "15-13": { letter: "Е" }, "16-13": { letter: "Т" },
    
    // Вертикаль 11: ПОЛЕТ (Строки 5-9, колонка 11. Пересекает "3-11"(Е), "6-11"(А), "8-11"(Е))
    "5-11": { letter: "П", num: 11 }, "6-11": { letter: "О" }, "7-11": { letter: "Л" }, /* "8-11" это Е */ "9-11": { letter: "Т" },
    
    // Вертикаль 12: ДВИЖЕНИЕ (Строки 7-14, колонка 15. Пересекает "3-15"(Л), "6-15"(И), "10-15"(Т))
    "7-15": { letter: "Д", num: 12 }, "8-15": { letter: "В" }, "9-15": { letter: "И" }, /* "10-15" это Т */ "11-15": { letter: "Ж" }, "12-15": { letter: "Е" }, "13-15": { letter: "Н" }, "14-15": { letter: "И" }, "15-15": { letter: "Е" }
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
