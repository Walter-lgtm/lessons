// ПОЛНАЯ БАЗА ДАННЫХ (Часть 1): Химические элементы и вопросы-загадки к ним
const chemistryQuizData = [
    { element: "ВОДОРОД", question: "Самый распространенный элемент во Вселенной. Основной компонент звезд и межзвездного газа." },
    { element: "ГЕЛИЙ", question: "Благородный газ. Вторым по распространенности во Вселенной. Им наполняют дирижабли и воздушные шары." },
    { element: "ЛИТИЙ", question: "Самый легкий metal на Земле. Активно используется в производстве аккумуляторов для смартфонов." },
    { element: "БЕРИЛЛИЙ", question: "Легкий прочный металл, его оксид обладает сладким вкусом, но крайне токсичен. Используется в космических телескопах." },
    { element: "БОР", question: "Этот элемент и его соединения добавляют в жаропрочное стекло (например, посуду Пирекс) и регулирующие стержни ядерных реакторов." },
    { element: "УГЛЕРОД", question: "Основа органической жизни на Земле. Может существовать в виде мягкого графита или самого твердого алмаза." },
    { element: "АЗОТ", question: "Газ, составляющий около 78% объема земной атмосферы. В жидком виде используется для мгновенной заморозки." },
    { element: "КИСЛОРОД", question: "Самый распространенный элемент в земной коре. Поддерживает дыхание и горение." },
    { element: "ФТОР", question: "Самый химически активный неметалл и сильнейший окислитель. Его соединения добавляют в зубные пасты." },
    { element: "НЕОН", question: "Благородный газ, который в трубках газосветных вывесок дает яркое красно-оранжевое свечение." },
    { element: "НАТРИЙ", question: "Мягкий щелочной металл, бурно реагирует с водой, режется ножом. Входит в состав поваренной соли." },
    { element: "МАГНИЙ", question: "Металл, горящий ослепительно белым пламенем. Раньше использовался в фотовспышках." },
    { element: "АЛЮМИНИЙ", question: "Самый распространенный металл в земной коре. Легкий, серебристый, основа авиационной промышленности." },
    { element: "КРЕМНИЙ", question: "Главный элемент полупроводниковой электроники. На основе его чипов работают все процессоры планеты." },
    { element: "ФОСФОР", question: "Элемент, открытый алхимиком Брандтом в поисках философского камня. Его красный аллотроп нанесен на бортик спичечного коробка." },
    { element: "СЕРА", question: "Желтый неметалл, горит синим пламенем. Ее соединения отвечают за запах тухлых яиц." },
    { element: "ХЛОР", question: "Желто-зеленый ядовитый газ с резким удушающим запахом. Используется для дезинфекции воды." },
    { element: "АРГОН", question: "Самый распространенный благородный газ в атмосфере Земли. Им заполняют лампы накаливания." },
    { element: "КАЛИЙ", question: "Щелочной металл, окрашивает пламя в фиолетовый цвет. Важнейший элемент для работы человеческого сердца." },
    { element: "КАЛЬЦИЙ", question: "Основной строительный компонент костей и зубов, а также мела, известняка и мрамора." },
    { element: "СКАНДИЙ", question: "Легкий редкоземельный металл, добавление которого в алюминиевые сплавы резко повышает их прочность (используется в спортивных рамах и истребителях)." },
    { element: "ТИТАН", question: "Сверхпрочный, легкий и коррозионностойкий металл, названный в честь персонажей греческой мифологии. Идеален для протезов." },
    { element: "ВАНАДИЙ", question: "Металл, названный в честь скандинавской богини красоты из-за красивой окраски его химических растворов. Добавка в сталь для гаечных ключей." },
    { element: "ХРОМ", question: "Самый твердый чистый металл на Земле. Его наносят на детали автомобилей для зеркального блеска и защиты от ржавчины." },
    { element: "МАРГАНЕЦ", question: "Металл, чья соль (перманганат) в виде темно-фиолетовых кристаллов известна в быту как дезинфицирующая «марганцовка»." }
];
// ПОЛНАЯ БАЗА ДАННЫХ (Часть 2): Химические элементы и вопросы-загадки к ним
const chemistryQuizDataExtended = [
    { element: "ЖЕЛЕЗО", question: "Главный компонент стали и чугуна, а также центральный элемент гемоглобина, переносящего кислород в нашей крови." },
    { element: "КОБАЛЬТ", question: "Металл, названный в честь подземного злого гнома, вредившего горнякам. Дает стеклу и краскам глубокий синий цвет." },
    { element: "НИКЕЛЬ", question: "Серебристый металл, устойчивый к коррозии. Широко применяется для чеканки монет и производства нержавеющей стали." },
    { element: "МЕДЬ", question: "Золотисто-розовый металл с великолепной электропроводностью. Основной материал для электрических кабелей и проводов." },
    { element: "ЦИНК", question: "Этим металлом покрывают листы железа (гальванизация) для защиты крыш и ведер от ржавчины." },
    { element: "ГАЛЛИЙ", question: "Удивительный металл, который плавится прямо на ладони человеческой руки, так как его температура плавления всего 29,8°C." },
    { element: "ГЕРМАНИЙ", question: "Полупроводниковый элемент, открытый Клеменсом Винклером и названный в честь его родины. Использовался в самых первых транзисторах." },
    { element: "МЫШЬЯК", question: "Полуметалл, чьи соединения исторически известны как самые знаменитые яды средневековых королей." },
    { element: "СЕЛЕН", question: "Элемент, названный в честь Луны. Его проводимость резко меняется на свету, благодаря чему он незаменим в фотоэлементах." },
    { element: "БРОМ", question: "Единственный неметалл, который при комнатной температуре представляет собой тяжелую, летучую, зловонную жидкость красно-бурого цвета." },
    { element: "КРИПТОН", question: "Благородный газ, название которого переводится как «скрытый». Используется в мощных лампах фотовспышках и лазерах." },
    { element: "РУБИДИЙ", question: "Крайне активный щелочной металл, самовоспламеняющийся на воздухе. Назван по темно-красным линиям своего спектра." },
    { element: "СТРОНЦИЙ", question: "Металл, соли которого окрашивают праздничные салюты и фейерверки в ярко-карминовый красный цвет." },
    { element: "ИТТРИЙ", question: "Редкоземельный металл, названный в честь шведской деревни Иттербю. Важен для создания лазеров и сверхпроводников." },
    { element: "ЦИРКОНИЙ", question: "Блестящий металл, его выращенные прозрачные кристаллы (фианиты) внешне практически неотличимы от бриллиантов." },
    { element: "НИОБИЙ", question: "Металл-сверхпроводник, названный в честь дочери мифического царя Тантала из-за его постоянного нахождения в природе бок о бок с танталом." },
    { element: "МОЛИБДЕН", question: "Тугоплавкий металл, добавляемый в броню танков и стволы орудий для придания им невероятной стойкости и ударной прочности." },
    { element: "ТЕХНЕЦИЙ", question: "Первый элемент, полученный искусственным путем в лаборатории, так как стабильных изотопов на Земле он не имеет." },
    { element: "РУТЕНИЙ", question: "Платиновый металл, открытый профессором Карлом Клаусом в Казани и названный в честь России." },
    { element: "РОДИЙ", question: "Благородный драгоценный металл, один из самых дорогих в мире. Используется для покрытия ювелирных изделий из белого золота." },
    { element: "ПАЛЛАДИЙ", question: "Драгоценный металл, способный впитывать в себя водород как губка (в 900 раз больше собственного объема). Катализатор автопрома." },
    { element: "СЕРЕБРО", question: "Металл с самой высокой электро- и теплопроводностью среди всех известных элементов. Обладает бактерицидными свойствами." },
    { element: "КАДМИЙ", question: "Этот тяжелый металл используется в стержнях АЭС и старых аккумуляторах, но токсичен и вызывает болезнь 'Итай-Итай'." },
    { element: "ИНДИЙ", question: "Мягкий металл, при сгибании слитков которого слышен характерный «крик» (треск кристаллической решетки). Компонент тачскринов." },
    { element: "ОЛОВО", question: "Мягкий металл, из которого делали солдатиков. На сильном морозе рассыпается в серый порошок, что называют «чумой» этого металла." }
];
// Программный Web Audio API Синтезатор Half-Life звуков
let audioCtx = null;
function playSound(type) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode); gainNode.connect(audioCtx.destination);

        if (type === 'click') { // Обычный клик по клавише
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            osc.start(); osc.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'success') { // Буква угадана
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // Нота До
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // Нота Ми
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.25);
        } else if (type === 'error') { // Ошибка / БАНКРОТ (Бип-буп костюма HEV)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, audioCtx.currentTime);
            osc.frequency.setValueAtTime(120, audioCtx.currentTime + 0.12);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.25);
        }
    } catch(e) { console.log(e); }
}

