// ==========================================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И НАВИГАЦИЯ ПО СЛАЙДАМ
// ==========================================================================

let currentSlide = 1;
const totalSlides = 6;

function updateSlides() {
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    const activeSlide = document.getElementById(`slide-${currentSlide}`);
    if (activeSlide) activeSlide.classList.add('active');

    const counter = document.getElementById('slideCounter');
    if (counter) counter.textContent = `Слайд ${currentSlide} / ${totalSlides}`;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = (currentSlide === 1);
    if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides);
}

function nextSlide() { if (currentSlide < totalSlides) { currentSlide++; updateSlides(); } }
function prevSlide() { if (currentSlide > 1) { currentSlide--; updateSlides(); } }

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
function closeModal() { const modal = document.getElementById('infoModal'); if (modal) modal.style.display = 'none'; }
window.onclick = function(event) { const modal = document.getElementById('infoModal'); if (event.target === modal) modal.style.display = 'none'; };

// ==========================================================================
// ГЕОМЕТРИЧЕСКАЯ МАТРИЦА КРОССВОРДА (СТРОГО ПО СКРИНШОТУ 16х15)
// ==========================================================================

const crosswordMatrix = {
    // Строка 1
    "1-10": { letter: "Б", num: 7, dir: "top" },
    "1-11": { letter: "Х", num: 8, dir: "top" },

    // Строка 2
    "2-9": { letter: "1", isLabel: true }, // Метка "1" перед МЕЗОГЛЕЯ
    "2-10": { letter: "М" },
    "2-11": { letter: "Е" },
    "2-12": { letter: "З" },
    "2-13": { letter: "О" },
    "2-14": { letter: "Г" },
    "2-15": { letter: "Л" },
    "2-16": { letter: "Е" },
    "2-17": { letter: "Я" },

    // Строка 3
    "3-10": { letter: "Г" },
    "3-11": { letter: "О" },

    // Строка 4
    "4-11": { letter: "Д" },
    "4-14": { letter: "9", isLabel: true, dir: "top" }, // Метка "9" над Ц

    // Строка 5
    "5-4": { letter: "2", isLabel: true }, // Метка "2" перед МЫШЦЫ
    "5-5": { letter: "М" },
    "5-6": { letter: "Ы" },
    "5-7": { letter: "Ш" },
    "5-8": { letter: "Ц" },
    "5-9": { letter: "Ы" },
    "5-11": { letter: "Ь" },
    "5-13": { letter: "11", isLabel: true, dir: "top" }, // Метка "11" над П
    "5-14": { letter: "Ц" },
    "5-16": { letter: "10", isLabel: true, dir: "top" }, // Метка "10" над Г

    // Строка 6
    "6-11": { letter: "Б" },
    "6-13": { letter: "3", isLabel: true }, // Метка "3" перед ПЛАВАНИЕ
    "6-14": { letter: "И" },
    "6-15": { letter: "П" },
    "6-16": { letter: "Л" },
    "6-17": { letter: "А" },
    "6-18": { letter: "В" },
    "6-19": { letter: "А" },
    "6-20": { letter: "Н" },
    "6-21": { letter: "И" },
    "6-22": { letter: "Е" },

    // Строка 7
    "7-11": { letter: "А" },
    "7-14": { letter: "Т" },
    "7-16": { letter: "Г" },

    // Строка 8
    "8-4": { letter: "4", isLabel: true }, // Метка "4" перед ЭКЗОСКЕЛЕТ
    "8-5": { letter: "Э" },
    "8-6": { letter: "К" },
    "8-7": { letter: "З" },
    "8-8": { letter: "О" },
    "8-9": { letter: "С" },
    "8-10": { letter: "К" },
    "8-11": { letter: "Е" },
    "8-12": { letter: "Л" },
    "8-13": { letter: "Е" },
    "8-14": { letter: "Т" },
    "8-16": { letter: "И" },
    "8-18": { letter: "12", isLabel: true, dir: "top" }, // Метка "12" над Д

    // Строка 9
    "9-13": { letter: "О" },
    "9-16": { letter: "Д" },
    "9-18": { letter: "Д" },

    // Строка 10
    "10-2": { letter: "5", isLabel: true }, // Метка "5" перед ПЛАВНИКИ
    "10-3": { letter: "П" },
    "10-4": { letter: "Л" },
    "10-5": { letter: "А" },
    "10-6": { letter: "В" },
    "10-7": { letter: "Н" },
    "10-8": { letter: "И" },
    "10-9": { letter: "К" },
    "10-10": { letter: "И" },
    "10-13": { letter: "Л" },
    "10-15": { letter: "6", isLabel: true }, // Метка "6" перед ХВОСТ
    "10-16": { letter: "Х" },
    "10-17": { letter: "В" },
    "10-18": { letter: "О" },
    "10-19": { letter: "С" },
    "10-20": { letter: "Т" },

    // Строка 11
    "11-9": { letter: "Е" },
    "11-13": { letter: "Е" },
    "11-18": { letter: "И" },
    "11-20": { letter: "Р" },

    // Строка 12
    "12-9": { letter: "Т" },
    "12-13": { letter: "Т" },
    "12-18": { letter: "Ж" },
    "12-20": { letter: "О" },

    // Строка 13
    "13-18": { letter: "Е" },
    "13-20": { letter: "С" },

    // Строка 14
    "14-18": { letter: "Н" },
    "14-20": { letter: "К" },

    // Строка 15
    "15-18": { letter: "И" },
    "15-20": { letter: "Е" },

    // Строка 16
    "16-18": { letter: "Е" },
    "16-20": { letter: "Л" },

    // Строка 17
    "17-20": { letter: "Е" },

    // Строка 18
    "18-20": { letter: "Т" }
};

