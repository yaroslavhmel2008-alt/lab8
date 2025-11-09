// generateHtml.js

import fetch from 'node-fetch';

const API_URL = 'http://lab.vntu.org/api-server/lab8.php?user=student&pass=p@ssw0rd';

/**
 * Функція для генерації HTML-таблиці з масиву об'єктів.
 * @param {Array<Object>} records - Масив об'єктів (записи про людей).
 * @returns {string} - Рядок з готовим HTML-кодом таблиці.
 */
function generateHtmlTable(records) {
    if (!Array.isArray(records) || records.length === 0) {
        return '<p>Немає даних для відображення.</p>';
    }

    // Отримуємо ключі першого об'єкта для використання як заголовки стовпців
    const headers = Object.keys(records[0]);
    
    let html = `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Дані з API</title>
    <style>
        table {
            width: 80%;
            border-collapse: collapse;
            margin: 20px auto;
            font-family: Arial, sans-serif;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #4CAF50;
            color: white;
            text-transform: capitalize;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Дані про людей з API</h1>
    <table>
        <thead>
            <tr>
                ${headers.map(h => `<th>${h.charAt(0).toUpperCase() + h.slice(1)}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${records.map(row => `
                <tr>
                    ${headers.map(h => `<td>${row[h]}</td>`).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
    `;

    return html;
}

// ...
async function getAndGenerateHtml() {
    try {
        // ... (код для отримання відповіді)

        // 2. Декодування JSON (аналог json_decode())
        const data = await response.json();
        
        // !!! ВИПРАВЛЕННЯ ТУТ !!!
        // Припускаємо, що реальний масив даних знаходиться під ключем 'data'
        const peopleRecords = Array.isArray(data) ? data : data.data; 

        if (!Array.isArray(peopleRecords)) {
            // Додаткова перевірка, якщо ключ 'data' не існує
            console.error('Не вдалося знайти масив записів. Перевірте структуру JSON.');
            console.log(data); // Виведіть необроблені дані для перевірки
            return;
        }

        // ... (решта коду)
        const fullHtml = generateHtmlTable(peopleRecords);
        
        // Виводимо повний HTML-код у консоль
        console.log(fullHtml);

    } catch (error) {
        // ...
    }
}
// ...
getAndGenerateHtml();