// Переменные Google Forms (ЗАМЕНИТЕ СВОИМИ ДАННЫМИ)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfa2MiyY5pXBIubyga61UPT-NfAk516rOfl4td9owBWadajPQ/formResponse"; 
const FORM_ENTRIES = {
    name: "entry.996569099",   
    group: "entry.1905936571",  
    boughtItem: "entry.1800700401" // Сюда полетит название купленного бонуса
};
// Игровые переменные состояния терминала
let studentName = "";
let studentClass = "";
let currentQuestionsList = [];
let currentRoundIndex = 0;
let currentWord = "";
let openedLettersCount = 0;
let totalScore = 0;
let currentSectorValue = 0; 
let hasHevKit = false; // "Аптечка HEV" - защищает от одной неверной буквы

const alphabet = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

// Инициализация игры по клику на стартовом экране
document.getElementById('start-btn').addEventListener('click', () => {
    studentName = document.getElementById('student-name').value.trim();
    studentClass = document.getElementById('student-class').value.trim();
    
    if (!studentName || !studentClass) {
        alert("Авторизация отклонена терминалом Black Mesa.");
        return;
    }
    
    playSound('click');
    document.getElementById('display-name').textContent = studentName;
    
    // Формируем 10 случайных уникальных вопросов из общего пула в 50 штук
    currentQuestionsList = [...chemistryQuizData].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    initRound();
});
// Инициализация нового раунда
function initRound() {
    if (currentRoundIndex >= 10) {
        endGame();
        return;
    }
    
    document.getElementById('current-round').textContent = currentRoundIndex + 1;
    currentWord = currentQuestionsList[currentRoundIndex].element.toUpperCase();
    openedLettersCount = 0;
    
    // Очищаем и заново строим табло закрытых ячеек-сокетов букв
    const board = document.getElementById('word-board');
    board.innerHTML = '';
    for (let i = 0; i < currentWord.length; i++) {
        const socket = document.createElement('div');
        socket.className = 'socket';
        socket.dataset.letter = currentWord[i];
        board.appendChild(socket);
    }
    
    // Возвращаем интерфейс к шагу кручения барабана-генератора
    document.getElementById('question-text').innerHTML = "Для старта раунда активируйте генератор секторов на панели ниже.";
    document.getElementById('sector-display').textContent = "ОЖИДАНИЕ ЗАПУСКА";
    document.getElementById('keyboard').classList.add('disabled');
    document.getElementById('spin-btn').disabled = false;
    
    // Пересоздаем чистую клавиатуру без использованных букв
    renderKeyboard();
}

