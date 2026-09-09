// ==========================================================================
// 1. АВТОМАТИЧЕСКАЯ АДАПТАЦИЯ МАСШТАБА ПОД РАЗМЕРЫ ЭКРАНА ПК / ПРОЕКТОРА
// ==========================================================================
function adjustPresentationScale() {
    const scalerElement = document.getElementById("presentation-scaler");
    if (!scalerElement) return;

    // Базовые фиксированные размеры приложения (стандарт 16:9)
    const baseWidth = 1280;
    const baseHeight = 720;

    // Текущие фактические размеры окна браузера на ПК учителя
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Вычисляем коэффициенты масштабирования
    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;

    // Выбираем минимальный коэффициент, чтобы приложение гарантированно вписалось
    const finalScale = Math.min(scaleX, scaleY);

    // Применяем CSS-трансформацию масштабирования и центрирования
    scalerElement.style.transform = `scale(${finalScale})`;
}

// Запускаем расчет масштаба при загрузке и при изменении размеров окна браузера
window.addEventListener("resize", adjustPresentationScale);
document.addEventListener("DOMContentLoaded", adjustPresentationScale);

// ==========================================================================
// 2. БАЗА ДАННЫХ ДЛЯ ЛАБОРАТОРНОЙ РАБОТЫ (МИКРОПРЕПАРАТЫ ИЗ УЧЕБНИКА)
// ==========================================================================
const microscopePreparations = {
    "epithel": {
        title: "Препарат №1: Многослойный плоский эпителий",
        image: "ris_12.jpg"
    },
    "bone": {
        title: "Препарат №2: Плотная костная ткань лягушки",
        image: "ris_13.jpg" // При отсутствии отдельного рисунка кости, здесь используется доступный рис. 13
    },
    "blood": {
        title: "Препарат №3: Кровь лягушки (эритроциты с ядрами)",
        image: "ris_13.jpg" // Временный заменитель из доступных (жировая/жидкая ткань)
    },
    "muscle": {
        title: "Препарат №4: Поперечнополосатая мышечная ткань",
        image: "ris_14.jpg"
    },
    "nerve": {
        title: "Препарат №5: Нервная ткань (нейроны сетчатки глаза)",
        image: "ris_15.jpg"
    }
};

// Глобальное состояние урока
let lessonState = {
    currentSlide: 1,
    totalSlides: 4
};

// ==========================================================================
// 3. СТАРТОВАЯ НАВИГАЦИЯ МЕЖДУ РАЗДЕЛАМИ УРОКА
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initMainNavigation();
    initPresentationSlider();
    initSystemsPopup();
    initLabWork();
});

function initMainNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".content-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            sections.forEach(s => s.classList.add("hidden"));

            btn.classList.add("active");
            const target = btn.getAttribute("data-target");
            document.getElementById(target).classList.remove("hidden");
            
            // Пересчитываем масштаб при смене вкладки, чтобы верстка не сдвигалась
            adjustPresentationScale();
        });
    });
}
// ==========================================================================
// 4. ЛОГИКА СЛАЙДЕРА ПРЕЗЕНТАЦИИ (ТЕОРИЯ)
// ==========================================================================
function initPresentationSlider() {
    const prevBtn = document.getElementById("btn-prev-slide");
    const nextBtn = document.getElementById("btn-next-slide");
    const dotsContainer = document.getElementById("presentation-dots");

    // Генерируем точки-индикаторы по количеству слайдов
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= lessonState.totalSlides; i++) {
        const dot = document.createElement("div");
        dot.className = i === 1 ? "dot active" : "dot";
        dot.addEventListener("click", () => {
            switchSlideTo(i);
        });
        dotsContainer.appendChild(dot);
    }

    // Клик по кнопке "Назад"
    prevBtn.addEventListener("click", () => {
        if (lessonState.currentSlide > 1) {
            switchSlideTo(lessonState.currentSlide - 1);
        }
    });

    // Клик по кнопке "Вперед"
    nextBtn.addEventListener("click", () => {
        if (lessonState.currentSlide < lessonState.totalSlides) {
            switchSlideTo(lessonState.currentSlide + 1);
        }
    });
}

// Функция плавного переключения слайда
function switchSlideTo(slideNumber) {
    // Скрываем прошлый активный слайд
    document.querySelector(".lesson-slide.active").classList.remove("active");
    
    // Активируем выбранный слайд
    const targetSlide = document.querySelector(`.lesson-slide[data-slide="${slideNumber}"]`);
    targetSlide.classList.add("active");

    lessonState.currentSlide = slideNumber;

    // Управляем доступностью кнопок
    document.getElementById("btn-prev-slide").disabled = (slideNumber === 1);
    document.getElementById("btn-next-slide").disabled = (slideNumber === lessonState.totalSlides);

    // Подсвечиваем соответствующую точку-индикатор
    document.querySelectorAll(".presentation-dots .dot").forEach((dot, index) => {
        if (index + 1 === slideNumber) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// ==========================================================================
// 5. ИНТЕРАКТИВНЫЙ РАЗБОР СИСТЕМ ОРГАНОВ (СЛАЙД 4)
// ==========================================================================
function initSystemsPopup() {
    const cards = document.querySelectorAll(".system-mini-card");
    const popupBox = document.getElementById("system-info-popup");
    const popupText = document.getElementById("system-info-text");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const info = card.getAttribute("data-info");
            const title = card.querySelector("h4").textContent;

            // Если карточка уже выбрана — скрываем окошко информации
            if (card.classList.contains("selected-card")) {
                card.classList.remove("selected-card");
                popupBox.classList.add("hidden-element");
            } else {
                // Иначе снимаем выделение с других и открываем информацию об этой системе
                cards.forEach(c => c.classList.remove("selected-card"));
                card.classList.add("selected-card");

                popupText.innerHTML = `<strong>${title}:</strong> ${info}`;
                popupBox.classList.remove("hidden-element");
            }
        });
    });
}
// ==========================================================================
// 6. УПРАВЛЕНИЕ ВИРТУАЛЬНЫМ МИКРОСКОПОМ (ЛАБОРАТОРНАЯ РАБОТА)
// ==========================================================================
function initLabWork() {
    const stepItems = document.querySelectorAll(".lab-step-item");
    const microscopeImage = document.getElementById("microscope-image");
    const microscopeTitle = document.getElementById("microscope-prep-title");

    stepItems.forEach(item => {
        item.addEventListener("click", () => {
            // Убираем класс активности у всех шагов работы
            stepItems.forEach(el => el.classList.remove("active"));
            
            // Добавляем класс активности нажатому шагу
            item.classList.add("active");

            // Получаем ключ выбранного препарата (например, 'epithel', 'bone' и т.д.)
            const preparationKey = item.getAttribute("data-prep");
            const prepData = microscopePreparations[preparationKey];

            if (prepData) {
                // Эффект быстрого затухания перед сменой картинки для реалистичности
                microscopeImage.style.opacity = "0";

                setTimeout(() => {
                    // Меняем путь к изображению и текст подписи
                    microscopeImage.src = prepData.image;
                    microscopeImage.alt = prepData.title;
                    microscopeTitle.textContent = prepData.title;
                    
                    // Возвращаем видимость изображению
                    microscopeImage.style.opacity = "1";
                }, 200); // 200 миллисекунд на анимацию смены кадра
            }
        });
    });
}