function initCrossword() {
    const gridContainer = document.getElementById('crosswordGrid');
    if (!gridContainer) return;

    // Смещение по осям, чтобы центрировать кроссворд на холсте 16x15
    const startRow = 1;
    const endRow = 15;
    const startCol = 3;
    const endCol = 18;

    for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
            const cellKey = `${r}-${c}`;
            const cellData = crosswordMatrix[cellKey];

            const cellDiv = document.createElement('div');
            cellDiv.classList.add('crossword-cell');

            if (cellData) {
                if (cellData.isLabel) {
                    // Если это просто ячейка с номером вопроса (серая)
                    cellDiv.classList.add('empty');
                    const numSpan = document.createElement('span');
                    numSpan.classList.add('cell-number');
                    if (cellData.dir === "top") numSpan.classList.add('top-num');
                    numSpan.textContent = cellData.letter;
                    cellDiv.appendChild(numSpan);
                } else {
                    // Игровая ячейка
                    cellDiv.classList.add('active-cell');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = r;
                    input.dataset.col = c;

                    // Если номер вопроса назначен прямо на букву (актуально для 7 и 8)
                    if (cellData.num) {
                        const numSpan = document.createElement('span');
                        numSpan.classList.add('cell-number');
                        if (cellData.dir === "top") numSpan.classList.add('top-num');
                        numSpan.textContent = cellData.num;
                        cellDiv.appendChild(numSpan);
                    }

                    // Автопереход фокуса
                    input.addEventListener('input', (e) => {
                        if (e.target.value.length === 1) {
                            let nextCell = input.parentElement.nextElementSibling;
                            while (nextCell && !nextCell.classList.contains('active-cell')) {
                                nextCell = nextCell.nextElementSibling;
                            }
                            if (nextCell) {
                                const nextInput = nextCell.querySelector('input');
                                if (nextInput) nextInput.focus();
                            }
                        }
                    });

                    cellDiv.appendChild(input);
                }
            } else {
                cellDiv.classList.add('empty');
            }
            gridContainer.appendChild(cellDiv);
        }
    }
}

function checkCrossword() {
    let allCorrect = true;
    let hasEmpty = false;
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

    const resultDiv = document.getElementById('crosswordResult');
    if (resultDiv) {
        if (hasEmpty) {
            resultDiv.textContent = "Заполните все пустые клетки!";
            resultDiv.className = "result-message error";
        } else if (allCorrect) {
            resultDiv.textContent = "Кроссворд решен!";
            resultDiv.className = "result-message success";
        } else {
            resultDiv.textContent = "Есть ошибки. Попробуйте еще раз!";
            resultDiv.className = "result-message error";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCrossword();
    updateSlides();
});