// Отрисовка клавиш экранной клавиатуры
function renderKeyboard() {
    const kbContainer = document.getElementById('keyboard');
    kbContainer.innerHTML = '';
    alphabet.split('').forEach(char => {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = char;
        key.addEventListener('click', () => handleKeyClick(key, char));
        kbContainer.appendChild(key);
    });
}
// Логика Барабана ("Генератора секторов")
document.getElementById('spin-btn').addEventListener('click', function() {
    playSound('click');
    this.disabled = true;
    
    const sectorDisplay = document.getElementById('sector-display');
    sectorDisplay.textContent = "АНАЛИЗ...";
    
    // Эффект вращения (быстрое мелькание случайных значений на табло)
    let ticks = 0;
    const interval = setInterval(() => {
        sectorDisplay.textContent = Math.random() > 0.3 ? `${(Math.floor(Math.random() * 8) + 1) * 100}` : "РАДИАЦИЯ";
        ticks++;
        if (ticks > 12) {
            clearInterval(interval);
            determineFinalSector();
        }
    }, 80);
});

// Фиксация выпавшего сектора и изменение состояния терминала
function determineFinalSector() {
    const sectorDisplay = document.getElementById('sector-display');
    const questionScreen = document.getElementById('question-text');
    const roll = Math.random();
    
    if (roll < 0.12) { 
        // Сектор РАДИАЦИОННЫЙ ВЫБРОС (БАНКРОТ)
        playSound('error');
        sectorDisplay.textContent = "☣️ ВЫБРОС!";
        questionScreen.innerHTML = `<span class="text-error">ВНИМАНИЕ: Произошел радиационный выброс! Все накопленные очки раунда аннулированы. Принудительный переход к следующему вопросу.</span>`;
        totalScore = Math.max(0, totalScore - 500); // Штрафуем общую сумму очков
        document.getElementById('display-score').textContent = totalScore;
        
        setTimeout(() => {
            currentRoundIndex++;
            initRound();
        }, 3500);
        
    } else if (roll < 0.20) {
        // Сектор АПТЕЧКА HEV (ПРИЗ / ХОД)
        playSound('success');
        sectorDisplay.textContent = "🔋 АПТЕЧКА HEV";
        hasHevKit = true;
        questionScreen.innerHTML = `<span class="text-success">Сектор Аптечка HEV! Активирована броня костюма Фримена. Вы застрахованы от одной ошибки. Назовите букву!</span>`;
        currentSectorValue = 200; // Базовая цена буквы для этого сектора
        document.getElementById('keyboard').classList.remove('disabled');
        
    } else {
        // Выпали стандартные баллы за букву
        playSound('click');
        const pointsPool =;
        currentSectorValue = pointsPool[Math.floor(Math.random() * pointsPool.length)];
        sectorDisplay.textContent = `+${currentSectorValue}`;
        
        // Выводим текст загадки на экран
        questionScreen.textContent = currentQuestionsList[currentRoundIndex].question;
        document.getElementById('keyboard').classList.remove('disabled');
    }
}
// Логика нажатия на буквы клавиатуры
function handleKeyClick(keyElement, letter) {
    keyElement.classList.add('used');
    const questionScreen = document.getElementById('question-text');
    
    // Проверяем наличие буквы в слове
    let matchFound = false;
    const sockets = document.querySelectorAll('.socket');
    
    sockets.forEach(socket => {
        if (socket.dataset.letter === letter && !socket.classList.contains('opened')) {
            socket.classList.add('opened');
            socket.textContent = letter;
            openedLettersCount++;
            matchFound = true;
            totalScore += currentSectorValue; // Добавляем очки за каждую угаданную букву
        }
    });
    
    document.getElementById('display-score').textContent = totalScore;
    
    if (matchFound) {
        playSound('success');
        // Проверяем, отгадано ли всё слово целиком
        if (openedLettersCount === currentWord.length) {
            questionScreen.innerHTML = `<span class="text-success">ОТЛИЧНО! Элемент ${currentWord} полностью идентифицирован. Переход к следующему сектору...</span>`;
            document.getElementById('keyboard').classList.add('disabled');
            setTimeout(() => {
                currentRoundIndex++;
                initRound();
            }, 2000);
        } else {
            // Если буква угадана, но слово не финал — крутим барабан заново под этот же вопрос
            questionScreen.textContent = "Буква открыта! Запустите генератор секторов для следующего хода.";
            document.getElementById('keyboard').classList.add('disabled');
            document.getElementById('spin-btn').disabled = false;
        }
    } else {
        // Выбранной буквы нет в слове
        if (hasHevKit) {
            playSound('click');
            hasHevKit = false; // Тратим защиту аптечки
            questionScreen.innerHTML = `Буквы "${letter}" нет. <span class="text-success">Но броня костюма HEV поглотила урон! Назовите другую букву.</span>`;
        } else {
            playSound('error');
            questionScreen.innerHTML = `<span class="text-error">Ошибка! Буквы "${letter}" нет на табло. Ход переходит к следующему раунду.</span>`;
            document.getElementById('keyboard').classList.add('disabled');
            setTimeout(() => {
                currentRoundIndex++;
                initRound();
            }, 2500);
        }
    }
}
// Переключение отображения выпадающей информации под слотами бонусов
function toggleDropdown(btnElement) {
    const content = btnElement.nextElementSibling;
    content.classList.toggle('show');
}

