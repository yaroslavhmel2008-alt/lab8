import fetch from 'node-fetch'; 
import { URLSearchParams } from 'url';
import fs from 'fs/promises'; // 1. ІМПОРТУЄМО модуль для роботи з файлами

// **********************************************************
// Допоміжна функція для генерації HTML-таблиці
// **********************************************************
function generateHtmlTable(peopleArray) {
    const headers = [ "Ім'я", "Прізвище", "Рік народження", "Стать", "Місто" ];
    const headerRow = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;

    const tableBody = peopleArray.map(person => `
        <tr>
            <td>${person.name || 'N/A'}</td>
            <td>${person.surname || 'N/A'}</td>
            <td>${person.birth_year || 'N/A'}</td>
            <td>${person.gender || 'N/A'}</td>
            <td>${person.location || 'N/A'}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Дані про людей з API (Node.js)</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>📋 Дані про людей (Node.js Fetch)</h1>
    <table>
        <thead>${headerRow}</thead>
        <tbody>${tableBody}</tbody>
    </table>
</body>
</html>
    `;
}

// **********************************************************
// Основна функція для отримання, обробки та збереження даних
// **********************************************************
async function fetchDataAndGenerateTable() {
    const BASE_URL = 'http://lab.vntu.org/api-server/lab8.php';
    const PARAMS = new URLSearchParams({
        user: 'student',
        pass: 'p@ssw0rd'
    });
    const FULL_URL = `${BASE_URL}?${PARAMS.toString()}`;

    console.log(`\nℹ️ Виконую запит до: ${FULL_URL}`);

    try {
        const response = await fetch(FULL_URL);
        if (!response.ok) {
            throw new Error(`HTTP-помилка! Статус: ${response.status}`);
        }

        const rawText = await response.text();
        console.log("➡️ Отриманий сирий JSON-текст (для перевірки):", rawText); 
        
        const dataObject = JSON.parse(rawText);

        let allPeople = [];
        if (Array.isArray(dataObject)) {
            allPeople = dataObject.flat(); // Розгортаємо двовимірний масив
        } 
        
        if (allPeople.length === 0) {
            console.log("\n⚠️ Попередження: Не вдалося отримати записи людей.");
            return;
        }

        // Генерація HTML-таблиці
        const htmlTable = generateHtmlTable(allPeople);

        // *** ЗБЕРЕЖЕННЯ У ФАЙЛ З ВИПРАВЛЕННЯМ КОДУВАННЯ ***
        const outputFileName = 'output.html';
        await fs.writeFile(outputFileName, htmlTable, { encoding: 'utf8' }); // !!! ВИПРАВЛЕНО КОДУВАННЯ !!!
        
        console.log(`\n✅ HTML-таблицю збережено у файл: ${outputFileName}. Відкрийте його у браузері.`);

    } catch (error) {
        console.error(`\n❌ Виникла помилка під час виконання: ${error.message}`);
    }
}

fetchDataAndGenerateTable();