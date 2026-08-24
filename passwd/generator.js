document.addEventListener("DOMContentLoaded", () => {
    const genBtn = document.getElementById("gen-btn");
    const secretInput = document.getElementById("secret-mod");
    const countInput = document.getElementById("codes-count");
    const resultPanel = document.getElementById("result-panel");
    const tableBody = document.getElementById("table-body");

    // Функция эмуляции 32-битного знакового хэширования JS (алгоритм djb2)
    function calculateHash(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & 0xFFFFFFFF; // Удерживаем в рамках 32 бит
        }
        // Превращаем в знаковое 32-битное число (как в движках JS)
        if (hash >= 0x80000000) {
            hash -= 0x100000000;
        }
        return hash;
    }

    genBtn.addEventListener("click", () => {
        const targetMod = parseInt(secretInput.value);
        const targetCount = parseInt(countInput.value);

        if (isNaN(targetMod) || targetMod < 1 || targetMod >= 997) {
            alert("ОШИБКА: Неверный секретный остаток. Должен быть от 1 до 996.");
            return;
        }
        if (isNaN(targetCount) || targetCount < 1 || targetCount > 500) {
            alert("ОШИБКА: Количество кодов должно быть в диапазоне от 1 до 500.");
            return;
        }

        tableBody.innerHTML = "";
        let foundCount = 0;
        
        // Перебираем диапазон суффиксов, чтобы найти валидные коды
        // Шаблон кодов: M5-XXXX, где XXXX - числа от 1000 до 99999
        for (let i = 1000; i < 99999; i++) {
            const currentCode = `M5-${i}`;
            const hash = calculateHash(currentCode);
            const mod = Math.abs(hash) % 997;

            if (mod === targetMod) {
                foundCount++;
                
                // Создаем строку таблицы
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${foundCount}</td>
                    <td style="cursor: pointer; font-weight: bold; color: #ffb000;" class="code-cell">${currentCode}</td>
                `;
                
                // Механика копирования по клику
                row.querySelector(".code-cell").addEventListener("click", function() {
                    navigator.clipboard.writeText(this.textContent).then(() => {
                        const originalColor = this.style.color;
                        this.textContent = "СКОПИРОВАНО!";
                        this.style.color = "#00ff00";
                        setTimeout(() => {
                            this.textContent = currentCode;
                            this.style.color = originalColor;
                        }, 800);
                    });
                });

                tableBody.appendChild(row);
            }

            if (foundCount >= targetCount) {
                break;
            }
        }

        if (foundCount === 0) {
            tableBody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: #ff0000;">Коды для данного остатка не найдены. Попробуйте другой остаток.</td></tr>`;
        }

        resultPanel.style.display = "block";
    });
});