// Завершение 10 раундов и открытие Склада снабжения (Магазина бонусов)
function endGame() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('final-screen').classList.add('active');
    document.getElementById('final-score').textContent = totalScore;
    
    // Сканируем товары магазина и активируем кнопки в зависимости от набранных очков
    const rows = document.querySelectorAll('.shop-row');
    rows.forEach(row => {
        const price = parseInt(row.dataset.price);
        const buyBtn = row.querySelector('.buy-btn');
        if (totalScore >= price) {
            buyBtn.classList.add('affordable');
        } else {
            buyBtn.disabled = true;
            buyBtn.textContent = "НЕДОСТУПНО";
        }
    });
}

// Покупка СТРОГО одного бонуса и мгновенная отправка отчета учителю
function buyBonus(bonusId, price) {
    // Немедленно блокируем все кнопки магазина, исключая повторные покупки
    const allButtons = document.querySelectorAll('.buy-btn');
    allButtons.forEach(btn => btn.disabled = true);
    
    let bonusTextName = "";
    if (bonusId === 'lambda') bonusTextName = "Знак Лямбда (+1 балл)";
    if (bonusId === 'no-hw') bonusTextName = "Иммунитет от ДЗ";
    if (bonusId === 'book') bonusTextName = "Учебник на контрольной";
    if (bonusId === 'second-chance') bonusTextName = "Ампула Второй Шанс (Пересдача)";
    
    document.getElementById('sync-status').textContent = `Запрос на выдачу снаряжения: [${bonusTextName}]...`;
    
    // Формируем пакет данных для отправки в Google-Форму
    const formData = new FormData();
    formData.append(FORM_ENTRIES.name, studentName);
    formData.append(FORM_ENTRIES.group, studentClass);
    formData.append(FORM_ENTRIES.boughtItem, bonusTextName);
    
    // Отправка через CORS-bypass метод
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        document.getElementById('sync-status').innerHTML = `БОНУС <span class="text-success">${bonusTextName}</span> УСПЕШНО ДОБАВЛЕН В ИНВЕНТАРЬ. СООБЩИТЕ УЧИТЕЛЮ.`;
    })
    .catch((error) => {
        document.getElementById('sync-status').innerHTML = `<span class="text-error">СБОЙ СВЯЗИ. Покажите экран учителю для ручной фиксации бонуса!</span>`;
        console.error(error);
    });
}
